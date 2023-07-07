function findAll() {
    $.ajax({
        url: "http://localhost:8080/api/song-playlists",
        type: "GET",
        success: function (playlist) {
            getPlaylist(playlist.content)
        }
    })
}

function getPlaylist(value) {
    let content = `<div class="playlist-container"><div class="row">`
    for (let i = 0; i < value.length; i++) {
        content += `<div class="col-lg-3">
<div class="playlist">
<a>
<img src="/img/${value[i].thumbnail}" class="image">
</a>
<h5 class="playlist-name">${value[i].name}</h5>
</div>

</div>`
    }
    content += `</div></div>`
    document.getElementById("playlist").innerHTML = content
}