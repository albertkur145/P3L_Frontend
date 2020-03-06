
// variable global
let id = null;


function activeTab() {
    $('#app .left .pegawai-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}pegawai.html`;
}

// append tanggal dan tahun lahir
function appendTTL() {
    for (let i = 1950; i <= 2020; i++) {
        $('#app .right .content select#tahun').append(`
            <option value="${i}">${i}</option>
        `);
    }

    for (let i = 1; i <= 31; i++) {
        if (i <= 9) {
            $('#app .right .content select#tanggal').append(`
                <option value="0${i}">${i}</option>
            `);
        } else {
            $('#app .right .content select#tanggal').append(`
                <option value="${i}">${i}</option>
            `);
        }
    }
}

// form
const form = $('#app .right .content form');
const nama = $('#nama', form);
const alamat = $('#alamat', form);
const nohp = $('#nohp', form);
const tanggal = $('#tanggal', form);
const bulan = $('#bulan', form);
const tahun = $('#tahun', form);
const username = $('#username', form);
const password = $('#password', form);
const role = $('#role', form);

const regexHP = /^08[0-9]{8,10}$/;

function validateNamaPegawai() {
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

function validateUsername() {
    $('.username-already-error', form).css('display', 'none');
    if (username.val().length === 0)
        $('.username-error', form).css('display', 'block');
    else
        $('.username-error', form).css('display', 'none');
}

function validatePassword() {
    if (password.val().length < 6 && !id)
        $('.password-error', form).css('display', 'block');
    else
        $('.password-error', form).css('display', 'none');
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
    
    if (nama.val().length !== 0 && alamat.val().length !== 0 &&
    regexHP.test(nohp.val()) && validateTTL === 1 &&
    username.val().length !== 0 && (password.val().length >= 6 || id)) {
        const params = {
            "nama": nama.val(),
            "alamat": alamat.val(),
            "tanggal_lahir": tahun.val() + "-" + bulan.val() + "-" + tanggal.val(),
            "no_hp": nohp.val(),
            "username": username.val(),
            "role_id": role.val()
        }

        if (!id) {
            params.password = password.val();
            reqAPI('post', params);
        } else {
            params.id = id;
            reqAPI('put', params);
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

    if (username.val().length === 0)
        $('.username-error', form).css('display', 'block');

    if (password.val().length < 6 && !id)
        $('.password-error', form).css('display', 'block');

    return false;
}

function reqAPI(type, params) {
    $.ajax({
        url: `${API}pegawai/`,
        type: type,
        dataType: 'json',
        data: params,

        success: function (response) {
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan pegawai');
                $('.popup-message').css('display', 'flex');
            }
        },

        error: function() {
            $('.username-already-error', form).css('display', 'block');
        }
    });
}

function getData(id) {
    $.ajax({
        url: `${API}pegawai/`,
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },

        success: function (response) {
            if (response.code === 200)
                setForm(response.data[0]);
        }
    });
}

function setForm(data) {
    password.attr('disabled', 'disabled');
    password.css('cursor', 'no-drop');
    const ttl = data.tanggal_lahir.split('-');

    nama.val(data.nama);
    alamat.val(data.alamat);
    nohp.val(data.no_hp);
    username.val(data.username);
    tanggal.val(ttl[2]);
    bulan.val(ttl[1]);
    tahun.val(ttl[0]);
    role.val(data.role_id);
}

function getAllRole() {
    $.ajax({
        url: `${API}rolepegawai/`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            if (response.code === 200)
                setRole(response.data);
        }
    });
}

function setRole(data) {
    data.forEach(value => {
        role.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}


$(document).ready(() => {
    appendTTL();
    getAllRole();

    id = window.location.search.substring(1);

    if (id)
        getData(id);

    activeTab();
});