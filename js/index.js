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
                    <a href="#">
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
            showLeaderBoard()
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
    return ` <tr>
                <td>
                    <img src="${song.img}">
                </td>
                <td>
                    <p>${song.singer.name}</p>
                    <p>${song.listenCount}</p>
                </td>
            </tr>`
}

function showLeaderBoard() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/songs/leaderboard`,
        success: function (data) {
            let content = ` <h2 class="title"> BẢNG XẾP HẠNG</h2><table>`

            for (let i = 0; i < data.content.length; i++) {
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

function changeListenPage(id) {
    window.location.href = "../login/mp3-song.html?id=" + id;
}

function listenMusic() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    $.ajax({
        url: 'http://localhost:8080/api/songs/' + id,
        type: 'GET',
        success: function (response) {
            let content = `<div class="music">
    <div class="music-thumb">
        <img src="https://source.unsplash.com/random" alt=""/>
    </div>
    <h3 class="music-name">${response.name}</h3>
    <label for="range"></label><input type="range" name="range" id="range" class="range"/>
    <audio src="${response.mp3}" id="song" controls></audio>
  
    <div class="controls">
        <ion-icon name="infinite-outline" class="play-infinite"></ion-icon>
        <ion-icon name="play-back" class="play-back"></ion-icon>
        <div class="play">
            <div class="player-inner">
                <ion-icon name="play" class="play-icon"></ion-icon>
            </div>
        </div>
        <ion-icon name="play-forward" class="play-forward"></ion-icon>
        <ion-icon name="repeat-outline" class="play-repeat"></ion-icon>
    </div>
</div>`
            document.getElementById("play-music").innerHTML = content;
        }
    });
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
  
  <a href="#"><span class="icon"><i class="bi bi-play-circle"></i></span></a>
  </div>
</div>
</div>`
    }
    content += `</div></div>`
    document.getElementById("songList").innerHTML = content
    showLeaderBoard()
}

