function onClickRegisterEvent() {

    email = document.getElementById('input_login').value
    password = document.getElementById('input_password').value
    console.log("Email=", email, " Password=", password)

    data = window.localStorage;

    users = JSON.parse(data.getItem("users"));
    current = users.find(item => item.login == email)

    if (email.length == 0 || password.length == 0) {
        alert("Enter Email and password!")
        return
    }

    if (current) {
        alert('User with this email already exist!')
        return
    }

    users.push({
        'login': email,
        'password': password
    })

    data.setItem('users', JSON.stringify(users));
    data.setItem('isLoginned', 1);
    data.setItem('currentUser', JSON.stringify(email))

    window.location.href = '/'
}




// for (let i = 0; i < 50000; i++) document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'a' }));