
const searchPageTransaksi = `
    <div class="search">
        <span><i class="fas fa-search"></i></span>
        <input type="text" autocomplete="off" placeholder="Bingung ya? Cari aja disini..." onkeyup="searchData()">
        <button class="cari" onclick="searchData()">Cari</button>
    </div>
`;

$('#app .content .data-content .head').html(searchPageTransaksi);