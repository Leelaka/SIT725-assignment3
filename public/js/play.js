$(document).ready(function(){
    console.log('Play page loaded up');
});

const socket = io();

socket.on('message', message => {
    alert(message);
});

const back=()=>{
    alert('Visit us again');
    window.location.replace('./lobby.html');
};

 

