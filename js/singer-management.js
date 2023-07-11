function getSong(singer) {
    return `<tr>
        <td>${singer.id}</td>
        <td>${singer.name}</td>
   
        <td><button class="btn btn-danger" onclick="deleteSinger(${singer.id})">Delete</button></td>
        <td><button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#updateSingerModal" onclick="showUpdate(${singer.id})">Update</button></td>
        </tr>`
}



function showAll() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/singers`,
        success: function (data) {
            let content = `<table class="table table-striped table-hover" style="margin: auto;width: 1000px;text-align: center"><tr> +
                <td>Mã</td>
                <td>Tên</td> 
            
                <td colspan="2">Thao tác</td></tr>`;
            for (let i = 0; i < data.length; i++) {
                content += getSong(data[i]);
            }
            content += `</table>`
            content += `<div style="text-align: center">`;
            content += `</div>`;
            document.getElementById("singerList").innerHTML = content;
        }
    });
}

function deleteSinger(id) {
    if (confirm("Bạn chắc chắn muốn xóa ?")) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8080/api/singers/" + id,
            success: showAll
        });
    }
}

function addNewSinger() {
    let name = $("#name").val();

    let singer = {
        name: name
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(singer),
        //tên API
        url: "http://localhost:8080/api/singers",
        //xử lý khi thành công
        success: showAll
    });
    $('#createSingerModal').modal('hide');
}

let updateId;
function showUpdate(id) {
    $.ajax({
        url: 'http://localhost:8080/api/singers/' + id,
        type: 'GET',
        success: function (response) {
            updateId = response.id;
            document.getElementById("name-u").value = response.name;
        }
    });
}

function updateSinger() {
    let nameUpdate = document.getElementById("name-u").value;

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/api/singers/' + updateId,
        type: 'PUT',
        data: JSON.stringify({name: nameUpdate}),

        success: showAll
    })
    $('#updateSingerModal').modal('hide');
}

function backToSongManage() {
    window.location.href = "song-management.html"
}