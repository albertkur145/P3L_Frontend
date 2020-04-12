// variable global
let num;

function enter() {
    if (event.keyCode === 13) {
        getDataByName($('#keyword').val());
    }
}

function activeTab() {
    $('#app .left .pemesanan-tab').addClass('active-tab');
}

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}pemesanan.html`;
}

function setTable(data) {
    let table = $('#app .right .content .data .table tbody');
    table.html('');

    data.forEach((value, i) => {
        value.tanggal_masuk == null ? value.tanggal_masuk = '-' : value.tanggal_masuk = value.tanggal_masuk;

        table.append(`
            <tr>
                <th>${num}</th>
                <td>${value.nomor_po}</td>
                <td>${value.supplier_name}</td>
                <td>${value.tanggal_pesan}</td>
                <td>${value.tanggal_masuk}</td>
                <td>${value.status}</td>
                <td><a href="${BASE_URL}pemesanan-form.html?${value.nomor_po}"><i class="fas fa-pen edit"></i></a> <i class="fas fa-times delete ml-1" style="font-size: 1.1875rem; cursor: pointer;" onclick="showMessageConfirm('${value.nomor_po}')"></i> <i class="fas fa-print ml-1" style="font-size: 1rem; cursor: pointer; color: #666" onclick="showMessageConfirmPrinted('${value.nomor_po}', '${value.status}')"></i> <i class="fas fa-check-circle ml-1 text-success" style="font-size: 1.0625rem; cursor: pointer;" onclick="showMessageConfirmOrder('${value.nomor_po}')"></i></td>
            </tr>
        `);
        num += 1;
    });
}

function showMessageConfirm(nomorPO) {
    $('.confirm-message .message p').html('Yakin ingin membatalkan pemesanan ini?');
    $('.confirm-message').css('display', 'flex');
    $('.confirm-message .message .confirm').attr('onclick', `deleteData('${nomorPO}')`);
}

function showMessageConfirmPrinted(nomorPO, status) {
    if (status == 'Dipesan') {
        $('.confirm-message .message p').html('Setelah ini, pemesanan tidak akan bisa <br>diubah lagi. Kamu yakin?');
        $('.confirm-message').css('display', 'flex');
        $('.confirm-message .message .confirm').attr('onclick', `printPemesanan('${nomorPO}')`);
    } else
        printPemesanan(`${nomorPO}`);
}

function showMessageConfirmOrder(nomorPO) {
    $('.confirm-message .message p').html('Kamu yakin pesananmu sudah datang?');
    $('.confirm-message').css('display', 'flex');
    $('.confirm-message .message .confirm').attr('onclick', `orderCame('${nomorPO}')`);
}

function hideConfirmMessage() {
    $('.confirm-message').css('display', 'none');
}

function orderCame(nomorPO) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pemesanan/ordercame`,
        type: 'post',
        dataType: 'json',
        data: {
            nomor_po: nomorPO
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                hideConfirmMessage();
                $('.popup-message .message p').text('Pemesanan berhasil dikonfirmasi');
                $('.popup-message').css('display', 'flex');
            }
        },

        error: function (response) {
            hideConfirmMessage();
            $('.loading').css('display', 'none');

            if (response.responseJSON.code === 411) {
                $('.popup-message .message p').text('Pesanan ini harus dicetak terlebih dahulu');
                $('.popup-message').css('display', 'flex');
            } else {
                $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function printPemesanan(nomorPO) {
    hideConfirmMessage();
    window.open(`${API}pemesanan/printorder?nomor_po=${nomorPO}`, '_blank');
    window.location.href = `${BASE_URL}pemesanan.html`;
}

function deleteData(nomorPO) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pemesanan/delete`,
        type: 'post',
        dataType: 'json',
        data: {
            nomor_po: nomorPO
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                hideConfirmMessage();
                $('.popup-message .message p').text('Pemesanan berhasil dibatalkan');
                $('.popup-message').css('display', 'flex');
            }
        },

        error: function (response) {
            hideConfirmMessage();
            $('.loading').css('display', 'none');

            if (response.responseJSON.code === 409) {
                $('.popup-message .message p').text('Pemesanan ini sudah tidak bisa dibatalkan');
                $('.popup-message').css('display', 'flex');
            } else {
                $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getAllData(page = 1) {
    $('.loading').css('display', 'flex');
    num = (page * 10) - 9;

    $.ajax({
        url: `${API}Pemesanan/paging`,
        type: 'get',
        dataType: 'json',

        data: {
            page: page
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                addPaging(response.amount, page);
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

function addPaging(amount, page) {
    let paging = $('#app .right .content .data .paging');
    paging.html('');

    for (let i = 1; i <= Math.ceil(amount / 10); i++) {
        paging.append(`
            <span class="page paging-${i}" onclick="getAllData(${i})">${i}</span>
        `);
    }

    $(`#app .right .content .data .paging-${page}`).addClass('paging-active');
}

function getDataByName(nomorPO) {
    $('.loading').css('display', 'flex');

    let paging = $('#app .right .content .data .paging');
    paging.html('');
    num = 1;

    $.ajax({
        url: `${API}Pemesanan`,
        type: 'get',
        dataType: 'json',
        data: {
            nomor_po: nomorPO
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

    getAllData();
    activeTab();
});
