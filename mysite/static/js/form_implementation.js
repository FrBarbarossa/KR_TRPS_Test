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