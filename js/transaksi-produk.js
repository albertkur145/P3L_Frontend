

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-transaksi-produk').addClass('tab-active');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
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
                <td><i class="far fa-eye edit" onclick="getByNoTransaksi('${value.no_transaksi}')"></i> <i class="fas fa-times delete ml-1" onclick="showMessageConfirm(${value.no_transaksi})"></i></td>
            </tr>
        `);
    });
}

function getByNoTransaksi(noTransaksi) {
    window.location.href = `${BASE_URL}transaksi-produk-detail.html?${noTransaksi}`;
}

function getAll() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiProduk`,
        type: 'get',
        dataType: 'json',

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setTable(response.data);
        },

        error: function() {
            $('.loading').css('display', 'none');
            $('#app .data-content .emptyTable').css('display', 'block');
        }
    });
}

$(document).ready(() => {
    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai) {
        getAll();
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    tabActive();
});