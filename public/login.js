let username = null;
let password = null;

const submit=()=>{
    let username = $('#username').val()
    let password = $('#password').val()
    let account = {
        username: username,
        password: password
    }
    $.ajax({
        url: '/login/api/verify',
        contentType: 'application/json',
        data: JSON.stringify(account),
        type: 'POST',
        success: function(result) {
            if (result.result == 200) {
                alert('Login successful!')
                window.location.replace('/home.html')
            }
            else if (result.result == 404) {
                alert('Sorry, the username or password is incorrect.')
            }
        }
    })
}

const register=()=>{
    window.location.replace('/signup.html')
}

const reset=()=>{
    $('#username').empty()
    $('#password').empty()
}

$(document).ready(function(){
    console.log('Login page ready')
})