function isLogin(data) {

    login_button = document.getElementById('login_button');
    logout_button = document.getElementById('logout_button');


    if (data.getItem('isLoginned') == '1') {
        logout_button.style.display = 'block';
        login_button.style.display = 'none';
        return true;
    } else {
        logout_button.style.display = 'none';
        login_button.style.display = 'block';
        return false;
    }
}


function logoutClick() {
    console.log("logout click")
    data = window.localStorage;
    data.setItem('isLoginned', 0)
    window.location.href = '/login.html'
}



function parseDate(date) {

    let hours = date.getHours();
    if (hours < 10) hours = "0" + hours;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;

    return hours + ":" + minutes + " " + date.toLocaleDateString();

}

function refreshChatSections() {

    let messages = JSON.parse(data.getItem("messages")) || [];
    let currentUser = JSON.parse(data.getItem("currentUser"));

    data = window.localStorage;
    let picked = data.getItem('picked')

    console.log("Mess=", messages, " current=", currentUser)

    messages.forEach(item => {
        if (item.from == currentUser && item.to == picked) {
            addOutgoingMessage(item.text, item.date_time);
        } else if (item.from == picked && item.to == currentUser) {
            addInboxMessage(item.text, item.date_time);
        }
    })
}



function addOutgoingMessage(text, date_time) {

    let date = new Date(date_time);
    let date_string = parseDate(date);

    console.log("INBOX=", text, " date=", date_time)
    console.log("INBOX=", text, " date=", date)
    console.log("Date stromg=", date_string)

    const div = document.createElement('div');
    div.className = 'outgoing_msg';

    div.innerHTML = `
        <div class="sent_msg">
            <p>${text}</p>
            <span class="time_date"> ${date_string}</span>
        </div>
    `;

    document.getElementById('msg_history').appendChild(div);
}


function addInboxMessage(text, date_time) {

    let date = new Date(date_time);
    let date_string = parseDate(date);

    console.log("INBOX=", text, " date=", date_time)

    const div = document.createElement('div');
    div.className = 'incoming_msg';

    div.innerHTML = `
        <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
        </div>
        <div class="received_msg">
            <div class="received_withd_msg">
                <p>${text}</p>
                <span class="time_date">${date_string}</span>
            </div>
        </div>
    `;

    document.getElementById('msg_history').appendChild(div);
}


function addUserToUserList(user, date_time, text) {

    data = window.localStorage;
    picked = data.getItem('picked');
    console.log("PICCKED=", picked)

    let date = new Date(date_time);
    let date_string = parseDate(date);

    const div = document.createElement('div');
    if (!picked || picked == user) {
        div.className = 'chat active_chat';
        data.setItem('picked', user)
    } else {
        div.className = 'chat';
    }
    div.id = "list_" + user;

    div.innerHTML = `
    <div class="chat" id="${user}" onclick="chatOnClick(this.id)">
        <div class="chat_img">
            <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
        </div>
        <div class="chat_ib">
            <h5>${user}<span class="chat_date">${date_string}</span></h5>
            <p>${text}</p>
        </div>
    </div>
    `;

    document.getElementById('chat_list').appendChild(div);
}


function refreshUsersSections() {

    messages = JSON.parse(data.getItem("messages")) || [];
    currentUser = JSON.parse(data.getItem("currentUser"));
    picked = data.getItem("picked");
    console.log("Picked!")

    all_users = {};

    let a = {
        "firsrt second": "Hi!"
    }


    messages.forEach(item => {

        let user = null;

        if (item.from == currentUser) {
            user = item.to;
            all_users[user] = {
                date: new Date(item.date_time).getTime(),
                text: ""
            }
            if (item.to != picked) all_users[user].text = "";
        } else if (item.to == currentUser) {
            user = item.from;
            all_users[user] = {
                date: new Date(item.date_time).getTime(),
                text: ""
            }
        } else {
            all_users[item.from] = {
                date: new Date(item.date_time).getTime(),
                text: ""
            }
            all_users[item.to] = {
                date: new Date(item.date_time).getTime(),
                text: ""
            }
        }

    });

    users_array = []
    for (let item in all_users) {
        users_array.push({ user: item, value: all_users[item].date, text: all_users[item].text });
    }
    users_array.sort((a, b) => {
        if (a.value < b.value) return 1;
        return -1;
    })

    console.log("Current=", currentUser, " picked=", picked)

    users_array.forEach(item => {
        messages.forEach(message => {
            if ((message.to == currentUser && message.from == item.user) ||
                (message.to == item.user && message.from == currentUser)) {
                item.text = message.text;
            }
        })
    })

    users_array.forEach(item => {
        addUserToUserList(item.user, new Date(item.value), item.text);
    })
}


function clearChatSections() {

    let message_div = document.getElementById('msg_history');

    while (message_div.firstChild) {
        message_div.removeChild(message_div.lastChild);
    }
}

function clearUsersSections() {
    let message_div = document.getElementById('chat_list');

    while (message_div.firstChild) {
        message_div.removeChild(message_div.lastChild);
    }
}


function chatOnClick(id) {
    console.log("Chat on click!! e=", id)

    let data = window.localStorage;
    let before = data.getItem('picked');

    let before_elem = document.getElementById("list_" + before);
    let picked_elem = document.getElementById("list_" + id);

    if (before_elem) before_elem.className = "chat";
    if (picked_elem) picked_elem.className = "chat active_chat"

    data.setItem("picked", id)

    clearChatSections();
    refreshChatSections();
}


function sendMessage() {
    let button_text = document.getElementById('message_text').value
    document.getElementById('message_text').value = ""

    data = window.localStorage;
    let messages = JSON.parse(data.getItem("messages")) || [];

    let currentUser = JSON.parse(data.getItem("currentUser"));
    let toUser = data.getItem('picked');
    console.log("From=", currentUser, " to=", toUser);

    messages.push({
        from: currentUser,
        to: toUser,
        text: button_text,
        date_time: new Date()
    })


    data.setItem("messages", JSON.stringify(messages));
    console.log("All messages=", messages)
    clearChatSections();
    clearUsersSections();
    refreshUsersSections();
    refreshChatSections();
}


window.onload = () => {

    data = window.localStorage;
    let isLoggined = isLogin(data);

    console.log("IN on load!")

    clearChatSections();
    clearUsersSections();
    if (isLoggined) {
        refreshUsersSections();
        refreshChatSections();
    }
}