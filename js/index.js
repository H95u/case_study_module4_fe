function getSong(song) {
    return `<hr class="hr-border"><div class="col-lg-1">
                    <img src="${song.img}">
                </div>
                <div class="col-lg-6">
                    <h6>${song.name}</h6>
                    <p>${song.singer.name}</p>
                </div>
                <div class="col-lg-3">
            <p>Thể loai</p>
                  <h6>${song.type.name}</h6>
                </div>
                <div class="col-lg-1">
                    <a href="#">
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