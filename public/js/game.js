var socket = null

const createRoom=()=>{
    socket.emit('createRoom')
}

const joinRoom=()=>{
    let roomID = $('#join_roomID').val()
    socket.emit('joinRoom', roomID)
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

const guard=()=>{
    socket.emit('guard')
}

const priest=()=>{
    socket.emit('priest')
}

const baron=()=>{
    socket.emit('baron')
}

const handmaid=()=>{
    socket.emit('handmaid')
}

const prince=()=>{
    socket.emit('prince')
}

const king=()=>{
    socket.emit('king')
}

const countess=()=>{
    socket.emit('countess')
}

const next_turn=()=>{
    socket.emit('next_turn')
}

const princess=()=>{
    socket.emit('princess')
}

const trade=()=>{
    let index = document.getElementById("targetPlayer").value
    socket.emit('trade', index)
}

const look=()=>{
    let index = document.getElementById("targetPlayer").value
    socket.emit('look', index)
}

const compare=()=>{
    let index = document.getElementById("targetPlayer").value
    socket.emit('compare', index)
}

const guess=()=>{
    let index = document.getElementById("targetPlayer").value
    let value = document.getElementById("cardTypes").value
    socket.emit('guess', index, value)
}

const drawCard=()=>{
    let index = document.getElementById("targetPlayer").value
    socket.emit('drawCard', index)
}

const back=()=>{
    socket.emit('back_room')
}

const sendMessage=()=>{
    let message = $('#messageInput').val();
    let name = $('#pasteMessage').text();
    console.log(name);
    let fullmessage = name + ' ' +  message;
        socket.emit('chat-message', fullmessage)
        message.value = ' ';
};

const viewRoom=()=>{
    socket.emit('roomCreated');

}

const instantJoin=()=>{
    let roomID = $('#displayrooms').text();
    socket.emit('joinRoom', roomID);
}

//when document is ready load funtions 

$(document).ready(function(){
    $('#view_rooms').show()
    $('#send_message').hide();
    console.log('Game page ready')
    $('.modal').modal();
    $('select').formSelect();
    socket = io();

    username = localStorage.getItem('username')

    socket.emit('welcomeMessage', username)
    socket.on('welcomeMessage', msg => {
        $('#Welcome').append($('<h4>').text(msg))
    })

    socket.on('room', (flag, room_msg, player_msg, btn_quit, btn_start)=>{
        if (flag) {
            $('#create_room').hide()
            $('#join_room').hide()
            $('#send_message').show()
            $('#view_rooms').hide()
            $('#room_status').empty()
            $('#room_players').empty()
            $('#btns').empty()
            $('#room_status').append(room_msg)
            $('#room_players').append(player_msg)
            $('#btns').append(btn_quit)
            $('#btns').append(btn_start)
        }
        else {
            alert(room_msg)
        }
    });

    socket.on('quit', ()=>{
        $('#room_status').empty()
        $('#room_players').empty()
        $('#btns').empty()
        $('#create_room').show()
        $('#join_room').show()
        $('#send_message').hide();
        $('#view_rooms').show()
    })

    socket.on('startGame', (players_msg, discarded_msg, remaining_msg, turn_msg, play_msg, card_one, card_two, btn_continue)=>{
        $('#room_status').empty()
        $('#room_players').empty()
        $('#btns').empty()
        $('#send_message').show()
        $('#view_rooms').hide()
        $('#room_status').append($('<p>').text(players_msg))
        $('#room_status').append($('<p>').text(discarded_msg))
        $('#room_status').append($('<p>').text(remaining_msg))
        $('#room_status').append($('<p>').text(turn_msg))
        $('#room_players').append($('<p>').text(play_msg))
        $('#room_players').append(card_one)
        if (card_two !== null) {
            $('#room_players').append(card_two)
        }
        if (btn_continue !== null) {
            $('#btns').append(btn_continue)
        }
    })

    socket.on('startFail', (msg)=>{
        alert(msg)
    })

    socket.on('one_msg_one_btn', (msg, btn)=>{
        $('#room_players').empty()
        $('#btns').empty()
        $('#room_players').append(msg)
        $('#btns').append(btn)
    })

    socket.on('one_selection', (selections, btn_confirm)=>{
        console.log(selections)
        $('#room_players').empty()
        $('#btns').empty()
        $('#room_players').append(selections)
        $('#btns').append(btn_confirm)
        $('select').formSelect();
    })

    socket.on('two_selections', (selections, cardTypes, btn_confirm)=>{
        $('#room_players').empty()
        $('#btns').empty()
        $('#room_players').append(selections)
        $('#room_players').append(cardTypes)
        $('#btns').append(btn_confirm)
        $('select').formSelect();
    })

    socket.on('two_msg_one_btn', (msg, msg2, btn)=>{
        $('#room_players').empty()
        $('#btns').empty()
        $('#room_players').append(msg)
        $('#room_players').append(msg2)
        $('#btns').append(btn)
    })

    socket.on('one_msg', (msg)=>{
        $('#room_players').empty()
        $('#btns').empty()
        $('#room_players').append(msg)
    })

    socket.on('chat-message', (data) => {
        $('#pasteMessages').append($('<li>').text( data ));
    });

    socket.on('user-connected', usernameData => {
        $('#pasteMessage').append($('<h5>').text(usernameData));
    });

    socket.on('roomCreated', roomiden =>{
        $('#displayrooms').append($('<a onclick="instantJoin()" href="#!" class="modal-close waves-effect waves-green btn-flat">Confirm</a>"').text(roomiden));
        console.log(roomiden)
    })
})


