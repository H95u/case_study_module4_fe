function getSong(song) {
    return `<tr>
        <td>${song.id}</td>
        <td>${song.name}</td>
        <td><img width="50" height="50" src="${song.img}"></td>
        <td><audio controls src="${song.mp3}"></audio></td>
        <td>${song.type.name}</td>
        <td>${song.singer.name}</td>
        <td><button class="btn btn-danger" onclick="deleteSong(${song.id})">Delete</button></td>
        <td><button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateSongModal" onclick="showUpdate(${song.id})">Update</button></td>
        </tr>`
}

let pageIndex = 0;

function showAll() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/songs?page=${pageIndex}`,
        success: function (data) {
            let content = `<table class="table table-striped table-hover" style="margin: auto;width: 1000px;text-align: center"><tr> 
                <td>Mã</td>
                <td>Tên</td> 
                <td>Ảnh</td> 
                <td>Nhạc</td> 
                <td>Thể loại</td> 
                <td>Ca sĩ</td> 
                <td colspan="2">Thao tác</td></tr>`;
            for (let i = 0; i < data.content.length; i++) {
                content += getSong(data.content[i]);
            }
            content += `</table>`
            content += `<div style="text-align: center">`;
            if (!data.first) {
                content += `<a href="#songList" class="btn btn-primary" onclick="prevPage()">Prev</a>`;
            }
            content += `${data.number + 1}|${data.totalPages}`;
            if (!data.last) {
                content += `<a href="#songList" class="btn btn-primary" onclick="nextPage()">Next</a>`;
            }
            content += `</div>`;
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


function getTypeOption(type) {
    return `<option value="${type.id}">${type.name}</option>`
}

function getAllSelectType(func) {

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/types",
        success: function (data) {
            if (func === "createS") {
                let content = `<select id="typeId">`
                for (let i = 0; i < data.length; i++) {
                    content += getTypeOption(data[i]);
                }
                content += `</select>`;
                document.getElementById("selectType").innerHTML = content;
            } else {
                let content = `<select id="typeId-u">`
                for (let i = 0; i < data.length; i++) {
                    content += getTypeOption(data[i]);
                }
                content += `</select>`;
                document.getElementById("selectType-u").innerHTML = content;
            }
        }
    });

}

function getSingerOption(singer) {
    return `<option value="${singer.id}">${singer.name}</option>`
}

function getAllSelectSinger(func) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/singers",
        success: function (data) {
            if (func === "createS") {
                let content = `<select id="singerId">`
                for (let i = 0; i < data.length; i++) {
                    content += getSingerOption(data[i]);
                }
                content += `</select>`;
                document.getElementById("selectSinger").innerHTML = content;
            } else {
                let content = `<select id="singerId-u">`
                for (let i = 0; i < data.length; i++) {
                    content += getSingerOption(data[i]);
                }
                content += `</select>`;
                document.getElementById("selectSinger-u").innerHTML = content;
            }
        }
    });

}

function addNewSong() {
    let formData = getFormData();

    $.ajax({
        url: "http://localhost:8080/api/songs",
        processData: false,
        contentType: false,
        type: "POST",
        data: formData,
        success: function () {
            showAll();
            alert("Đã thêm mới bài hát thành công !!")
        }
    })
    $('#createSongModal').modal('hide');
}

function getFormData() {
    let name = $("#name").val()
    let lyric = $("#lyric").val()
    let typeId = $("#typeId").val()
    let singerId = $("#singerId").val()
    let image = $("#img")[0].files[0]
    let mp3 = $("#mp3")[0].files[0]
    lyric = lyric.replace(/\n/g, "<br>");
    let song = {
        name: name,
        lyric: lyric,
        type: {
            id: typeId
        },
        singer: {
            id: singerId
        }
    }

    let formData = new FormData()
    formData.append("image", image)
    formData.append("mp3", mp3)
    formData.append("song", new Blob([JSON.stringify(song)], {type: "application/json"}))
    return formData;
}

function getFormDataUpdate() {
    let name = $("#name-u").val()
    let lyric = $("#lyric-u").val()
    let typeId = $("#typeId-u").val()
    let singerId = $("#singerId-u").val()
    let image = $("#img-u")[0].files[0]
    let mp3 = $("#mp3-u")[0].files[0]
    lyric = lyric.replace(/\n/g, "<br>");
    let song = {
        name: name,
        lyric: lyric,
        type: {
            id: typeId
        },
        singer: {
            id: singerId
        }
    }

    let formData = new FormData()
    formData.append("image", image)
    formData.append("mp3", mp3)
    formData.append("song", new Blob([JSON.stringify(song)], {type: "application/json"}))
    return formData;
}


function deleteSong(id) {
    if (confirm("Bạn chắc chắn muốn xóa ?")) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8080/api/songs/" + id,
            success: function () {
                showAll();
                alert("Đã xóa bài hát thành công !!")
            }
        });
    }
}

let updateId;

function showUpdate(id) {
    $.ajax({
        url: 'http://localhost:8080/api/songs/' + id,
        type: 'GET',
        success: function (response) {
            updateId = response.id;
            $("#name-u").val(response.name);
            $("#lyric-u").val(response.lyric);
            getAllSelectType("update");
            getAllSelectSinger("update");
        }
    });
}

function updateSong() {
    let formData = getFormDataUpdate();
    $.ajax({
        url: "http://localhost:8080/api/songs/" + updateId,
        processData: false,
        contentType: false,
        type: "PUT",
        data: formData,
        success: function () {
            showAll();
            alert("Đã cập nhật bài hát thành công !!")
        }
    })
    $('#updateSongModal').modal('hide');
}
