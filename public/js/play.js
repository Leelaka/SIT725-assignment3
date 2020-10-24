$(document).ready(function(){
    console.log('Play page loaded up');
});

const back=()=>{
    alert('Visit us again');
    window.location.replace('./lobby.html');
};

const socket = io();
socket.on('message', message => {
alert(message);
});
 

