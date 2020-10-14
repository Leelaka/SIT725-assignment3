console.log("send a log request");

let username = null;
let password = null;

const submit=()=>{
    // let username = $('#username').val();
    // let password = $('#password').val();
    // let account = {
    //     username: username,
    //     password: password
    // };
    // console.log(account);
    console.log("It's working");
    // $.ajax({
    //     url: '/login/api/verify',
    //     contentType: 'application/json',
    //     data: JSON.stringify(account),
    //     type: 'GET',
    //     success: function(result) {
    //         alert('Login!')
    //         // window.location.replace('/play.html')
    //     }
    // })
}

const register=()=>{
    window.location.replace('/signup.html')
}

const reset=()=>{
    $('#username').empty()
    $('#password').empty()
}

$(document).ready(function(){
    console.log('Signup page ready')
})

console.log("code ran");