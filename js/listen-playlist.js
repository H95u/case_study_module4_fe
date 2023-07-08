function changePage(id) {
    window.location.href = "../login/listen-playlist.html?id=" + id;
}

function listenPlayList() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let content = ""
    $.ajax({
        url: 'http://localhost:8080/api/song-playlists/' + id,
        type: 'GET',
        success: function (response) {
            content += `<div class="music">
    <div class="music-thumb">
        <img src="/img/${response.thumbnail}" alt=""/>
    </div>
    <h3 class="music-name">${response.name}</h3>
    <label for="range"></label><input type="range" name="range" id="range" class="range"/>
    <audio src="${response.songs[0].mp3}" id="song" controls></audio>
 ${getListMusic(response.songs)}
</div>`
            let lyric = `<p>${response.songs[0].lyric}</p>`
            document.getElementById("play-music").innerHTML = content;
            document.getElementById("lyric").innerHTML = lyric;
            document.getElementById("song").play();
        }
    });
}

function getListMusic(listMusic) {
    let content = `<hr><table  style="width: 300px">`
    for (let i = 0; i < listMusic.length; i++) {
        content += getSongPlaylist(listMusic[i])
    }
    content += `</table>`
    return content;
}

function getSongPlaylist(song) {
    return `<tr>
<td><img src="${song.img}"></td>
<th>${song.name}</th>
<td> - ${song.singer.name}</td>
<td ><a href="#"> <span class="icon"><i class="bi bi-play-circle"></i></span>
</a></td>
</tr>`
}