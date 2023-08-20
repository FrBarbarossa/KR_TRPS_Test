window.onload = getOnloadConfig;
// window.setInterval(saveConfig, 15000);


function getOnloadConfig() {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `${window.location.href}get_configuration/`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        // on success
        success: function (response) {
            if (response.data) {
                form_data = response.data;
                for (let i = 0; i < form_data.length; i++) {
                    document.getElementById('form_zone').insertAdjacentHTML('beforeend', getFormPiece(form_data[i]['type'],form_data[i]['question'], i));

                }


            } else {
                form_data = []
            }

        }

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}