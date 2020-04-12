
// variable global
let nomorPO = null;

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

function setTable(produk) {
    let table = $('#app .right .content .data-pesanan table tbody');

    produk.forEach(value => {
        table.append(`
            <tr>
                <td>${value.nama}</td>
                <td>${value.satuan}</td>
                <td>${value.jumlah}</td>
            </tr>
        `);
    });
}

function getDetail(nomorPO) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pemesanan/detail`,
        type: 'get',
        dataType: 'json',

        data: {
            'nomor_po': nomorPO
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setTable(response.data[0].detail_pemesanan);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

$(document).ready(() => {

    let pegawai = JSON.parse(localStorage.getItem('pegawai'));
    nomorPO = window.location.search.substring(1);

    if (pegawai) {
        if (pegawai.role_name !== 'Admin')
            window.history.back();
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    if (!nomorPO)
        window.history.back();

    getDetail(nomorPO);
    activeTab();
});