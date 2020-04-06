// variable global
let noTransaksi = null;

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-riwayat-transaksi').addClass('tab-active');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
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

function setHead(value) {
    let identity = $('#app .content .data-content .head .identity');

    identity.html(`
        <p>No Transaksi : ${value.no_transaksi}</p>
        <div class="date"><span>${value.status}</span></div>
    `);

    if (value.status == 'Selesai')
        $('.date', identity).css('color', '#05C46B');
    else
        $('.date', identity).css('color', '#596275');
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
}

function setPegawai(data) {
    let tbody = $('#app .section-right .pegawai .data table tbody');

    data.kasir == null ? data.kasir = '-' : data.kasir = data.kasir;

    tbody.html(`
        <tr>
            <td class="bg-primary-kouvee">Customer Service</td>
            <td class="text-center">${data.cs}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Kasir</td>
            <td class="text-center">${data.kasir}</td>
        </tr>
    `);
}

function setLastUpdated(data) {
    let tbody = $('#app .section-right .action .data table tbody');

    data.updated_at == null ? data.updated_at = '-' : data.updated_at = data.updated_at;
    data.deleted_at == null ? data.deleted_at = '-' : data.deleted_at = data.deleted_at;

    tbody.html(`
        <tr>
            <td class="bg-primary-kouvee">Dibuat pada</td>
            <td class="text-center">${data.created_at}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Diubah pada</td>
            <td class="text-center">${data.updated_at}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Dihapus pada</td>
            <td class="text-center">${data.deleted_at}</td>
        </tr>

        <tr>
            <td class="bg-primary-kouvee">Aksi terakhir oleh</td>
            <td class="text-center">${data.last_action_by}</td>
        </tr>
    `);
}

function setData(data) {
    setHead(data);
    setKeranjang(data.layanan);
    setCustomer(data.customer);
    setHewan(data.hewan);
    setPembayaran(data.pembayaran);
    setPegawai(data);
    setLastUpdated(data);
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

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200)
                setData(response.data[0]);
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
        if (!noTransaksi)
            window.location.href = `${BASE_URL}riwayat-transaksi-layanan.html`;
        else
            getData(noTransaksi);
    } else
        window.location.href = `${BASE_URL}cpanel.html`;

    $('#app .section-right .pembayaran .data').css('display', 'block');
    tabActive();
});