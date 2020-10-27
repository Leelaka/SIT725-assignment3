var socket = null

const createRoom=()=>{
    let roomID = $('#create_roomID').val()
    if (!roomID) {
        alert('Sorry, room ID cannot be empty.')
        return false
    }
    let room = {
        roomID: roomID,
        num: 1,
        players: [],
    }
    socket.emit('createRoom',room)
}

const joinRoom=()=>{
    let roomID = $('#join_roomID').val()
    if (!roomID) {
        alert('Sorry, roomID cannot be empty.')
        return false
    }
    let room = {
        roomID: roomID
    }
    socket.emit('joinRoom',room)
}

const refresh=()=>{
    socket.emit('refresh')
}

const quit=()=>{
    socket.emit('quit')
}

const start=()=>{
    socket.emit('startGame')
}

const logout=()=>{
    window.location.replace('/index.html');
};

const sendMessage=()=>{
    let message = $('#messageInput').val();
    let name = $('#pasteMessage').text();
    console.log(name);
    let fullmessage = name + ' ' +  message;
        socket.emit('chat-message', fullmessage)
        message.value = ' ';
};

$(document).ready(function(){
    $('#send_message').hide()
    console.log('Game page ready')
    $('.modal').modal();
    socket = io();

    username = localStorage.getItem('username')

    socket.emit('welcomeMessage', username)
    socket.on('welcomeMessage', msg => {
        $('#Welcome').append($('<h4>').text(msg))
    })

    socket.on('createRoom', (msg)=>{
        if (msg[0]) {
            alert('Congratulation! Room has been created!')
            $('#create_room').hide()
            $('#join_room').hide()
            $('#view_rooms').hide()
            $('#send_message').show()
            room_id = '<p>You are currently in room ' + msg[1].roomID + ', players in this room:</p>'
            $('#room_status').append(room_id)
            for (var i = 0; i < msg[1].players.length; i++) {
                $('#room_players').append('<p>' + msg[1].players[i] + '</p>')
            }
            $('#btns').append('<button type="button" onclick="refresh()"> REFRESH </button>')
            $('#btns').append('<button type="button" onclick="quit()"> QUIT </button>')
            $('#btns').append('<button type="button" onclick="start()"> START </button>')
        }
        else {
            alert('Sorry, this room cannot be created since this roomID already exists.')
        }
    });

    socket.on('joinRoom', (msg)=>{
        if (msg[0]) {
            alert('Congratulation! Your have joined the room!')
            $('#create_room').hide()
            $('#join_room').hide()
            $('#view_rooms').hide()
            $('#send_message').show()
            room_id = '<p>You are currently in room ' + msg[1].roomID + ', players in this room:</p>'
            $('#room_status').append(room_id)
            for (var i = 0; i < msg[1].players.length; i++) {
                $('#room_players').append('<p>' + msg[1].players[i] + '</p>')
            }
            $('#btns').append('<button type="button" onclick="refresh()"> REFRESH </button>')
            $('#btns').append('<button type="button" onclick="quit()"> QUIT </button>')
            $('#btns').append('<button type="button" onclick="start()"> START </button>')
        }
        else {
            alert('Sorry, this room is full or does not exist.')
        }
    });

    socket.on('refresh', (msg)=>{
        if (msg) {
            $('#room_players').empty()
            for (var i = 0; i < msg.players.length; i++) {
                $('#room_players').append('<p>' + msg.players[i] + '</p>')
            }
        }
    });

    socket.on('quit', ()=>{
        $('#room_status').empty()
        $('#room_players').empty()
        $('#btns').empty()
        $('#create_room').show()
        $('#view_rooms').hide()
        $('#join_room').show()
        $('#send_message').hide()
    })

    socket.on('startGame', ()=>{
        $('#room_status').empty()
        $('#room_players').empty()
        $('#btns').empty()
        $('#view_rooms').hide()
        $('#send_message').show()
        $('#Game').append('<p>Game Start!</p>')
        }
    )

    socket.on('startFail', ()=>{
        alert('Not enough players need 2 players to continue!')
        }
    )

    socket.on('star')

    socket.on('chat-message', (data) => {
        $('#pasteMessages').append($('<li>').text( data ));

    });

    socket.on('user-connected', usernameData => {
        $('#pasteMessage').append($('<h5>').text(usernameData));
    });
});




