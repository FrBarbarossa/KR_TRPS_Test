// window.onload = changeTasksSort;
// window.setInterval(saveConfig, 15000);
// window.onload = time('time');


function setDone(reserved_source_id, task_id) {
    // ev.preventDefault();
    let output = {};
    output[reserved_source_id] = [];
    number_of_questions = document.getElementsByName(`answers_${reserved_source_id}`).length;
    for (let quest_number = 0; quest_number < number_of_questions; quest_number++) {
        let answer_out = [];
        let outs = document.querySelectorAll(`[name='${reserved_source_id}_${quest_number}']`);
        outs.forEach(outer => {
                console.log($(outer).val());
                if (outer.type == 'radio' || outer.type == 'checkbox') {
                    console.log(outer.type);
                    if (outer.checked) {
                        answer_out.push($(outer).val());
                    }
                    // console.log($(outer).val());
                } else {
                    answer_out.push($(outer).val());
                }
            }
        );
        // output[reserved_source_id].push($(`input:radio[name=${reserved_source_id}_${quest_number}]:checked`).val());
        output[reserved_source_id].push(answer_out.join('&'))
    }

    console.log(output);
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/task_implementation/save_form_answer/${task_id}`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(output),
        // on success
        success: function (response) {
            if (response.status == 'Ok') {
                console.log("Success message");
                // document.getElementById('done_mark').hidden = false;
                document.getElementById(`done_mark_${reserved_source_id}`).style = "visibility:visible;";

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

// let answers = $(`input:radio[name^=${id}]:checked`);
// for (i = 0; i < answers.length; i++) {
//     console.log(answers[i].value);
// }
}

function CompleteTask(task_id) {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `/polls/task_imlementation/complete_task/${task_id}`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        // on success
        success: function (response) {
            if (response.status == "Ok") {
                console.log("Success message");
                alert('Задание завершено. Награда скоро поступит на ваш счёт. Вы можете продолжить выполнять задания');
                window.location.replace("/polls/tasks");
            } else {
                console.log("Not success message");
                alert('Вы не выполнили всех заданий!');
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

function time(time) {
    date = new Date;
    // console.log(time);
    let timestamp = 0;
    let timeSplited = time.split(":");
    timestamp += Number(timeSplited[1]) * 60;
    timestamp += Number(timeSplited[2]);
    // console.log(timestamp);
    timestamp -= 1
    if (timestamp <= 0) {
        CompleteTask(Number(window.location.pathname.split('/')[3]));
        alert('Время истекло');
        window.location.replace("/polls/tasks");
        return true;
    }

    h = 0;
    s = timestamp % 60;
    m = (timestamp - s) / 60;
    result = h + ':' + m + ':' + s;
    // console.log(result);
    document.getElementById('timer').innerHTML = result;
    // "setTimeout" call function "time" every 1 second (1000 milliseconds)
    setTimeout('time("' + result + '");', '1000');
    return true;
}
