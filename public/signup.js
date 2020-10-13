let username = null;
let password = null;

const submit=()=>{
    let username = $('#username').val()
    let password = $('#password').val()
    if (username.length<6||username.length>15) {
        alert('Sorry, this account cannot be created since a username must be between 6 to 15 characters.')
        return false
    }
    if (password.length<10||password.length>24) {
        alert('Sorry, this account cannot be created since a password must be between 10 to 24 characters.')
        return false
    }
    let account = {
        username: username,
        password: password
    }
    console.log(account)
    $.ajax({
        url: '/signup/api/account',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result) {
            alert('Congratulation! Your account has been created!')
        }
    })
}

const back=()=>{
    window.location.replace('/login.html')
}

const help=()=>{
    window.location.replace('/help.html')
}

$(document).ready(function(){
    console.log('Signup page ready')
})