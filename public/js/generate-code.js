
const client = io();

client.on('gameCode', handleGameCode);
// client.on('sendCode', handleGameCode);

const displayGameCode = document.getElementById('displayGameCode');

const back=()=>{
    window.location.replace('./lobby.html');
};

const join=()=>{
    window.location.replace('./play.html');

};
    
// function processAjaxData(response, urlPath){
//     document.getElementById("content").innerHTML = response.html;
//     document.title = response.pageTitle;
//     window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
// }

function handleGameCode(gameCode){
    console.log('well im working');
    displayGameCode.innerText = gameCode;
}

// function handleMessage(message){
//     console.log('well im working');
//     displayGameCode.innerText = message;
// }

// function handleGameCode(sendCode){
//     console.log('well im working');
//     displayGameCode.innerText = sendCode;
// }

$(document).ready(function(){
    console.log('Generate code page is ready');
});
