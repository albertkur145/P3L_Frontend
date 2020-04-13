
// variable global
let noTransaksi = null;
let dataTransaksi = null;
let codeBayar = null;

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-transaksi-layanan').addClass('tab-active');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');

    if (codeBayar == 200)
        window.location.href = `${BASE_URL}transaksi-layanan.html`;
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

    return 0;
}

function returnHarga(harga) {
    if (harga.val().length === 0)
        return 0;

    if (isNaN(harga.val()))
        return 0;

    if (harga.val().length > 3)
        return parseInt(harga.val().split('.').join(''));

    return harga.val();
}

// form
let form = $('#app .section-right .pembayaran .data .form');
let uangBayar = $('#bayar-user', form);
let kembalian = $('#kembalian', form);
var regNumber = /^\d+$/;


function validateBayarUser() {
    let uang = parseInt(uangBayar.val().split('.').join('')) - dataTransaksi.pembayaran.total;

    kembalian.val('-');
    if (regNumber.test(uangBayar.val().split('.').join(''))) {
        if (uang < 0) {
            $('.bayar-user-error', form).css('display', 'block');
            $('#app .section-right .pembayaran .data .form .input-bayar input').css('border-bottom', '0.125rem solid #FF4757');
        } else {
            $('.bayar-user-error', form).css('display', 'none');
            $('#app .section-right .pembayaran .data .form .input-bayar input').css('border-bottom', '0.125rem solid #2ED573');

            if (uang == 0)
                kembalian.val('Rp 0');
            else
                kembalian.val(`Rp ${generateRupiah(uang)}`);
        }
        uangBayar.val(generateRupiah(uangBayar.val().split('.').join('')));
    } else {
        $('.bayar-user-error', form).css('display', 'block');
        $('#app .section-right .pembayaran .data .form .input-bayar input').css('border-bottom', '0.125rem solid #FF4757');
    }
}

function setHead(value) {
    let date = value.tanggal.split(' ');
    let tanggal = date[0].split('-');

    $('#app .content .data-content .head .identity').html(`
        <p>No Transaksi : ${value.no_transaksi}</p>
        <div class="date">${tanggal[2]}-${tanggal[1]}-${tanggal[0]}, ${date[1]} WIB</div>
    `);
}

function setKeranjang(layanan) {
    let tbody = $('#app .content .data-content .datas .information .produk table tbody');

    tbody.html('');
    layanan.forEach(value => {
        tbody.append(`
            <tr>
                <td>${value.nama}</td>
                <td>Rp ${generateRupiah(value.harga)}</td>
            </tr>
        `);
    });

    $('#app .content .data-content .datas .information .edit').attr('onclick', `redirectToLayananCart('${noTransaksi}')`);
}

function setCustomer(customer) {
    let tbody = $('#app .content .data-content .datas .customer table tbody');
    let tanggal = customer.tanggal_lahir.split('-');

    customer.is_member == '1' ? customer.is_member = "Member" : customer.is_member = "Non Member";
    tbody.html(`
        <tr>
            <td class="bg-muted-kouvee">Nama</td>
            <td class="text-center">${customer.nama}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Alamat</td>
            <td class="text-center">${customer.alamat}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Tanggal lahir</td>
            <td class="text-center">${tanggal[2]}-${tanggal[1]}-${tanggal[0]}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Nomor HP</td>
            <td class="text-center">${customer.no_hp}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Status</td>
            <td class="text-center">${customer.is_member}</td>
        </tr>
    `);
    $('#app .content .data-content .datas .customer .edit').attr('onclick', `redirectToMember(${customer.id}, '${noTransaksi}')`);
}

