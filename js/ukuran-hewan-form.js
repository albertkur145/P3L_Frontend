// variable global
let id = null;


function activeTab() {
    $('#app .left .ukuran-hewan-tab').addClass('active-tab');
}

function hidePopup() {
    $('.popup-message').css('display', 'none');
    window.location.href = `${BASE_URL}ukuran-hewan.html`;
}


// form
const form = $('#app .right .content form');
const ukuranHewan = $('#ukuran', form);

function validateUkuran() {
    if (ukuranHewan.val().length === 0)
        $('.ukuran-error', form).css('display', 'block');
    else
        $('.ukuran-error', form).css('display', 'none');
}

function validateForm() {
    if (ukuranHewan.val().length !== 0) {
        const params = {
            "nama": ukuranHewan.val()
        }
        if (!id)
            reqAPI('post', params);
        else {
            params.id = id;
            reqAPI('put', params);
        }
    }

    if (ukuranHewan.val().length === 0)
        $('.ukuran-error', form).css('display', 'block');

    return false;
}

function reqAPI(type, params) {
    $.ajax({
        url: `${API}ukuranhewan/`,
        type: type,
        dataType: 'json',
        data: params,

        success: function (response) {
            if (response.code === 200) {
                $('.popup-message .message p').text('Berhasil menyimpan ukuran hewan');
                $('.popup-message').css('display', 'flex');
            }
        }
    });
}

function getData(id) {
    $.ajax({
        url: `${API}ukuranhewan/`,
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },

        success: function (response) {
            if (response.code === 200)
                setForm(response.data[0]);
        }
    })
}

function setForm(data) {
    ukuranHewan.val(data.nama);
}






$(document).ready(() => {
    id = window.location.search.substring(1);

    if (id)
        getData(id);

    activeTab();
});