function login() {
    let username = $("#username").val()
    let password = $("#password").val()

    let user = {
        username: username,
        password: password
    }

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem("token"),
        },
        url: "http://localhost:8080/api/auth/login",
        type: "POST",
        data: JSON.stringify(user),
        success: function (data) {
            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("loggingUser", data)
            $("#username").val("")
            $("#password").val("")
            alert("Đăng nhập thành công !!")
            location.reload();
        },
        error: function () {
            alert("Đăng nhập thất bại !")
        }
    })
    $('#auth').modal('hide');
}

function logout() {
    sessionStorage.clear()
    location.reload();
}


function register() {
    let username = $("#username-r").val()
    let password = $("#password-r").val()

    let user = {
        username: username,
        password: password,
        roles: [
            {
                id: 2
            }
        ]
    }

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8080/api/auth/register",
        type: "POST",
        data: JSON.stringify(user),
        success: function () {
            $("#username-r").val("")
            $("#password-r").val("")
            alert("Register successfully!")
        }
    })
    $('#auth-r').modal('hide');
}

function loggingUser() {
    let loggingUser = sessionStorage.getItem("loggingUser");
    if (loggingUser != undefined) {
        document.getElementById("register-login").innerHTML = `<button class="btn btn-danger" onclick="logout()">Đăng xuất</button>`
    }
}


