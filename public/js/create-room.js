$(document).ready(function(){
    console.log('Create room page is ready');
    Alert('im running');
});

const back=()=>{
    window.location.replace('./lobby.html');
};

const create=()=>{
    window.location.replace('./generate-code.html');
};
