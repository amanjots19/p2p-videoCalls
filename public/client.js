var inputRoom = document.getElementById('room');
var btnEnter = document.getElementById('enter');
var divSelectRoom = document.getElementById('selectRoom');
var divVideos = document.getElementById('videos');

// variables and constants
var apiKey;
var sessionId;
var token;
var roomName;
var SERVER_BASE_URL = 'http://localhost:3000';

btnEnter.onclick = function () {
    if (inputRoom.value === '') {
        alert('Please type a room name');
    } else {
        roomName = inputRoom.value;

        fetch(SERVER_BASE_URL + '/room/' + roomName).then(function (res) {
          return res.json()
        }).then(function (res) {
          console.log(res.apiKey + "nhi arra");
            apiKey = res.apiKey;
            sessionId = res.sessionId;
            token = res.token;
            initializeSession();
        }).catch(handleError);
    }
}

function initializeSession() {

    divSelectRoom.style = "display: none";
    divVideos.style = "display: block";

    var session = OT.initSession(apiKey, sessionId);

    session.on('streamCreated', function (event) {
        session.subscribe(event.stream, 'subscribers', {
            insertMode: 'append',
            width: '360px',
            height: '240px'
        }, handleError);
    });
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '360px',
        height: '240px'
    }, handleError);

 
    session.connect(token, function (error) {
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}

function handleError(error) {
    if (error) {
        alert(error.message);
    }
}