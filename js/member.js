
// variable global
let num;
let timeout = null;

function searchData() {
    const search = $('#app .content .data-content .head .search');
    const keyword = $('input', search).val();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        getByName(keyword);
    }, 700);
}

function tabActive() {
    $('.tab-member').addClass('tab-active');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
}

function showMessageConfirm(id) {
    $('.confirm-message').css('display', 'flex');
    $('.confirm-message .message .confirm').attr('onclick', `deleteByID(${id})`);
}

function hideConfirmMessage() {
    $('.confirm-message').css('display', 'none');
}

function appendTTL() {
    for (let i = 1950; i <= 2020; i++) {
        $('#app .section-right .form select#tahun').append(`
            <option value="${i}">${i}</option>
        `);
    }

    for (let i = 1; i <= 31; i++) {
        if (i <= 9) {
            $('#app .section-right .form select#tanggal').append(`
                <option value="0${i}">${i}</option>
            `);
        } else {
            $('#app .section-right .form select#tanggal').append(`
                <option value="${i}">${i}</option>
            `);
        }
    }
}

function resetForm() {
    nama.removeAttr('data-id');

    nama.val('');
    alamat.val('');
    tanggal.val('01');
    bulan.val('01');
    tahun.val('1950');
    nohp.val('');

    $('.nama-error', form).css('display', 'none');
    $('.alamat-error', form).css('display', 'none');
    $('.ttl-error', form).css('display', 'none');
    $('.nohp-error', form).css('display', 'none');
}

// form
const form = $('#app .section-right .form');
const nama = $('#nama', form);
const alamat = $('#alamat', form);
const tanggal = $('#tanggal', form);
const bulan = $('#bulan', form);
const tahun = $('#tahun', form);
const nohp = $('#nohp', form);

const regexHP = /^08[0-9]{8,10}$/;

function validateNama() {
    if (nama.val().length === 0)
        $('.nama-error', form).css('display', 'block');
    else
        $('.nama-error', form).css('display', 'none');
}

function validateAlamat() {
    if (alamat.val().length === 0)
        $('.alamat-error', form).css('display', 'block');
    else
        $('.alamat-error', form).css('display', 'none');
}

function validateNoHP() {
    if (!regexHP.test(nohp.val()))
        $('.nohp-error', form).css('display', 'block');
    else
        $('.nohp-error', form).css('display', 'none');
}

tanggal.focusout(() => {
    $('.ttl-error', form).css('display', 'none');
});

bulan.focusout(() => {
    $('.ttl-error', form).css('display', 'none');
});

tahun.focusout(() => {
    $('.ttl-error', form).css('display', 'none');
});

function validateTanggalLahir(tgl, bln, thn) {
    if (tgl == 31 && !(bln == 1 || bln == 3 || bln == 5 || bln == 7 || bln == 8 || bln == 10 || bln == 12))
        return 0;

    if (tgl > 28 && bln == 2) {
        if (tgl == 29 && thn % 4 == 0)
            return 1; 
        else
            return 0;
    }

    return 1;
}

function validateForm() {
    let validateTTL = validateTanggalLahir(tanggal.val(), bulan.val(), tahun.val());
    let id = nama.attr('data-id');

    if (nama.val().length !== 0 && alamat.val().length !== 0 &&
    regexHP.test(nohp.val()) && validateTTL === 1) {
        const params = {
            "nama": nama.val(),
            "alamat": alamat.val(),
            "tanggal_lahir": tahun.val() + "-" + bulan.val() + "-" + tanggal.val(),
            "no_hp": nohp.val(),
            "is_member": 1,
            "pegawai_id": 3,
        }

        if (!id)
            reqAPI('create', params);
        else {
            params.id = id;
            reqAPI('update', params);
        }
    }

    if (nama.val().length === 0)
        $('.nama-error', form).css('display', 'block');

    if (alamat.val().length === 0)
        $('.alamat-error', form).css('display', 'block');

    if (validateTTL === 0)
        $('.ttl-error', form).css('display', 'block');

    if (!regexHP.test(nohp.val()))
        $('.nohp-error', form).css('display', 'block');
}

function reqAPI(type, params) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Customer/${type}`,
        type: 'post',
        dataType: 'json',
        data: params,

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan customer');
                $('.popup-message').css('display', 'flex');
                resetForm();
                getAllData();
            }
        },

        error: function() {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setTable(data) {
    let table = $('#app .data-content .data .table tbody');
    table.html('');

    data.forEach((value, i) => {
        table.append(`
            <tr>
                <th>${num}</th>
                <td>${value.nama}</td>
                <td>${value.alamat}</td>
                <td>${value.tanggal_lahir}</td>
                <td>${value.no_hp}</td>
                <td><i class="fas fa-pen edit" onclick="getDataByID(${value.id})"></i> <i class="fas fa-times delete ml-1" onclick="showMessageConfirm(${value.id})"></i></td>
            </tr>
        `);
        num += 1;
    });
}

function getAllData(page = 1) {
    $('.loading').css('display', 'flex');
    num = (page * 10) - 9;

    $.ajax({
        url: `${API}Customer/paging`,
        type: 'get',
        dataType: 'json',

        data: {
            page: page
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            $('#app .data-content .emptyTable').css('display', 'none');
            if (response.code === 200) {
                $('#app .data-content .data .paging').css('display', 'block');
                addPaging(response.amount, page);
                setTable(response.data);
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 404) {
                $('#app .data-content .data .table tbody').html('');
                $('#app .data-content .emptyTable').css('display', 'block');
                $('#app .data-content .data .paging').css('display', 'none');
            }
        }
    });
}

function addPaging(amount, page) {
    let paging = $('#app .data-content .data .paging');
    paging.html('');

    for (let i = 1; i <= Math.ceil(amount / 10); i++) {
        paging.append(`
            <span class="page paging-${i}" onclick="getAllData(${i})">${i}</span>
        `);
    }

    $(`#app .data-content .data .paging-${page}`).addClass('paging-active');
}

function getByName(nama) {
    $('.loading').css('display', 'flex');

    let paging = $('#app .data-content .data .paging');
    paging.html('');
    num = 1;

    $.ajax({
        url: `${API}Customer/member`,
        type: 'get',
        dataType: 'json',
        data: {
            nama: nama
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('#app .data-content .emptyTable').css('display', 'none');
                setTable(response.data);
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if(response.responseJSON.code === 404) {
                $('#app .data-content .data .table tbody').html('');
                $('#app .data-content .emptyTable').css('display', 'block');
            }
        }
    });
}

function deleteByID(id) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Customer/delete`,
        type: 'post',
        dataType: 'json',
        data: {
            id: id,
            pegawai_id: '5'
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                hideConfirmMessage();
                $('.popup-message .message p').text('Data berhasil dihapus dari sistem');
                $('.popup-message').css('display', 'flex');
                getAllData();
            }
        },

        error: function () {
            hideConfirmMessage();
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function getDataByID(id) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Customer/member`,
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                setForm(response.data[0]);
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setForm(value) {
    let ttl = value.tanggal_lahir.split('-');

    nama.attr('data-id', value.id);

    nama.val(value.nama);
    alamat.val(value.alamat);
    tanggal.val(ttl[2]);
    bulan.val(ttl[1]);
    tahun.val(ttl[0]);
    nohp.val(value.no_hp);
}

$(document).ready(() => {
    tabActive();
    appendTTL();
    getAllData();
});