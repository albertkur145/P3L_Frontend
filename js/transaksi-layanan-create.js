
// variable global
let cart = [];
let timeout = null;
let noTransaksi = null;
let hewanId = null;

// form customer
const form = $('#form-customer .form');
const nama = $('#nama', form);
const alamat = $('#alamat', form);
const tanggal = $('#tanggal-customer', form);
const bulan = $('#bulan-customer', form);
const tahun = $('#tahun-customer', form);
const nohp = $('#nohp', form);
const isMember = $('#is-member', form);
const regexHP = /^08[0-9]{8,10}$/;

// form hewan
const formHewan = $('#form-hewan .form');
const namaHewan = $('#nama-hewan', formHewan);
const tanggalHewan = $('#tanggal-hewan', formHewan);
const bulanHewan = $('#bulan-hewan', formHewan);
const tahunHewan = $('#tahun-hewan', formHewan);
const ukuranHewan = $('#ukuran-hewan', formHewan);
const jenisHewan = $('#jenis-hewan', formHewan);
const isHewan = $('#is-hewan', formHewan);
const pilihHewan = $('#hewan', formHewan);

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-layanan').addClass('tab-active');
}

function appendTTL() {
    for (let i = 1950; i <= 2020; i++) {
        $('.form select.tahun').append(`
            <option value="${i}">${i}</option>
        `);
    }

    for (let i = 1; i <= 31; i++) {
        if (i <= 9) {
            $('.form select.tanggal').append(`
                <option value="0${i}">${i}</option>
            `);
        } else {
            $('.form select.tanggal').append(`
                <option value="${i}">${i}</option>
            `);
        }
    }
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
}

function showFormCustomer() {
    $('#modal-choice').modal('hide');
    $('#form-customer').modal({
        backdrop: 'static',
        show: true
    });
}

function showSelectMember() {
    $('#modal-choice').modal('hide');
    $('#select-member').modal({
        backdrop: 'static',
        show: true
    });
}

$('#is-member').change(function () {
    if (this.checked) {
        nama.removeAttr('disabled');
        alamat.removeAttr('disabled');
        tanggal.removeAttr('disabled');
        bulan.removeAttr('disabled');
        tahun.removeAttr('disabled');

        nama.css('cursor', 'inherit');
        alamat.css('cursor', 'inherit');
        tanggal.css('cursor', 'inherit');
        bulan.css('cursor', 'inherit');
        tahun.css('cursor', 'inherit');
    } else {
        nama.attr('disabled', 'disabled');
        alamat.attr('disabled', 'disabled');
        tanggal.attr('disabled', 'disabled');
        bulan.attr('disabled', 'disabled');
        tahun.attr('disabled', 'disabled');

        nama.css('cursor', 'no-drop');
        alamat.css('cursor', 'no-drop');
        tanggal.css('cursor', 'no-drop');
        bulan.css('cursor', 'no-drop');
        tahun.css('cursor', 'no-drop');
    }

    $('.nama-error', form).css('display', 'none');
    $('.alamat-error', form).css('display', 'none');
    $('.ttl-error', form).css('display', 'none');
    $('.nohp-error', form).css('display', 'none');
});

function hideInputError() {
    $('.nama-error', form).css('display', 'none');
    $('.alamat-error', form).css('display', 'none');
    $('.ttl-error', form).css('display', 'none');
    $('.nohp-error', form).css('display', 'none');
}

