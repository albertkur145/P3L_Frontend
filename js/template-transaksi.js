
const headerTransaksi = `
    <div class="brand-left">Kouvee <i class="fas fa-paw" style="font-size: 2rem"></i></div>
    <div class="brand-right">PET<span>SHOP</span></div>
`;

const navLeftTransaksi = `
    <a href="transaksi-produk-create.html" class="tab tab-produk"><i class="fas fa-box-open mr-2"></i>Produk</a>
    <a href="javascript:void(0)" class="tab tab-layanan"><i class="fas fa-cut mr-2"></i>Layanan</a>
    <a href="member.html" class="tab tab-member"><i class="fas fa-users mr-2"></i>Member</a>
    <a href="hewan.html" class="tab tab-hewan"><i class="fas fa-dog mr-2"></i>Hewan</a>
    <a href="javascript:void(0)" class="tab tab-transaksi-produk"><i class="fas fa-shopping-basket mr-2"></i>Transaksi Produk</a>
    <a href="javascript:void(0)" class="tab tab-transaksi-layanan"><i class="fas fa-shower mr-2"></i>Transaksi Layanan</a>
    <p onclick="logout()" class="tab tab-transaksi-layanan"><i class="fas fa-power-off mr-2"></i>Keluar</p>
`;

const searchPageTransaksi = `
    <div class="search">
        <span><i class="fas fa-search"></i></span>
        <input type="text" autocomplete="off" placeholder="Bingung ya? Cari aja disini..." onkeyup="searchData()">
        <button class="cari" onclick="searchData()">Cari</button>
    </div>
`

$('#app .header').html(headerTransaksi);
$('#app .content .nav-left').html(navLeftTransaksi);
$('#app .content .data-content .head').html(searchPageTransaksi);