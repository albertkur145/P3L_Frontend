
// variable global
let code;

const form = $('.login .form');
const username = $('#username', form);
const password = $('#password', form);

function validateLogin() {
    const params = {
        'username': username.val(),
        'password': password.val()
    };

    postLogin(params);
    return false;
}

function postLogin(params) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Pegawai/login`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function(response) {
            if (response.code === 200) {
                code = response.code;
                $('.loading').css('display', 'none');
                $('.popup-message .message p').text('Autentifikasi akun berhasil');
                $('.popup-message').css('display', 'flex');

                localStorage.setItem('pegawai', JSON.stringify(response.data));
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 400) {
                code = response.responseJSON.code;
                $('.popup-message .message p').text('Username atau password salah');
                $('.popup-message').css('display', 'flex');
            } else {
                $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function hidePopup() {
    $('.popup-message').css('display', 'none');

    if (code === 200) {
        let pegawai = JSON.parse(localStorage.getItem('pegawai'));

        if (pegawai.role_name === 'Admin')
            window.location.href = `${BASE_URL}jenis-hewan.html`;
        else
            alert('Bukan admin');
    }
}

$(document).ready(() => {

    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai) {
        code = 200;
        
        $('.popup-message .message p').text('Anda telah masuk ke dalam sistem');
        $('.popup-message').css('display', 'flex');
    }

});