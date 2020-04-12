function enter() {
    if (event.keyCode === 13) {
        getLogByName($('#keyword').val());
    }
}

function activeTab() {
    $('#app .left .log-aktivitas-tab').addClass('active-tab');
}

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
}

function setTable(data) {
    let table = $('#app .right .content .data table tbody');

    table.html('');
    data.forEach(value => {
        value.tanggal_masuk == null ? value.tanggal_masuk = '-' : value.tanggal_masuk = value.tanggal_masuk;
        value.updated_at == null ? value.updated_at = '-' : value.updated_at = value.updated_at;
        value.deleted_at == null ? value.deleted_at = '-' : value.deleted_at = value.deleted_at;

        table.append(`
            <tr>
                <td>${value.nomor_po}</td>
                <td>${value.supplier_name}</td>
                <td>${value.tanggal_pesan}</td>
                <td>${value.tanggal_masuk}</td>
                <td>${value.status}</td>
                <td>${value.created_at}</td>
                <td>${value.updated_at}</td>
                <td>${value.deleted_at}</td>
                <td>Admin</td>
                <td><i class="far fa-eye edit" style="cursor: pointer;" onclick="redirectToDetailPemesanan('${value.nomor_po}')"></i></td>
            </tr>
        `);
    });
}

function redirectToDetailPemesanan(nomorPO) {
    window.location.href = `${BASE_URL}log-aktivitas-pemesanan-detail.html?${nomorPO}`;
}

function getAllLog() {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pemesanan/log`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setTable(response.data);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function getLogByName(nomorPO) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pemesanan/log`,
        type: 'get',
        dataType: 'json',

        data: {
            'nomor_po': nomorPO
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('#app .right .content .emptyTable').css('display', 'none');
                setTable(response.data);
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 404) {
                $('#app .right .content .data .table tbody').html('');
                $('#app .right .content .emptyTable').css('display', 'block');
            }
        }
    });
}

$(document).ready(() => {

    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai) {
        if (pegawai.role_name !== 'Admin')
            window.history.back();
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    getAllLog();
    activeTab();
});