

let cart = [];
let timeout = null;

function hidePopup() {
    $('.popup-message').css('display', 'none');
}

function addToCart(e) {
    // get data
    let id = $(e).data('id');
    let nama = $(e).data('nama');

    // cari data tersebut sudah ada atau belum
    let data = cart.find(el => el.id === id);

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
            if (value.id === id) {
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
    const data = cart.findIndex(el => el.id === id);
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
            localStorage.setItem('cart-produk', JSON.stringify(cart));
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

$(document).ready(() => {
    isCartEmpty();
    getAll();
});