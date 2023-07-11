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
            sessionStorage.setItem("loggingUserId", data.id)
            sessionStorage.setItem("permit", data.authorities[0].authority)
            console.log(data.id)
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
    window.location.href = "http://localhost:63342/case_study_module4_fe/login/home.html?_ijt=t4e8mcfdo4dp8lvp278oe15hia&_ij_reload=RELOAD_ON_SAVE";
    alert("Đăng xuất thành công !!")
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
            alert("Đăng ký thành công !!")
        }
    })
    $('#auth-r').modal('hide');
}

function loggingUser() {
    let permit = sessionStorage.getItem("permit")
    let loggingUserId = sessionStorage.getItem("loggingUserId");
    if (loggingUserId != undefined) {
        let content = "";
        if (permit === "ROLE_ADMIN") {
            content += `<a href="#" class="navbar-item" onclick="changePageManagement()">Đến giao diện quản lý</a>`
        }
        content += `<a href="http://localhost:63342/case_study_module4_fe/login/listen-my-playlist.html?_ijt=gogip56rojohguusac1gpu6sdf&_ij_reload=RELOAD_ON_SAVE" class="navbar-item">Playlist của bạn</a>`
        document.getElementById("see-playlist").innerHTML = content
        document.getElementById("register-login").innerHTML = `<button class="btn btn-danger" onclick="logout()">Đăng xuất</button>`
    }
}

function loggingMyPlaylist() {
    document.getElementById("register-login").innerHTML = `<button class="btn btn-danger" onclick="logout()">Đăng xuất</button>`
}


let index = 0;

let playListIndex;

function seeMyPlaylist(plIndex) {
    let loggingUserId = sessionStorage.getItem("loggingUserId");
    playListIndex = plIndex;
    $.ajax({
        url: "http://localhost:8080/api/user-playlists/user/" + loggingUserId,
        type: "GET",
        success: function (data) {
            let songContent = `<table class="table table-hover">`;
            let content = `<table class="table table-hover" id="table" style="text-align: center">`
            for (let i = 0; i < data.length; i++) {
                content += getMyPlaylistName(data[i], i, data[i].id);
            }

            songContent += getSongPlaylist(data[playListIndex].song)
            content += `</table>`
            if (data[playListIndex].song[index] != undefined) {
                songContent += `</table>`
                document.getElementById("my-playlist").innerHTML = content;
                document.getElementById("songList").innerHTML = songContent;
                document.getElementById("lyric").innerHTML = `<p>${data[playListIndex].song[index].lyric}</p>`;
                document.getElementById("my-playlist-title").innerHTML = `<h1 class="playlist-name"> ${data[playListIndex].name}</h1>`;
                document.getElementById("mid-mid").innerHTML = `<img src="${data[playListIndex].song[index].img}" style="height: 100%; width: 100%">`;
                document.getElementById("listen-music").innerHTML = `<audio id="song" src="${data[playListIndex].song[index].mp3}" controls>`;
                document.getElementById("song").play();
            } else {
                document.getElementById("my-playlist").innerHTML = content;
                document.getElementById("lyric").innerHTML = "";
                document.getElementById("my-playlist-title").innerHTML = `<h1 class="playlist-name"> ${data[playListIndex].name}</h1>`;
                document.getElementById("songList").innerHTML = `<h1 style="text-align: center">Không có bài hát nào</h1>`
                document.getElementById("listen-music").innerHTML = "";
            }
        },
        error: function () {
            alert("Lỗi !")
        }
    })
}

function getMyPlaylistName(playlist, playListIndex, playListId) {
    return `<tr>
<td><a href="#" onclick="seeMyPlaylist(${playListIndex})">${playlist.name}</a></td>
<td><a href="#"><i class="bi bi-x-circle" onclick="deletePlaylist(${playListId})" style="color: red"></a></i></td>
</tr> `
}


function getSongPlaylist(songList) {
    let content = "";
    for (let i = 0; i < songList.length; i++) {
        content += `<tr>
<th colspan="2">${songList[i].name} - ${songList[i].singer.name}</th>
<td ><a href="#" onclick="updateIndex(${i})"><span class="icon"><i class="bi bi-play-circle"></i></span>
<td><a href="#"><i class="bi bi-x-circle" onclick="deleteSongPlaylist(${songList[i].id})"  style="color: red"> </a></i></td>
</a></td>
</tr>`
    }
    return content;
}

function updateIndex(i) {
    index = i;
    seeMyPlaylist(playListIndex)
}

function changePageManagement() {
    window.location.href = "../admin/song-management.html"
}

function deletePlaylist(playlistId) {
    if (confirm("Bạn chắc chắn muốn xóa ?")) {
        $.ajax({
            url: "http://localhost:8080/api/user-playlists/" + playlistId,
            type: "DELETE",
            success: function () {
                alert("Xóa thành công !!");
                window.location.reload();
            },
            error: function () {
                alert("Lỗi !")
            }
        })
    }
}

function deleteSongPlaylist(songId) {
    if (confirm("Bạn chắc chắn muốn xóa ?")) {
        $.ajax({
            url: "http://localhost:8080/api/user-playlists/delete-song/" + songId,
            type: "DELETE",
            success: function () {
                alert("Xóa thành công !!");
                window.location.reload();
            },
            error: function () {
                alert("Lỗi !")
            }
        })
    }
}

function backToHome() {
    window.location.href = "../login/home.html"
    showAll();
}
