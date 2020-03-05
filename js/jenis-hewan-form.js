
// variable global
let id = null;


function activeTab() {
    $('#app .left .jenis-hewan-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}jenis-hewan.html`;
}


// form
const form = $('#app .right .content form');
const jenisHewan = $('#jenis', form);

function validateJenis() {
    if(jenisHewan.val().length === 0)
        $('.jenis-error', form).css('display', 'block');
    else
        $('.jenis-error', form).css('display', 'none');
}

function validateForm() {
    if (jenisHewan.val().length !== 0) {
        const params = {
            "nama": jenisHewan.val()
        }
        if (!id)
            reqAPI('post', params);
        else {
            params.id = id;
            reqAPI('put', params);
        }
    }

    if (jenisHewan.val().length === 0)
        $('.jenis-error', form).css('display', 'block');

    return false;
}

function reqAPI(type, params) {
    $.ajax({
        url: `${API}jenishewan/`,
        type: type,
        dataType: 'json',
        data: params,

        success: function (response) {
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan jenis hewan');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getData(id) {
    $.ajax({
        url: `${API}jenishewan/`,
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },

        success: function(response) {
            if (response.code === 200)
                setForm(response.data[0]);
        }
    })
}

function setForm(data) {
    jenisHewan.val(data.nama);
}






$(document).ready(() => {
    id = window.location.search.substring(1);

    if (id) 
        getData(id);
    
    activeTab();
});