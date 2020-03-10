// variable global
let id = null;


// generate format rupiah
function generateRupiah(angka) {
    if (angka != 0) {
        let harga = angka.toString();                           // misal : 75250330

        let sisa = harga.length % 3;                            // cari sisa bagi length, hasil : 2
        let rupiah = harga.substring(0, sisa);                  // substring untuk dapat angka depan, hasil : 75
        let belakang = harga.substring(sisa).match(/\d{3}/g);   // substring untuk dapat angka belakang, hasil : [250, 330]
                                                                // match return array, test return boolean, /g semua match
        let penghubung = sisa ? '.' : '';                       // jika ada sisa, maka penghubungnya adalah .
        rupiah += penghubung + belakang.join('.');              // 75 += . + 250.330   HASIL : 75.250.330

        return rupiah;
    }
}

function activeTab() {
    $('#app .left .layanan-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}layanan.html`;
}

// form
const form = $('#app .right .content form');
const namaLayanan = $('#nama', form);
let harga = $('#harga', form);
const uploadGambar = $('#image', form);
const extensionsImg = ["jpg", "jpeg", "png"];

function validateNamaLayanan() {
    if (namaLayanan.val().length === 0)
        $('.nama-error', form).css('display', 'block');
    else
        $('.nama-error', form).css('display', 'none');
}

function validateHarga() {
    if (harga.val().length === 0)
        $('.harga-error', form).css('display', 'block');
    else {
        $('.harga-error', form).css('display', 'none');
        harga.val(generateRupiah(harga.val().split('.').join('')));
    }
}

function returnHarga() {
    if (harga.val().length === 0)
        return 0;

    if (isNaN(harga.val()))
        return 0;

    if (harga.val().length > 3)
        return parseInt(harga.val().split('.').join(''));

    return harga.val();
}

uploadGambar.focusout(() => {
    $('.img-error').css('display', 'none');
});

function validationImage() {
    if (uploadGambar.val().length > 0) {

        // cek ektension image (jpg, jpeg, png)
        let image = uploadGambar.val().split(".");
        let tempImage = image[image.length - 1].toLowerCase();

        for (let i = 0; i < extensionsImg.length; i++) {
            if (tempImage == extensionsImg[i]) {
                return 1; // ektension valid
            }
        }

        // ektension tidak valid
        $('.img-error', form).css('display', 'block');
    }

    // tidak upload file / ektension tidak valid
    return 0;
}

function validateForm() {
    if (namaLayanan.val().length !== 0 && returnHarga() >= 1000 && validationImage()) {
        let params = new FormData();
        params.append("nama", namaLayanan.val());
        params.append("harga", returnHarga())
        params.append("image", uploadGambar[0].files[0]);
        
        if (!id)
            reqAPI('create', params);
        else {
            params.append("id", id);
            reqAPI('update', params);
        }
    }

    if (namaLayanan.val().length === 0)
        $('.nama-error', form).css('display', 'block');

    if (returnHarga() < 1000)
        $('.harga-error', form).css('display', 'block');
    
    if (!validationImage())
        $('.img-error', form).css('display', 'block');

    return false;
}

function reqAPI(type, params) {
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Layanan/${type}`,
        type: 'post',
        dataType: 'json',
        processData: false,     // default kirim object, form mengandung file
        contentType: false,     // default x-www-form-urlencoded
        data: params,

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan layanan');
                $('.popup-message').css('display', 'flex');
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function getData(id) {
    $('#app .right .title').html(`<a href="layanan.html">Layanan</a> <span>></span> Ubah`);
    $('.loading').css('display', 'flex');

    $.ajax({
        url: `${API}Layanan`,
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setForm(response.data[0]);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setForm(data) {
    namaLayanan.val(data.nama);
    harga.val(generateRupiah(data.harga));
}


$(document).ready(() => {
    id = window.location.search.substring(1);

    if (id)
        getData(id);

    activeTab();
});