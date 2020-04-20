
// variable global
let num;
let layanan;

function activeTab() {
    $('#app .left .layanan-tab').addClass('active-tab');
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

function setTable(data) {
    var code = `<tr> <td> <div class="card-deck">`;
    let table = $('#app .right .content .data .table tbody');
    table.html('');
    for (let i = 0; i < data.length; i++) {
        data[i].updated_at === null ? data.updated_at = '-' : data[i].updated_at;
        
        if (num > 4 && num%4 === 1) {
            code = code + `<tr> <td> <div class="card-deck">`;
        }

        code = code + `
            <div class="card text-center border-dark cardView">
                <img class="card-img-top" src="${data[i].link_gambar}" alt="Card image cap">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${data[i].nama}</li>
                    <li class="list-group-item">Harga   : Rp ${generateRupiah(data[i].harga)}</li>
                </ul>
            </div>
        `;

        if (num > 3 && num%4 === 0) {
            code = code + `</div> </td> </tr> <br>`;
        }
        num = num +1;
    };

    code = code + `</div> </td> </tr> <br>`

    table.append(code);
}

function getAllData(page = 1) {
    $('.loading').css('display', 'flex');
    num = (page * 10) - 9;

    $.ajax({
        url: `${API}Layanan`,
        type: 'get',
        dataType: 'json',

        data: {
            page: page
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                setTable(response.data);
                layanan = response.data;
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 404) {
                $('#app .right .content .data .table tbody').html('');
                $('#app .right .content .emptyTable').css('display', 'block');
            }
        }
    });
}

function enter() {
    if (event.keyCode === 13) {
        getDataByName($('#keyword').val());
    }
}

function getDataByName(name) {
    $('.loading').css('display', 'flex');

    let paging = $('#app .right .content .data .paging');
    paging.html('');
    num = 1;

    $.ajax({
        url: `${API}Layanan`,
        type: 'get',
        dataType: 'json',
        data: {
            nama: name
        },

        success: function (response) {
            $('.loading').css('display', 'none');
            if (response.code === 200) {
                $('#app .right .content .emptyTable').css('display', 'none');
                setTable(response.data);
            }
        },

        error: function (response) {
            $('.loading').css('display', 'none');
            if (response.responseJSON.code === 404) {
                $('#app .right .content .data .table tbody').html('');
                $('#app .right .content .emptyTable').css('display', 'block');
            }
        }
    });
}

$(document).ready(() => {

    getAllData();
    activeTab();
});

$(".dropdown-menu a").click(function(){
    var selText = $(this).text();
    var sort = layanan.slice(0);

    if (selText === 'Nama (A-Z)') {
        sort.sort(function(a,b) {
            var x = a.nama.toLowerCase();
            var y = b.nama.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }
    else if (selText === 'Nama (Z-A)') {
        sort.sort(function(a,b) {
            var x = a.nama.toLowerCase();
            var y = b.nama.toLowerCase();
            return y < x ? -1 : y > x ? 1 : 0;
        });
    }
    else if (selText === 'Harga Terendah') {
        sort.sort(function(a,b) {
            var x = a.harga;
            var y = b.harga;
            return x - y;
        });
    }
    else if (selText === 'Harga Tertinggi') {
        sort.sort(function(a,b) {
            var x = a.harga;
            var y = b.harga;
            return y - x;
        });
    }
    setTable(sort);
});
