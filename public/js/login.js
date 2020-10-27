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
                localStorage.setItem('username', account.username)
                alert('Login successful!')
                window.location.replace('./html/game.html')
            }
            else if (result.result == 404) {
                alert('Sorry, the username or password is incorrect.')
            }
        }
    })
}

const register=()=>{
    window.location.replace('./html/signup.html')
}

const reset=()=>{
    document.getElementById('username').value = ''
    document.getElementById('password').value = ''
}

$(document).ready(function(){
    console.log('Login page ready')
})
