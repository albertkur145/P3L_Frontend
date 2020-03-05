
function enter() {
    if (event.keyCode === 13) {
        getDataByName($('#keyword').val());
    }
}

function activeTab() {
    $('#app .left .jenis-hewan-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}jenis-hewan.html`;
}

function setTable(data) {
    let table = $('#app .right .content .data .table tbody');
    table.html('');

    data.forEach((value, i) => {
        value.updated_at === null ? value.updated_at = '-' : value.updated_at;
        table.append(`
            <tr>
                <th>${i+1}</th>
                <td>${value.nama}</td>
                <td>${value.created_at}</td>
                <td>${value.updated_at}</td>
                <td><a href="${BASE_URL}jenis-hewan-form.html?${value.id}"><i class="fas fa-pen edit"></i></a> <i class="fas fa-times delete ml-1" style="font-size: 1.1875rem; cursor: pointer;" onclick="showMessageConfirm(${value.id})"></i></td>
            </tr>
        `);
    });
}

function showMessageConfirm(id) {
    $('.confirm-message').css('display', 'flex');
    $('.confirm-message .message .confirm').attr('onclick', `deleteData(${id})`);
}

function hideConfirmMessage() {
    $('.confirm-message').css('display', 'none');
}

function deleteData(id) {
    $.ajax({
        url: `${API}jenishewan`,
        type: 'delete',
        dataType: 'json',
        data: {
            id: id
        },

        success: function(response) {
            if (response.code === 200) {
                hideConfirmMessage();
                $('.popup-message .message p').text('Data berhasil dihapus dari sistem');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getAllData() {
    $.ajax({
        url: `${API}jenishewan`,
        type: 'get',
        dataType: 'json',

        success: function(response) {
            if (response.code === 200) {
                setTable(response.data);
            }
        }
    });
}

function getDataByName(name) {
    $.ajax({
        url: `${API}jenishewan`,
        type: 'get',
        dataType: 'json',
        data: {
            nama: name
        },

        success: function (response) {
            if (response.code === 200) {
                $('#app .right .content .emptyTable').css('display', 'none');
                setTable(response.data);
            }
        },

        error: function (response) {
            if(response.responseJSON.code === 404) {
                $('#app .right .content .data .table tbody').html('');
                $('#app .right .content .emptyTable').css('display', 'block');
            }
        }
    });
}

$(document).ready(() => {
    getAllData();
    activeTab();
});