function setHewan(hewan) {
    let tbody = $('#app .content .data-content .datas .hewan table tbody');
    let tanggal = hewan.tanggal_lahir.split('-');

    tbody.html(`
        <tr>
            <td class="bg-muted-kouvee">Nama</td>
            <td class="text-center">${hewan.nama}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Tanggal lahir</td>
            <td class="text-center">${tanggal[2]}-${tanggal[1]}-${tanggal[0]}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Jenis</td>
            <td class="text-center">${hewan.jenis_hewan}</td>
        </tr>

        <tr>
            <td class="bg-muted-kouvee">Ukuran</td>
            <td class="text-center">${hewan.ukuran_hewan}</td>
        </tr>
    `);
    $('#app .content .data-content .datas .hewan .edit').attr('onclick', `redirectToHewan(${hewan.id}, '${noTransaksi}')`);
}

function setPembayaran(pembayaran) {
    let tbody = $('#app .section-right .pembayaran .data table tbody');

    tbody.html(`
        <tr>
            <td class="bg-primary-kouvee">Subtotal</td>
            <td class="text-center">Rp ${generateRupiah(pembayaran.sub_total.toString())}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Diskon</td>
            <td class="text-center">Rp ${generateRupiah(pembayaran.diskon.toString())}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Total Pembayaran</td>
            <td class="text-center">Rp ${generateRupiah(pembayaran.total.toString())}</td>
        </tr>
    `);
}

function setData(data) {
    setHead(data);
    setKeranjang(data.layanan);
    setCustomer(data.customer);
    setHewan(data.hewan);
    setPembayaran(data.pembayaran);
}

function postPembayaran() {
    if (parseInt(kembalian.val().split(' ')[1].split('.').join('')) >= 0) {
        $('.loading').css('display', 'flex');
        let params = {
            'no_transaksi': noTransaksi,
            'pegawai_id': JSON.parse(localStorage.getItem('pegawai')).id
        }

        $.ajax({
            url: `${API}PembayaranLayanan`,
            type: 'post',
            dataType: 'json',

            data: params,

            success: function() {
                $('.loading').css('display', 'none');
            },
            
            error: function() {
                $('.loading').css('display', 'none');
                $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
                $('.popup-message').css('display', 'flex');
            }
        }).then((res) => {
            if (res.code === 200) {
                window.open(`${API}PembayaranLayanan/nota?no_transaksi=${noTransaksi}`, '_blank');
                codeBayar = 200;
                $('.popup-message .message p').text('Sukses melakukan pembayaran');
                $('.popup-message').css('display', 'flex');
            }
        });;
    }
}

function getData(noTransaksi) {
    $('.loading').css('display', 'flex');
    $.ajax({
        url: `${API}TransaksiLayanan`,
        type: 'get',
        dataType: 'json',

        data: {
            'no_transaksi': noTransaksi
        },

        success: function(response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                dataTransaksi = response.data[0];
                setData(response.data[0]);
            }
        },
        
        error: function() {
            $('.loading').css('display', 'none');
            $('.popup-message .message p').text('Koneksi error! Silahkan coba lagi');
            $('.popup-message').css('display', 'flex');
        }
    });
}

function redirectToMember(id, noTransaksi) {
    window.location.href = `${BASE_URL}member.html?id=${id}&no=${noTransaksi}`;
}

function redirectToHewan(id, noTransaksi) {
    window.location.href = `${BASE_URL}hewan.html?id=${id}&no=${noTransaksi}`;
}

function redirectToLayananCart(noTransaksi) {
    window.location.href = `${BASE_URL}transaksi-layanan-create.html?${noTransaksi}`;
}


$(document).ready(() => {
    let pegawai = JSON.parse(localStorage.getItem('pegawai'));
    noTransaksi = window.location.search.substring(1);

    if (pegawai) {
        if (!noTransaksi)
            window.location.href = `${BASE_URL}transaksi-layanan.html`;
        
        if (pegawai.role_name === 'CS') {
            $('#app .section-right .pembayaran .data').css('display', 'none');
            $('#app .section-right .pembayaran .access-cashier-only').css('display', 'block');
        }
        else {
            $('#app .section-right .pembayaran .data').css('display', 'block');
            $('#app .section-right .pembayaran .access-cashier-only').css('display', 'none');
        }

        getData(noTransaksi);
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    tabActive();
});