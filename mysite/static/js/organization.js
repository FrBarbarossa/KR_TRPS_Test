// window.onload = getOnloadConfig;
// window.setInterval(saveConfig, 15000);


function changeOrderBalance(order_id, delta) {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/change_order_balance/${order_id}`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({"delta": delta}), // get the form data

        // on success
        success: function (response) {
            if (response.orders) {
                let orders = JSON.parse(response.orders);
                // console.log(orders[0]);
                for (let i = 0; i < orders.length; i++) {
                    console.log(orders[i]);
                    document.getElementById(orders[i]['pk']).innerText = orders[i]['fields']['balance'];
                }
                document.getElementById('org_balance').innerText = response.organization;
                console.log(response.organization);
                console.log(response.orders);

            } else {
                console.log('nodata');
            }

        }
    })
}

function topUpBalance(org_id) {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/top_up_balance/${org_id}`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        // on success
        success: function (response) {
            if (response.organization) {
                document.getElementById('org_balance').innerText = response.organization;
                console.log(response.organization);
                console.log(response.orders);

            } else {
                console.log('nodata');
            }

        }
    })
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