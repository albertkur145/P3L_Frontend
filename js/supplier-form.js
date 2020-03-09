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
    $('#app .left .supplier-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}supplier.html`;
}

// form
const form = $('#app .right .content form');
const nama = $('#nama', form);
const alamat = $('#alamat', form);
const kota = $('#kota', form);
const nohp = $('#nohp', form);
const regexHP = /^08[0-9]{8,10}$/;

function validateNamaSupplier() {
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

function validateKota() {
    if (kota.val().length === 0)
        $('.kota-error', form).css('display', 'block');
    else
        $('.kota-error', form).css('display', 'none');
}

function validateNoHP() {
    if (!regexHP.test(nohp.val()))
        $('.nohp-error', form).css('display', 'block');
    else
        $('.nohp-error', form).css('display', 'none');
}

function validateForm() {
    if (nama.val().length !== 0 && alamat.val().length !== 0 && kota.val().length !== 0 && regexHP.test(nohp.val())) {
        const params = {
            "nama": nama.val(),
            "alamat": alamat.val(),
            "kota": kota.val(),
            "no_hp": nohp.val()
        };

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

    if (kota.val().length === 0)
        $('.kota-error', form).css('display', 'block');
    
    if (!regexHP.test(nohp.val()))
        $('.nohp-error', form).css('display', 'block');

    return false;
}

function reqAPI(type, params) {
    $.ajax({
        url: `${API}Supplier/${type}`,
        type: 'post',
        dataType: 'json',
        data: params,

        success: function (response) {
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan supplier');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getData(id) {
    $.ajax({
        url: `${API}Supplier`,
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
    nama.val(data.nama);
    alamat.val(data.alamat);
    kota.val(data.kota);
    nohp.val(data.no_hp);
}


$(document).ready(() => {
    id = window.location.search.substring(1);

    if (id)
        getData(id);

    activeTab();
});