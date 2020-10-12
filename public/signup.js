let username = null;
let password = null;

const submit=()=>{
    let username = $('#username').val()
    let password = $('#password').val()
    let account = {
        username: username,
        password: password
    }
    console.log(account)
    $.ajax({
        url: '/accounts/api/account',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result) {
            alert('Account created')
        }
    })
}

const back=()=>{
    window.location.replace('/login.html')
}

$(document).ready(function(){
    console.log('Signup page ready')
})