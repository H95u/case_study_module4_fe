function getSong(song) {
    return `<hr class="hr-border"><div class="col-lg-2">
                    <img src="${song.img}">
                </div>
                <div class="col-lg-5">
                    <h6>${song.name}</h6>
                    <p>${song.singer.name}</p>
                </div>
                <div class="col-lg-3">
            <p>Thể loai</p>
                  <h6>${song.type.name}</h6>
                </div>
                <div class="col-lg-1">
                    <a href="#" onclick="changeListenPage(${song.id})">
                        <span class="icon"><i class="bi bi-play-circle"></i></span>
                    </a>
                </div>
                <div class="col-lg-1">
                    <a href="#" onclick="getAllPlaylistOfUser(${song.id})">
                        <span class="icon"><i class="bi bi-heart"></i></span>
                    </a>
                </div>`
}

let pageIndex = 0;

function showAll() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/songs?page=${pageIndex}`,
        success: function (data) {
            let content = `<h2 class="title">DANH SÁCH BÀI HÁT</h2>
<div class="container">
<div class="row">`;
            for (let i = 0; i < data.content.length; i++) {
                content += getSong(data.content[i]);
            }
            content += `</div>`
            content += `<div style="text-align: center">`;
            if (!data.first) {
                content += `<a href="#songList" class="btn btn-primary" onclick="prevPage()">Prev</a>`;
            }
            content += `${data.number + 1}|${data.totalPages}`;
            if (!data.last) {
                content += `<a href="#songList" class="btn btn-primary" onclick="nextPage()">Next</a>`;
            }
            content += `</div></div>`;
            document.getElementById("songList").innerHTML = content;
        }
    });
}

function prevPage() {
    pageIndex--;
    showAll();
}

function nextPage() {
    pageIndex++;
    showAll();
}

function getSongLeaderBoard(song) {
    return `<tr>    
                <td>
                    <a href="#" onclick="changeListenPage(${song.id})"><p style="font-size: 15px">${song.name} <br> <span style="font-size: 10px">${song.singer.name}</span></p></a>
                    <p class="listen-count">lượt nghe : ${song.listenCount}</p>
                </td>
            </tr>`
}

function showLeaderBoard() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/songs/leaderboard`,
        success: function (data) {
            let content = `<table class="table">`
            let rank = 0;
            for (let i = 0; i < data.content.length; i++) {
                content += `<td rowspan="2" style="padding-top: 30px">${++rank}</td>`
                content += getSongLeaderBoard(data.content[i]);
            }
            content += `</table>`;
            document.getElementById("leaderBoard").innerHTML = content;
        }
    });
}

function searchByName() {
    let name = $("#name-search").val()
    $.ajax({
        url: `http://localhost:8080/api/songs/search?name=${name}`,
        type: "GET",
        success: function (data) {
            let content = `<h2 class="title">DANH SÁCH BÀI HÁT</h2>
                             <div class="container-song">
                                        <div class="inner-container">
                                               <div class="row">`;
            for (let i = 0; i < data.content.length; i++) {
                content += getSong(data.content[i])
            }
            content += `</div>`;
            content += `</div>`;
            document.getElementById("songList").innerHTML = content;
        }
    })
}


function findAllPlaylist() {
    $.ajax({
        url: "http://localhost:8080/api/song-playlists",
        type: "GET",
        success: function (playlist) {
            getPlaylist(playlist.content)
        }
    })
}


function getPlaylist(value) {
    let content = `<h2 class="title">DANH SÁCH PLAYLIST HOT NHẤT</h2>
<div class="playlist-container"><div class="row" style="text-align: center">`
    for (let i = 0; i < value.length; i++) {
        content += `<div class="col-lg-3">
<div class="card" >
  <img src="/img/${value[i].thumbnail}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${value[i].name}</h5>
  
  <a href="#" onclick="changePlaylistPage(${value[i].id})"><span class="icon"><i class="bi bi-play-circle"></i></span></a>
  </div>
</div>
</div>`
    }
    content += `</div></div>`
    document.getElementById("songList").innerHTML = content
}

function createPlaylist() {
    let loggingUserId = getLoggingUserId();
    if (isNaN(loggingUserId)) {
        alert("Bạn phải đăng nhập để tạo playlist !!");
        $('#auth').modal('show');
    } else {
        let playlistName = prompt("Mời bạn nhập tên playlist !!")
        if (playlistName) {
            let newPlaylist = {
                user: {
                    id: loggingUserId
                },
                name: playlistName
            }
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: "http://localhost:8080/api/user-playlists",
                type: "POST",
                data: JSON.stringify(newPlaylist),
                success: function () {
                    alert("Tạo mới playlist thành công !")
                    window.location.reload();
                }
            })
        }
    }
}

function addSongToPlaylist() {
    let songId = parseInt(sessionStorage.getItem("songId"));
    let playlistId = $("#playListId").val();
    let playlistSongsDTO = {
        playlistId: playlistId,
        songId: songId
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8080/api/user-playlists/add-song",
        type: "POST",
        data: JSON.stringify(playlistSongsDTO),
        success: function () {
            alert("Thêm bài hát thành công !")
            $('#selectPlaylistModal').modal('hide');
        }
    })
}


function getAllPlaylistOfUser(songId) {
    sessionStorage.setItem("songId", songId);
    let loggingUserId = getLoggingUserId();
    if (isNaN(loggingUserId)) {
        alert("Bạn phải đăng nhập để thêm bài hát vào playlist !!");
        $('#auth').modal('show');
    } else {
        $.ajax({
            url: `http://localhost:8080/api/user-playlists/user/${loggingUserId}`,
            type: "GET",
            statusCode: {
                200: function (data) {
                    if (data.length !== 0) {
                        let content = `<select id="playListId" class="form-control" onfocus='this.size=5;' onblur='this.size=1;' onchange='this.size=1; this.blur();'>`;
                        for (let i = 0; i < data.length; i++) {
                            content += getSelectPlaylist(data[i]);
                        }
                        content += `</select>`;
                        document.getElementById("selectPlaylist").innerHTML = content;
                        $('#selectPlaylistModal').modal('show');
                    } else {
                        alert("Bạn chưa có playlist nào !!");
                    }
                },
                204: function () {
                    alert("Bạn chưa có playlist nào !! Tạo ngay !!");
                    createPlaylist();
                }
            }
        });
    }
}


function getSelectPlaylist(playlist) {
    return `<option value="${playlist.id}">${playlist.name}</option>`
}

function getLoggingUserId() {
    return parseInt(sessionStorage.getItem("loggingUserId"));
}

