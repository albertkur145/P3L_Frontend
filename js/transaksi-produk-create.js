
// variable global
let cart = [];
let timeout = null;
let noTransaksi = null;

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-produk').addClass('tab-active');
}

function appendTTL() {
    for (let i = 1950; i <= 2020; i++) {
        $('.form select#tahun').append(`
            <option value="${i}">${i}</option>
        `);
    }

    for (let i = 1; i <= 31; i++) {
        if (i <= 9) {
            $('.form select#tanggal').append(`
                <option value="0${i}">${i}</option>
            `);
        } else {
            $('.form select#tanggal').append(`
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
    $('#form-customer').modal({backdrop: 'static', show: true});
}

function showSelectMember() {
    $('#modal-choice').modal('hide');
    $('#select-member').modal({backdrop: 'static', show: true});
}

// form customer
const form = $('#form-customer .form');
const nama = $('#nama', form);
const alamat = $('#alamat', form);
const tanggal = $('#tanggal', form);
const bulan = $('#bulan', form);
const tahun = $('#tahun', form);
const nohp = $('#nohp', form);
const isMember = $('#is-member', form);
const regexHP = /^08[0-9]{8,10}$/;

$('#is-member').change(function() {
    if(this.checked) {
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

function validateFormCustomer() {
    let validateTTL = validateTanggalLahir(tanggal.val(), bulan.val(), tahun.val());

    if(isMember.prop('checked')) {
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
    } 
    else {
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

        success: function(response) {
            if (response.code === 200) {
                produk = [];
                cart.forEach(value => {
                    produk.push({
                        'produk_id': value.id,
                        'jumlah': value.jumlah
                    });
                });

                dataTransaksi = {
                    'cs_id': JSON.parse(localStorage.getItem('pegawai')).id,
                    'customer_id': response.data[0].id,
                    'produk': produk
                };

                postTransaksi(dataTransaksi);
            }
        },

        error: function() {
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
    // jika sudah, tambahkan jumlah beli sebelumnya
    if (!data) {
        cart.push({
            'id': id,
            'nama': nama,
            'jumlah': 1
        });
    } else {
        cart.forEach(value => {
            if (value.id == id) {
                value.jumlah = parseInt($(`#app .content .section-right .cart-data #${id}`).val()) + 1;
            }
        });
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
                <input type="number" id="${value.id}" value=${value.jumlah} data-id="${value.id}" onkeyup="setAmountBuy()">
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
    // update cart terlebih dahulu sesuai input
    cart.forEach(value => {
        value.jumlah = parseInt($(`#app .content .section-right .cart-data #${value.id}`).val());
    });

    let jumlah = 0;
    cart.forEach(value => {
        jumlah += value.jumlah;
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
                <p class="stock">Stok <span>(${value.stock})</span></p>
            </div>
        </div>
    `);
}

function validateFormMember() {
    produk = [];
    cart.forEach(value => {
        produk.push({
            'produk_id': value.id,
            'jumlah': value.jumlah
        });
    });

    params = {
        'cs_id': JSON.parse(localStorage.getItem('pegawai')).id,
        'customer_id': $('select#member').val(),
        'produk': produk
    };

    postTransaksi(params);
}

function getAll() {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Produk`,
        type: 'get',
        dataType: 'json',

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) 
                setLayout(response.data);
        },

        error: function() {
            $('.loading').css('display', 'none');
        }
    });
}

function searchData() {
    const search = $('#app .content .data-content .head .search');
    const keyword = $('input', search).val();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        getByName(keyword);
    }, 700);
}

function getByName(nama) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}Produk`,
        type: 'get',
        dataType: 'json',

        data: {
            nama: nama
        },

        success: function(response) {
            isDataEmpty('flex', 'none');
            $('.loading').css('display', 'none');
            if (response.code === 200) 
                setLayout(response.data);
        },

        error: function() {
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

        success: function(response) {
            if (response.code === 200)
                setSelectMember(response.data);
        },

        error: function() {
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

function buyNow() {
    if (cart.length > 0) {
        if (amountInvalid()) {
            $('.popup-message .message p').text('Jumlah beli harus lebih dari 0');
            $('.popup-message').css('display', 'flex');
        } else {
            if (!noTransaksi) {
                $('#modal-choice').modal({backdrop: 'static', show: true});
                getAllMember();
            } else {
                updateTransaksi();
            }
        }
    }
}

function amountInvalid() {
    for (let i = 0; i < cart.length; i++) {
        let jumlah = parseInt(cart[i].jumlah);
        if (jumlah <= 0 || isNaN(jumlah))
            return true;
    }

    return false;
}

function getByNoTransaksi(noTransaksi) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiProduk`,
        type: 'get',
        dataType: 'json',

        data: {
            'no_transaksi': noTransaksi
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                setDataCart(response.data[0].produk);
            }
        }
    });
}

function setDataCart(produk) {
    produk.forEach(value => {
        cart.push({
            'id': value.id,
            'nama': value.nama,
            'jumlah': value.jumlah_beli
        });
    });
    setCart(cart);
    isCartEmpty();
    setAmountBuy();
}

function postTransaksi(params) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiProduk/create`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                window.location.href = `${BASE_URL}transaksi-produk.html`;
            }
        },

        error: function() {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function updateTransaksi() {
    $('.loading').css('display', 'flex');

    let produk = [];
    cart.forEach(value => {
        produk.push({
            'produk_id': value.id,
            'jumlah': value.jumlah
        });
    });

    let params = {
        'no_transaksi': noTransaksi,
        'pegawai_id': JSON.parse(localStorage.getItem('pegawai')).id,
        'produk': produk
    };

    $.ajax({
        url: `${API}TransaksiProduk/update`,
        type: 'post',
        dataType: 'json',

        data: params,

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                window.location.href = `${BASE_URL}transaksi-produk-detail.html?${noTransaksi}`;
            }
        },

        error: function() {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function updateJumlahProduk(params) {
    $.ajax({
        url: `${API}TransaksiProduk/updateAmount`,
        type: 'post',
        dataType: 'json',

        data: params,

        succcess: function(response) {
            console.log(response);
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