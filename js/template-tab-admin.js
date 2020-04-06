const tabLeft = `
    <!-- header -->
    <div class="header">
        <a href="javascript:void(0)">Kouvee<img src="../icon/logo.png" width="15%" class="ml-2 mb-2"></a>
    </div>
    <!-- akhir header -->

    <!-- content tab -->
    <div class="content">
        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="jenis-hewan.html" class="tab jenis-hewan-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-dog"></i></div>
                        <div class="col-10 txt">Jenis hewan</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="ukuran-hewan.html" class="tab ukuran-hewan-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-balance-scale-right"></i></div>
                        <div class="col-10">Ukuran hewan</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="produk.html" class="tab produk-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-box-open"></i></div>
                        <div class="col-10">Produk</div>
                    </div>
                </a>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="layanan.html" class="tab layanan-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-cut" style="font-size: 1.1875rem"></i></div>
                        <div class="col-10">Layanan</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="pegawai.html" class="tab pegawai-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-user-cog"></i></div>
                        <div class="col-10">Pegawai</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="supplier.html" class="tab supplier-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-people-carry"></i></div>
                        <div class="col-10">Supplier</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="javascript:void(0)" class="tab pemesanan-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-truck-loading"></i></div>
                        <div class="col-10">Pemesanan</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="transaksi-produk-create.html" class="tab pemesanan-tab" target="_blank">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-shopping-basket"></i></div>
                        <div class="col-10">Transaksi</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="row">
            <div class="col-12" style="padding: 0;">
                <a href="log-aktivitas.html" class="tab log-aktivitas-tab">
                    <div class="row">
                        <div class="col-1"><i class="fas fa-history"></i></div>
                        <div class="col-10">Log Aktivitas</div>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <!-- akhir content tab -->
`;


$('#app .left').html(tabLeft);