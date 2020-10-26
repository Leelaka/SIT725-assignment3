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
    $.ajax({
        url: '/signup/api/account',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result) {
            if (result.result == 200) {
                alert('Congratulation! Your account has been created!')
            }
            else if (result.result == 404) {
                alert('Sorry, this account cannot be created since this username already exists.')
            }
        }
    })
}

const back=()=>{
    window.location.replace('/index.html')
}

$(document).ready(function(){
    console.log('Signup page ready')
    $('.modal').modal();
})

//SignUp functionalities
const button = document.querySelector('.btn')
const form   = document.querySelector('.form')

button.addEventListener('click', function() {
   form.classList.add('form--no') 
});