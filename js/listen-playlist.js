function changePlaylistPage(id) {
    window.location.href = "../login/listen-playlist.html?id=" + id;
}

let albumId;
let songIndex;

function listenPlayList(index) {
    songIndex = index;
    const urlParams = new URLSearchParams(window.location.search);
    albumId = urlParams.get('id');
    let content = ""
    $.ajax({
        url: 'http://localhost:8080/api/song-playlists/' + albumId,
        type: 'GET',
        success: function (response) {
            content += `<div class="music">
<h3 class="music-name">${response.name}</h3>
    <div class="music-thumb">
        <img src="/img/${response.thumbnail}" alt=""/>
    </div>
    <h3 class="music-name">${response.songs[songIndex].name}</h3>
    <label for="range"></label><input type="range" name="range" id="range" class="range"/>
    <audio src="${response.songs[songIndex].mp3}" id="song" controls></audio>
 ${getListMusic(response.songs)}
</div>`
            let lyric = `<p>${response.songs[songIndex].lyric}</p>`
            document.getElementById("play-music").innerHTML = content;
            document.getElementById("lyric").innerHTML = lyric;
            document.getElementById("song").play();
        }
    });
}

function getListMusic(listMusic) {
    let content = `<hr><table class="table" >`
    for (let i = 0; i < listMusic.length; i++) {
        content += getSongPlaylist(listMusic[i], i)
    }
    content += `</table>`
    return content;
}

function getSongPlaylist(song, index) {
    return `<tr>
<td><img src="${song.img}"></td>
<th colspan="2">${song.name} - ${song.singer.name}</th>
<td ><a href="#" onclick="listenPlayList(${index})"> <span class="icon"><i class="bi bi-play-circle"></i></span>
</a></td>
</tr>`
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
        <img src="${response.img}" alt=""/>
    </div>
    <h3 class="music-name">${response.name} - ${response.singer.name}</h3>
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
            let lyric = `<p>${response.lyric}</p>`
            document.getElementById("play-music").innerHTML = content;
            document.getElementById("lyric").innerHTML = lyric;
            document.getElementById("song").play();
        }
    });
}

function backToHome() {
    window.location.href = "http://localhost:63343/case_study_module4_fe/login/login.html?_ijt=1qsjtpncvffebbe7pm63tse658&_ij_reload=RELOAD_ON_SAVE"
    showAll();
}
