
// variable global
let nomorPO = null;
let num = 2;
let products = [];

// form
const form = $('#app .right .content .form');
const supplier = $('#supplier', form);
const regexNum = /^\d+$/;

function validateForm() {
    // form
    const produk = $('.produk', form);
    const satuan = $('.satuan', form);
    const jumlah = $('.jumlah', form);

    // untuk cek semua form benar, seharusnya isinya sama dengan panjang nodelist
    let countSatuanTrue = 0;
    let countJumlahTrue = 0;

    // variable penampung data
    let products = [];

    for (let i = 0; i < satuan.length; i++) {
        if (satuan[i].value.length != 0) 
            countSatuanTrue++;
        else
            $(`.${satuan[i].getAttribute('id')}-error`).css('display', 'block');

        if(regexNum.test(jumlah[i].value))
            countJumlahTrue++;
        else
            $(`.${jumlah[i].getAttribute('id')}-error`).css('display', 'block');

        // copy data
        products.push({
            'produk_id': produk[i].value,
            'satuan': satuan[i].value,
            'jumlah': jumlah[i].value
        });
    }

    if (satuan.length === countSatuanTrue && jumlah.length === countJumlahTrue) {
        let params = {
            'supplier_id': supplier.val(),
            'produk': products
        };

        if (!nomorPO)
            reqAPI(params, 'create');
        else {
            params.nomor_po = nomorPO;
            reqAPI(params, 'update');
        }
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

function validateSatuan(e) {
    let value = $(e);

    if (value.val().length === 0)
        $(`.${value.attr('id')}-error`).css('display', 'block');
    else
        $(`.${value.attr('id')}-error`).css('display', 'none');
}

function validateJumlah(e) {
    let value = $(e);

    if (!regexNum.test(value.val()) || value.val() <= 0)
        $(`.${value.attr('id')}-error`).css('display', 'block');
    else
        $(`.${value.attr('id')}-error`).css('display', 'none');
}

function addProdukForm() {
    let form = $('#app .right .content .form');

    form.append(`
        <div class="produk-form produk-form-${num}">
            <span class="minus" onclick="removeProdukForm(${num})">x</span>
            <div class="form-group">
                <label for="produk-${num}">Produk</label>

                <select id="produk-${num}" class="form-control produk">

                    <!-- append from js req api -->

                </select>
            </div>

            <div class="form-group">
                <label for="satuan-${num}">Satuan</label>
                <input type="text" class="form-control satuan" id="satuan-${num}" onkeyup="validateSatuan(this)" autocomplete="off">
                <small class="form-text text-muted satuan-${num}-error">Satuan tidak valid.</small>
            </div>

            <div class="form-group">
                <label for="jumlah-${num}">Jumlah</label>
                <input type="text" class="form-control jumlah" id="jumlah-${num}" onkeyup="validateJumlah(this)" autocomplete="off">
                <small class="form-text text-muted jumlah-${num}-error">Jumlah tidak valid.</small>
            </div>
        </div>
    `);
    setSelectProduk(products, `#produk-${num}`);

    num++;
}

function removeProdukForm(num) {
    $(`#app .right .content .form .produk-form-${num}`).remove();
}

function reqAPI(params, type) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Pemesanan/${type}`,
        type: 'post',
        dataType: 'json',
        data: params,

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan pemesanan');
                $('.popup-message').css('display', 'flex');
            }
        },

        error: function(response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 409) {
                $('.popup-message .message p').text('Pemesanan ini sudah tidak bisa diubah');
                $('.popup-message').css('display', 'flex');
            }
            else {
                $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getAllSelectData() {
    getAllSupplier();
    getAllProduk();
}

function getAllSupplier() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Supplier`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setSelectSupplier(response.data);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setSelectSupplier(data) {
    data.forEach(value => {
        supplier.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}

function getAllProduk() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Produk`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                products = response.data;
                setSelectProduk(response.data, '#produk-1');
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi terputus! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    }).then(() => {
        if (nomorPO)
            getData(nomorPO);
    });
}

function setSelectProduk(data, formProduk) {
    const produk = $(formProduk, form);
    data.forEach(value => {
        produk.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}

function setData(value) {
    supplier.val(value.supplier.id);

    for (let index = 0; index < value.detail_pemesanan.length; index++) {
        if (index != 0)
            addProdukForm();
        setFormProduk(index + 1, value.detail_pemesanan[index]);
    }
}

function setFormProduk(num, value) {
    $(`#produk-${num}`).val(value.produk_id);
    $(`#satuan-${num}`).val(value.satuan);
    $(`#jumlah-${num}`).val(value.jumlah);
}

function getData(nomorPO) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Pemesanan/detail`,
        type: 'get',
        dataType: 'json',

        data: {
            nomor_po: nomorPO
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                setData(response.data[0]);
            }
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

    getAllSelectData();
    activeTab();
});