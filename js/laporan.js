
// variable global
let dataName = null;
const form = $('#app .right .content .form');
const bulan = $('#bulan', form);
const tahunBulanan = $('#tahun-bulanan', form);
const tahunTahunan = $('#tahun-tahunan', form);

function activeTab() {
    $('#app .left .laporan-tab').addClass('active-tab');
}

function logout() {
    localStorage.removeItem('pegawai');
    window.location.href = `${BASE_URL}cpanel.html`;
}

function appendTahun() {
    for (let i = 2020; i >= 2000; i--) {
        $('#app .right .content select.tahun').append(`
            <option value="${i}">${i}</option>
        `);
    }
}

function showForm(form, e) {
    let laporan = $('.laporan span');
    for (let index = 0; index < laporan.length; index++)
        laporan.removeClass('is-active');

    $(e).addClass('is-active');

    $(`#app .right .content .form .bulanan`).css('display', 'none');
    $(`#app .right .content .form .tahunan`).css('display', 'none');
    $(`#app .right .content .form .${form}`).css('display', 'block');

    dataName = $(e).data('nama');
}

function printLaporanTahunan() {
    window.open(`${API}laporan/${dataName}?tahun=${tahunTahunan.val()}`, '_blank');
}

function printLaporanBulanan() {
    window.open(`${API}laporan/${dataName}?bulan=${bulan.val()}&tahun=${tahunBulanan.val()}`, '_blank');
}

$(document).ready(() => {

    let pegawai = JSON.parse(localStorage.getItem('pegawai'));

    if (pegawai) {
        if (pegawai.role_name !== 'Admin')
            window.history.back();
    } else {
        window.location.href = `${BASE_URL}cpanel.html`;
    }

    appendTahun();
    activeTab();
});