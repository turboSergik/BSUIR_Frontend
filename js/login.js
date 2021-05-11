function onClickEvent() {
    console.log("On click!")

    email = document.getElementById('input_login').value
    password = document.getElementById('input_password').value
    console.log("Email=", email, " Password=", password)

    data = window.localStorage;

    users = JSON.parse(data.getItem("users")) || [];
    console.log("Users=", users)

    current = users.find(item => item.login == email && item.password == password)
    console.log("Users=", users)

    if (!current) {
        alert('Invalid user name or passowrd!')
        return
    }


    data.setItem('current', JSON.stringify(current));
    data.setItem('isLoginned', 1);
    data.setItem('currentUser', JSON.stringify(email));

    window.location.href = '/'
}




// for (let i = 0; i < 50000; i++) document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'a' }));