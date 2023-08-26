// window.onload = changeTasksSort;
// window.setInterval(saveConfig, 15000);


function setDone(reserved_source_id, task_id) {
    // ev.preventDefault();
    // console.log(document.getElementsByName(id));
    let output = {};
    output[reserved_source_id] = [];
    number_of_questions = document.getElementsByName(`answers_${reserved_source_id}`).length;
    // console.log(leng);
    for (let quest_number = 0; quest_number < number_of_questions; quest_number++) {
        // console.log(quest_number);
        // console.log(`${reserved_source_id}_${quest_number}`);
        console.log(output);
        output[reserved_source_id].push($(`input:radio[name=${reserved_source_id}_${quest_number}]:checked`).val());
        console.log($(`input:radio[name=${reserved_source_id}_${quest_number}]:checked`).val());
    }
    console.log(output);
    // let answers = $(`input:radio[name^=${id}]:checked`);
    // for (i = 0; i < answers.length; i++) {
    //     console.log(answers[i].value);
    // }
}

function changeTasksSort() {
    let orgs_ids = [];
    let el = document.getElementsByName('org');
    // console.log(el);
    for (let i = 0; i < el.length; i++) {
        // console.log(el[i].checked);
        if (el[i].checked) {
            orgs_ids.push(el[i].value);
        }
    }
    // console.log(orgs_ids);
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/get_filtered_orders/`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({'orgs_ids': orgs_ids}), // get the form data

        // on success
        success: function (response) {
            let data = response.orders;
            document.getElementById('tasks-vault').innerHTML = '';
            if (data.length > 0) {
                for (let pos = 0; pos < data.length; pos++) {
                    // console.log(data[pos])
                    document.getElementById('tasks-vault').insertAdjacentHTML('beforeend', ` <div class="container list-group-item list-group-item-action list-group-item-secondary">
                            <div class="row p-2">
                                <div class="col">
                                    <div class="row">
                                        <h4>${data[pos]['order__name']}</h4>
                                    </div>
                                    <div class="row">
                                        <h6>${data[pos]['order__org__name']}</h6>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <p class="text-break">${data[pos]['order__description']}</p>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="col-auto">
                                            <button class="btn btn-primary" onclick="ShowInstruction(${data[pos]['order_id']})">Инструкция</button>
                                        </div>
                                        <div class="col-auto">
                                            <form action="/polls/create_task/${data[pos]['order_id']}">
                                                <button class="btn btn-success" href>Приступить</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="row justify-content-end">
                                        <div class="col-auto">
                                            <p class="fs-3 fw-bold m-0" style="color:green" ;>${data[pos]['order__task_cost']} у.е.</p>
                                            <p>за задание</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
`);
                }

            } else {

            }
        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log("Not success message 2");
            console.log(response.responseJSON);
            window.location.replace(document.referrer);
            alert('Error 403 forbidden');
        }
    });
}

function ShowInstruction(order_id) {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/get_order_instruction/${order_id}`,
        type: "GET",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        // on success
        success: function (response) {
            if (response.instruction) {
                console.log("Success message");
                document.getElementById('instr_content').innerHTML = response.instruction;
                const myModal = new bootstrap.Modal('#exampleModal');
                myModal.show();
            } else {
                console.log("Not success message")
            }

        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log("Not success message 2");
            console.log(response.responseJSON.errors);
            window.location.replace(document.referrer);
            alert('Error 403 forbidden');
        }
    });

    // document.getElementById('exampleModal').modal('show');
    return;
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