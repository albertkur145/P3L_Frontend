// variable global
let timeout = null;

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-riwayat-transaksi').addClass('tab-active');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
}

function searchData() {
    const search = $('#app .content .data-content .head .search');
    const keyword = $('input', search).val();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        getByName(keyword);
    }, 700);
}

function setTable(data) {
    let table = $('#app .data-content .data .table tbody');
    table.html('');

    data.forEach((value, i) => {
        let datetime = value.tanggal.split(' ');
        let date = datetime[0].split('-');

        table.append(`
            <tr>
                <th>${i+1}</th>
                <td>${value.no_transaksi}</td>
                <td>${date[2]}-${date[1]}-${date[0]}</td>
                <td>${datetime[1]} WIB</td>
                <td>${value.status}
                <td><i class="far fa-eye edit" onclick="getByNoTransaksi('${value.no_transaksi}')"></i></td>
            </tr>
        `);
    });
}

function getByNoTransaksi(noTransaksi) {
    window.location.href = `${BASE_URL}riwayat-transaksi-layanan-detail.html?${noTransaksi}`;
}

function getAll() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiLayanan/completecanceled`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setTable(response.data);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('#app .data-content .emptyTable').css('display', 'block');
        }
    });
}

function getByName(noTransaksi) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiLayanan/completecanceled`,
        type: 'get',
        dataType: 'json',

        data: {
            no_transaksi: noTransaksi
        },

        success: function (response) {
            $('#app .data-content .emptyTable').css('display', 'none');
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setTable(response.data);
        },

        error: function () {
            $('#app .data-content .data .table tbody').html('');
            $('#app .data-content .emptyTable').css('display', 'block');
            $('.loading').css('display', 'none');
        }
    });
}

$(document).ready(() => {
    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai)
        getAll();
    else
        window.location.href = `${BASE_URL}cpanel.html`;

    tabActive();
});