function hideInputErrorHewan() {
    $('.nama-hewan-error', formHewan).css('display', 'none');
    $('.ttl-hewan-error', formHewan).css('display', 'none');
    $('.pilih-hewan-error', formHewan).css('display', 'none');
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

tanggalHewan.focusout(() => {
    $('.ttl-hewan-error', formHewan).css('display', 'none');
});

bulanHewan.focusout(() => {
    $('.ttl-hewan-error', formHewan).css('display', 'none');
});

tahunHewan.focusout(() => {
    $('.ttl-hewan-error', formHewan).css('display', 'none');
});

pilihHewan.focusout(() => {
    $('.pilih-hewan-error', formHewan).css('display', 'none');
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

function validateFormCustomer() {
    let validateTTL = validateTanggalLahir(tanggal.val(), bulan.val(), tahun.val());

    if (isMember.prop('checked')) {
        if (nama.val().length !== 0 && alamat.val().length !== 0 &&
            regexHP.test(nohp.val()) && validateTTL === 1) {
            const params = {
                "nama": nama.val(),
                "alamat": alamat.val(),
                "tanggal_lahir": tahun.val() + "-" + bulan.val() + "-" + tanggal.val(),
                "no_hp": nohp.val(),
                "is_member": 1,
                "pegawai_id": JSON.parse(localStorage.getItem('pegawai')).id,
            };
            postCustomer(params);
        }

        if (nama.val().length === 0)
            $('.nama-error', form).css('display', 'block');

        if (alamat.val().length === 0)
            $('.alamat-error', form).css('display', 'block');

        if (validateTTL === 0)
            $('.ttl-error', form).css('display', 'block');
    } else {
        if (regexHP.test(nohp.val())) {
            const params = {
                "nama": 'Guest',
                "alamat": '-',
                "tanggal_lahir": '0000-00-00',
                "no_hp": nohp.val(),
                "is_member": 'false',
                "pegawai_id": JSON.parse(localStorage.getItem('pegawai')).id,
            };
            postCustomer(params);
        }
    }

    if (!regexHP.test(nohp.val()))
        $('.nohp-error', form).css('display', 'block');
}

function postCustomer(params) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Customer/create`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function (response) {
            if (response.code === 200) {
                layanan = [];
                cart.forEach(value => {
                    layanan.push({
                        'layanan_id': value.id
                    });
                });

                dataTransaksi = {
                    'cs_id': JSON.parse(localStorage.getItem('pegawai')).id,
                    'customer_id': response.data[0].id,
                    'hewan_id': hewanId,
                    'layanan': layanan
                };

                postTransaksi(dataTransaksi);
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function addToCart(e) {
    // get data
    let id = $(e).data('id');
    let nama = $(e).data('nama');

    // cari data tersebut sudah ada atau belum
    let data = cart.find(el => el.id == id);

    // jika belum, push ke array / cart
    // jika sudah kasih alert
    if (!data) {
        cart.push({
            'id': id,
            'nama': nama
        });
    } else {
        $('.popup-message .message p').text('Layanan sudah ada di keranjang');
        $('.popup-message').css('display', 'flex');
    }

    setCart(cart);
    isCartEmpty();
    setAmountBuy();
}

function setCart(cart) {
    const cartData = $('#app .content .section-right .cart-data');
    cartData.html('');

    cart.forEach(value => {
        cartData.append(`
            <div class="data">
                <label for="${value.id}" class="judul">${value.nama}</label>
                <span class="hapus" onclick="remove(${value.id})"><i class="fas fa-trash"></i></span>
            </div>
        `);
    });
}

function remove(id) {
    const data = cart.findIndex(el => el.id == id);
    cart.splice(data, 1);

    setCart(cart);
    isCartEmpty();
    setAmountBuy();
}

function generateRupiah(angka) {
    if (angka != 0) {
        let harga = angka.toString();

        let sisa = harga.length % 3;
        let rupiah = harga.substring(0, sisa);
        let belakang = harga.substring(sisa).match(/\d{3}/g);
        let penghubung = sisa ? '.' : '';
        rupiah += penghubung + belakang.join('.');

        return rupiah;
    }
}

function setAmountBuy() {
    let jumlah = 0;
    cart.forEach(value => {
        jumlah += 1;
    });

    $('#app .content .section-right .confirm').text(`Beli (${jumlah})`);
}

function setLayout(data) {
    $('#app .content .data-content .datas').html('');
    data.forEach(value => {
        appendData(value);
    });
}

function appendData(value) {
    $('#app .content .data-content .datas').append(`
        <div class="data" data-id="${value.id}" data-nama="${value.nama}" data-harga="${value.harga}" onclick="addToCart(this)">
            <img src="${value.link_gambar}" class="img-data">

            <div class="info" style="padding: 0.5rem;">
                <p class="judul">${value.nama}</p>
                <p class="harga">Rp ${generateRupiah(value.harga)}</p>
            </div>
        </div>
    `);
}

function validateFormMember() {
    layanan = [];
    cart.forEach(value => {
        layanan.push({
            'layanan_id': value.id
        });
    });

    params = {
        'cs_id': JSON.parse(localStorage.getItem('pegawai')).id,
        'customer_id': $('select#member').val(),
        'hewan_id': hewanId,
        'layanan': layanan
    };

    postTransaksi(params);
}

function getAll() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Layanan`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setLayout(response.data);
        },

        error: function () {
            $('.loading').css('display', 'none');
        }
    });
}

