
const headerTransaksi = `
    <div class="brand-left">Kouvee <i class="fas fa-paw" style="font-size: 2rem"></i></div>
    <div class="brand-right">PET<span>SHOP</span></div>
`;

const navLeftTransaksi = `
    <a href="transaksi-produk-create.html" class="tab tab-produk"><i class="fas fa-box-open mr-2"></i>Produk</a>
    <a href="transaksi-layanan-create.html" class="tab tab-layanan"><i class="fas fa-cut mr-2"></i>Layanan</a>
    <a href="member.html" class="tab tab-member"><i class="fas fa-users mr-2"></i>Member</a>
    <a href="hewan.html" class="tab tab-hewan"><i class="fas fa-dog mr-2"></i>Hewan</a>
    <a href="transaksi-produk.html" class="tab tab-transaksi-produk"><i class="fas fa-shopping-basket mr-2"></i>Transaksi Produk</a>
    <a href="transaksi-layanan.html" class="tab tab-transaksi-layanan"><i class="fas fa-shower mr-2"></i>Transaksi Layanan</a>
    <a href="riwayat-transaksi.html" class="tab tab-riwayat-transaksi"><i class="fas fa-history mr-2"></i>Riwayat Transaksi</a>
    <p onclick="logout()" class="tab tab-keluar"><i class="fas fa-power-off mr-2"></i>Keluar</p>
`;

$('#app .header').html(headerTransaksi);
$('#app .content .nav-left').html(navLeftTransaksi);