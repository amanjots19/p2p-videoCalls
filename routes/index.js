var express = require("express");
var router = express.Router();
var OpenTok = require("opentok");
require('dotenv').config();

var apiKey = '47326481';
var secret = 'ea286b1fbe95611ea0e4d10bd26273494c06e5dd';

console.log(apiKey + ' hum h idhr')
var rooms = {};

if (!apiKey || !secret) {
  console.log("Missing API SECRET or API KEY");
  process.exit;
}

var opentok = new OpenTok(apiKey, secret);

router.get("/", (req,res,next) => {
  res.render('index.html');
})
router.get('/room/:name', function (req, res) {
  var roomName = req.params.name;
  console.log(roomName,apiKey);
  var sessionId;
  var token;
  console.log('attempting to create a session associated with the room: ' + roomName);
  if (rooms[roomName]) {
    sessionId = rooms[roomName];

    // generate token
    token = opentok.generateToken(sessionId);
    res.setHeader('Content-Type', 'application/json');
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  }
  else {
    opentok.createSession({ mediaMode: 'routed' }, function (err, session) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: 'createSession error:' + err });
        return;
      }
      rooms[roomName] = session.sessionId;

      // generate token
      token = opentok.generateToken(session.sessionId);
      res.setHeader('Content-Type', 'application/json');
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token
      });
    });
  }
});

module.exports = router;