function searchData() {
    if (JSON.parse(localStorage.getItem('pegawai')).role_name != 'Kasir' || noTransaksi != '') {
        const search = $('#app .content .data-content .head .search');
        const keyword = $('input', search).val();

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            getByName(keyword);
        }, 700);
    }
}

function getByName(nama) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Layanan`,
        type: 'get',
        dataType: 'json',

        data: {
            nama: nama
        },

        success: function (response) {
            isDataEmpty('flex', 'none');
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setLayout(response.data);
        },

        error: function () {
            isDataEmpty('none', 'block');
            $('.loading').css('display', 'none');
        }
    });
}

function getAllMember() {
    $.ajax({
        url: `${API}Customer/member`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            if (response.code === 200)
                setSelectMember(response.data);
        },

        error: function () {
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setSelectMember(data) {
    let selectMember = $('#member');
    selectMember.html('');

    data.forEach(value => {
        selectMember.append(`<option value="${value.id}">${value.nama}</option>`);
    });
}

function isCartEmpty() {
    if (cart.length === 0) {
        $('#app .content .section-right .cart-empty').css('display', 'block');
        $('#app .content .section-right .confirm').addClass('disable-button');
    } else {
        $('#app .content .section-right .cart-empty').css('display', 'none');
        $('#app .content .section-right .confirm').removeClass('disable-button');
    }
}

function isDataEmpty(disDatas, disEmpty) {
    $('#app .content .data-content .datas').css('display', disDatas)
    $('#app .content .data-content .data-empty').css('display', disEmpty);
}

function resetFormHewan() {
    namaHewan.val('');
    tanggalHewan.val('01');
    bulanHewan.val('01');
    tahunHewan.val('1950');
}

function disableCursor(checked) {
    if (checked) {
        pilihHewan.attr('disabled', 'disabled');
        pilihHewan.css('cursor', 'no-drop');
        pilihHewan.val('');
        namaHewan.removeAttr('disabled', 'disabled');
        namaHewan.css('cursor', 'inherit');
        tanggalHewan.removeAttr('disabled', 'disabled');
        tanggalHewan.css('cursor', 'inherit');
        bulanHewan.removeAttr('disabled', 'disabled');
        bulanHewan.css('cursor', 'inherit');
        tahunHewan.removeAttr('disabled', 'disabled');
        tahunHewan.css('cursor', 'inherit');
        ukuranHewan.removeAttr('disabled', 'disabled');
        ukuranHewan.css('cursor', 'inherit');
        jenisHewan.removeAttr('disabled', 'disabled');
        jenisHewan.css('cursor', 'inherit');
    } else {
        pilihHewan.removeAttr('disabled');
        pilihHewan.css('cursor', 'inherit');
        namaHewan.attr('disabled', 'disabled');
        namaHewan.css('cursor', 'no-drop');
        tanggalHewan.attr('disabled', 'disabled');
        tanggalHewan.css('cursor', 'no-drop');
        bulanHewan.attr('disabled', 'disabled');
        bulanHewan.css('cursor', 'no-drop');
        tahunHewan.attr('disabled', 'disabled');
        tahunHewan.css('cursor', 'no-drop');
        ukuranHewan.attr('disabled', 'disabled');
        ukuranHewan.css('cursor', 'no-drop');
        jenisHewan.attr('disabled', 'disabled');
        jenisHewan.css('cursor', 'no-drop');
    }

    resetFormHewan();
}

$('#is-hewan').change(function() {
    hideInputErrorHewan();
    if(this.checked)
        disableCursor(1);
    else
        disableCursor(0);
});

$('#hewan').change(function() {
    if (pilihHewan.val().length !== 0) 
        getHewanByID(pilihHewan.val());
    else
        resetFormHewan();
});

function getHewanByID(id) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Hewan`,
        type: 'get',
        dataType: 'json',

        data: {
            'id': id
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) 
                setFormHewan(response.data[0]);
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function setFormHewan(value) {
    let ttl = value.tanggal_lahir.split('-');
    namaHewan.val(value.nama);
    tanggalHewan.val(ttl[2]);
    bulanHewan.val(ttl[1]);
    tahunHewan.val(ttl[0]);
    ukuranHewan.val(value.ukuran_id);
    jenisHewan.val(value.jenis_id);
}

