
function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function tabActive() {
    $('.tab-riwayat-transaksi').addClass('tab-active');
}

function redirectRiwayatTransaksiProduk() {
    window.location.href = `${BASE_URL}riwayat-transaksi-produk.html`;
}

function redirectRiwayatTransaksiLayanan() {
    window.location.href = `${BASE_URL}riwayat-transaksi-layanan.html`;
}

$(document).ready(() => {
    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai)
        $('#historyModal').modal({show: true});
    else
        window.location.href = `${BASE_URL}cpanel.html`;

    tabActive();
});