function buyNow() {
    if (cart.length > 0) {
        if (!noTransaksi) {
            $('#form-hewan').modal({
                backdrop: 'static',
                show: true
            });
            getAllUkuran();
            getAllJenis();
            getAllHewan();
        } else {
            updateTransaksi();
        }
    }
}

function validateFormHewan() {
    let validateTTL = validateTanggalLahir(tanggalHewan.val(), bulanHewan.val(), tahunHewan.val());

    if (isHewan.prop('checked')) {
        if (namaHewan.val().length !== 0 && validateTTL === 1) {
            const params = {
                "nama": namaHewan.val(),
                "tanggal_lahir": tahunHewan.val() + "-" + bulanHewan.val() + "-" + tanggalHewan.val(),
                "ukuran_id": ukuranHewan.val(),
                "jenis_id": jenisHewan.val(),
                "pegawai_id": JSON.parse(localStorage.getItem('pegawai')).id,
            };
            $('#form-hewan').modal('hide');
            postHewan(params);
        }

        if (namaHewan.val().length === 0)
            $('.nama-hewan-error', formHewan).css('display', 'block');

        if (validateTTL === 0)
            $('.ttl-hewan-error', formHewan).css('display', 'block');
    } else {
        if (pilihHewan.val().length !== 0) {
            $('#form-hewan').modal('hide');
            $('#modal-choice').modal({
                backdrop: 'static',
                show: true
            });
            getAllMember();
            hewanId = pilihHewan.val();
        }

        if (pilihHewan.val().length === 0) {
            $('.pilih-hewan-error', formHewan).css('display', 'block');
        }
    }
}

function postHewan(params) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Hewan/create`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('#modal-choice').modal({
                    backdrop: 'static',
                    show: true
                });
                getAllMember();
                hewanId = response.data[0].id;
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function getAllUkuran() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}UkuranHewan`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setSelectedUkuran(response.data);
        }
    });
}

function setSelectedUkuran(data) {
    let select = $('select#ukuran-hewan');
    select.html(``);

    data.forEach(value => {
        select.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}

function getAllJenis() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}JenisHewan`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setSelectedJenis(response.data);
        }
    });
}

function setSelectedJenis(data) {
    let select = $('select#jenis-hewan');
    select.html(``);

    data.forEach(value => {
        select.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}

function getAllHewan() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Hewan`,
        type: 'get',
        dataType: 'json',

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setSelectedHewan(response.data);
        }
    });
}

function setSelectedHewan(data) {
    let select = $('select#hewan');
    select.html(``);

    select.append(`
        <option value="">-- PILIH HEWAN --</option>
    `);

    data.forEach(value => {
        select.append(`
            <option value="${value.id}">${value.nama}</option>
        `);
    });
}

function getByNoTransaksi(noTransaksi) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiLayanan`,
        type: 'get',
        dataType: 'json',

        data: {
            'no_transaksi': noTransaksi
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                setDataCart(response.data[0].layanan);
            }
        }
    });
}

function setDataCart(layanan) {
    layanan.forEach(value => {
        cart.push({
            'id': value.id,
            'nama': value.nama
        });
    });
    setCart(cart);
    isCartEmpty();
    setAmountBuy();
}

function postTransaksi(params) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiLayanan/create`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                window.location.href = `${BASE_URL}transaksi-layanan.html`;
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function updateTransaksi() {
    $('.loading').css('display', 'flex');

    let layanan = [];
    cart.forEach(value => {
        layanan.push({
            'layanan_id': value.id
        });
    });

    let params = {
        'no_transaksi': noTransaksi,
        'pegawai_id': JSON.parse(localStorage.getItem('pegawai')).id,
        'layanan': layanan
    };

    $.ajax({
        url: `${API}TransaksiLayanan/update`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                window.location.href = `${BASE_URL}transaksi-layanan-detail.html?${noTransaksi}`;
            }
        },

        error: function () {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

$(document).ready(() => {
    let pegawai = JSON.parse(localStorage.getItem('pegawai'));
    noTransaksi = window.location.search.substring(1);

    if (pegawai) {
        if (noTransaksi) {
            getAll();
            getByNoTransaksi(noTransaksi);
        } else {
            if (pegawai.role_name === 'CS' || pegawai.role_name === 'Admin')
                getAll();
            else
                $('#app .content .data-content .access-denied').css('display', 'block');
        }
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    appendTTL();
    tabActive();
    isCartEmpty();
});