let form_data = [];

window.onload = getOnloadConfig;
let intreval = window.setInterval(saveConfig, 5000);


let form_classifier = {
    'chose':
        `<div class="row">
            <div class="col-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ui-radios" viewBox="0 0 16 16">
                    <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </div>
            <div class="col">
                <p>Один вариант</p>
            </div>
        </div>`,
    'chose_many':
        `<div class="row">
            <div class="col-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ui-checks" viewBox="0 0 16 16">
                    <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </div>
            <div class="col">
                <p>Несколько вариантов</p>
            </div>
        </div>`,
    'dropdown':
        `<div class="row">
            <div class="col-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="currentColor" class="bi bi-menu-button-wide-fill" viewBox="0 0 16 16">
                     <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h13A1.5 1.5 0 0 0 16 3.5v-2A1.5 1.5 0 0 0 14.5 0h-13zm1 2h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm9.927.427A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0l-.396-.396zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </div>
            <div class="col">
                <p>Выпадающий список</p>
            </div>
        </div>`,
    'short_text':
        `<div class="row">
            <div class="col-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-input-cursor-text" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M5 2a.5.5 0 0 1 .5-.5c.862 0 1.573.287 2.06.566.174.099.321.198.44.286.119-.088.266-.187.44-.286A4.165 4.165 0 0 1 10.5 1.5a.5.5 0 0 1 0 1c-.638 0-1.177.213-1.564.434a3.49 3.49 0 0 0-.436.294V7.5H9a.5.5 0 0 1 0 1h-.5v4.272c.1.08.248.187.436.294.387.221.926.434 1.564.434a.5.5 0 0 1 0 1 4.165 4.165 0 0 1-2.06-.566A4.561 4.561 0 0 1 8 13.65a4.561 4.561 0 0 1-.44.285 4.165 4.165 0 0 1-2.06.566.5.5 0 0 1 0-1c.638 0 1.177-.213 1.564-.434.188-.107.335-.214.436-.294V8.5H7a.5.5 0 0 1 0-1h.5V3.228a3.49 3.49 0 0 0-.436-.294A3.166 3.166 0 0 0 5.5 2.5.5.5 0 0 1 5 2z"/>
                    <path d="M10 5h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v1h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4v1zM6 5V4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4z"/>
                </svg>
            </div>
            <div class="col">
                <p>Короткий текст</p>
            </div>
        </div>`
}

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
                console.log(response.data);
                for (let i = 0; i < form_data.length; i++) {
                    document.getElementById('form_zone').insertAdjacentHTML('beforeend', getFormPiece(form_data[i]['type'], form_data[i]['question'], i));
                }
            } else {
                form_data = [];
            }

            if (response.status != "Ok") {
                alert('Редактирование формы невозможно. Некоторые данные уже были размечены по форме в данной конфигурации.')
            }
            if (response.repeat_times) {
                document.getElementById('repeats').value = response.repeat_times;
            }
            if (response.duration) {
                let timeSplited = response.duration.split(":");
                console.log(timeSplited);
                document.getElementById('minutes').value = timeSplited[0];
                document.getElementById('seconds').value = timeSplited[1];

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

function saveConfig() {
    // here is ajax
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `${window.location.href}save_config/`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(form_data), // get the form data
        // on success
        success: function (response) {
            if (response.some_param == true) {
                console.log("Success message")
            } else {
                console.log("Not success message");
                clearInterval(intreval);
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
}

function saveDurRepConfig() {
    // here is ajax
    let time = `00:${document.getElementById('minutes').value}:${document.getElementById('seconds').value}`;
    let repeat = document.getElementById('repeats').value
    console.log(time);
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: `${window.location.href}save_duration_rep_config/`,
        type: "POST",
        processData: false,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({"duration": time, 'repeats': repeat}), // get the form data
        // on success
        success: function (response) {
            if (response.some_param == true) {
                console.log("Success message");
                window.history.back();

            } else {
                console.log("Not success message");
                clearInterval(intreval);
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
}

// Получить часть формы (плитки)
function getFormPiece(type, question, position) {
    return `<div class="container list-group-item list-group-item-action list-group-item-secondary" name="form-piece"
                         style="min-height:75px;" onclick="editPiece(${position})">
                        <div class="row m-1">
                            <div class="col col-auto">
                                <h5 name="quest_header">${question}</h5>
                            </div>
                        </div>
                        <div class="row justify-content-between m-1">
                            <div class="col col-auto">
                                ${form_classifier[type]}
                            </div>
                            <div class="col col-auto">
                                <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); makeUp(${position})" id="up_btn" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-chevron-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"></path>
                                    </svg>
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); makeDown(${position})" id="down_btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                                    </svg>
                                </button>
                                
                                <button type="button" class="btn btn-danger" onclick="event.stopPropagation(); deletePiece(this, ${position})" id="del_btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                     </svg>
                                </button>
                            </div>
                        </div>
                    </div>`
}

function makeUp(pos) {
    if (pos > 0) {
        let parentDiv = document.getElementsByName("form-piece");
        let tmp = parentDiv[pos - 1].innerHTML;
        parentDiv[pos - 1].innerHTML = parentDiv[pos].innerHTML;
        parentDiv[pos].innerHTML = tmp;


        let tmp_data = form_data[pos - 1];
        form_data[pos - 1] = form_data[pos];
        form_data[pos] = tmp_data;
        console.log(form_data);

        // parentDiv[pos - 1].setAttribute("onclick", `editPiece(${pos-1})`);

        parentDiv[pos - 1].querySelector('#del_btn').setAttribute("onclick", `event.stopPropagation(); deletePiece(this, ${pos - 1})`);

        parentDiv[pos - 1].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos - 1})`);
        parentDiv[pos].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos})`);
        parentDiv[pos - 1].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos - 1})`);
        parentDiv[pos].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos})`);

    }
}

function makeDown(pos) {
    if (pos < form_data.length - 1) {
        let parentDiv = document.getElementsByName("form-piece");
        let tmp = parentDiv[pos].innerHTML;
        parentDiv[pos].innerHTML = parentDiv[pos + 1].innerHTML;
        parentDiv[pos + 1].innerHTML = tmp;

        let tmp_data = form_data[pos];
        form_data[pos] = form_data[pos + 1];
        form_data[pos + 1] = tmp_data;
        console.log(form_data);

        // parentDiv[pos + 1].setAttribute("onclick", `editPiece(${pos + 1})`);
        // parentDiv[pos].setAttribute("onclick", "editPiece(event)");

        parentDiv[pos + 1].querySelector('#del_btn').setAttribute("onclick", `event.stopPropagation(); deletePiece(this, ${pos + 1})`);

        parentDiv[pos].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos})`);
        parentDiv[pos + 1].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos + 1})`);
        parentDiv[pos].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos})`);
        parentDiv[pos + 1].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos + 1})`);
    }
}

function deletePiece(target, pos) {
    for (let i = pos + 1; i < form_data.length; i++) {
        makeUp(i);
    }
    document.getElementsByName("form-piece")[document.getElementsByName("form-piece").length - 1].remove();
    // target.parentElement.parentElement.parentElement.remove();
    form_data.splice(-1, 1);

}

// Добавить вариант ответа в вопрос
function addPieceQestion(target, pos) {
    if (document.getElementById('qestions_sandbox').lastElementChild == target.parentElement.parentElement) {
        target.value = 'Ответ_' + (document.getElementById('qestions_sandbox').children.length - 1);
        document.getElementById('qestions_sandbox').insertAdjacentHTML('beforeend', `<div class="row">
                                <div class="col align-self-center m-2">
                                    <input type="text" class="form-control" placeholder="Добавить вариант" aria-label="Ответ" onclick="addPieceQestion(this, ${pos})" name="answer">
                                </div>
                                <div class="col-auto align-self-center">
                                    <button class='btn' onclick="deletePieceQuestion(this, ${pos})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>`);

        // form_data[pos]['additional_elements'].push(target.value);
        console.log(form_data[pos]['additional_elements']);
    }
}

function deletePieceQuestion(target, pos) {
    // let q_list = Array.prototype.slice.call(target.parentElement.parentElement.parentElement.children); // Now it's an Array.
    // let index = q_list.indexOf(target.parentElement.parentElement); // The index of your element :)
    // form_data[pos]['additional_elements'].splice(index, 1);
    target.parentElement.parentElement.remove();
}

// Функция, которая отоборжает форму редактирования поля "едиственный выбор"
function editChoseOneOf(pos) {
    console.log(form_data[pos]['attributes']);
    let first_elem = form_data[pos]['additional_elements'][0];
    let feature_name = form_data[pos]['attributes']['feature_name'];
    let quest = form_data[pos]['question'];
    let type = form_data[pos].type;
    if (!feature_name) feature_name = '';
    if (!first_elem) first_elem = 'Ответ_0';
    document.getElementById('modal_content').innerHTML = `<div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Редактирование вопроса</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal_body">

                    <div class='container'>
<!--                    Этот кусок нужно переписать, если функция будет обрабатывать не только "один из". Добавить вариативность от переданного типа вопроса-->
                    ${form_classifier[type]}
                        <div class="row">
                            <h5>Вопрос</h5>
                        </div>
                        <div class="row m-2">
                            <textarea class="form-control" aria-label="With textarea" id="quest">${quest}</textarea>
                        </div>
                        <p></p>
                        <div class="row">
                            <h5>Варианты ответов</h5>
                        </div>
                        <div class="row" id="qestions_sandbox">

                            <div class="row">
                                <div class="col align-self-center m-2">
                                    <input type="text" class="form-control" placeholder="Добавить вариант" aria-label="Ответ"
                                           onclick="addPieceQestion(this, ${pos})" name="answer" value='${first_elem}'>
                                </div>
                                <div class="col-auto align-self-center">
                                    <button class="btn" disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             class="bi bi-trash-fill" viewBox="0 0 16 16" aria-hidden="true">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <h5>Параметры</h5>
                        </div>
                        <div class="row" id="additional_question_params">
                            <div class="row m-2">
                                <label for="feature_name" class="form-label">Идентефикатор в результирующем датасете</label>
                                <input type="text" class="form-control"
                                       placeholder="Идентефикатор в результирующем датасете (ex: feature_sample_name)"
                                       aria-label="Идентефикатор в результирующем датасете"
                                       id="feature_name" value="${feature_name}">
                            </div>
                            <div class="row m-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                           id="required" unchecked>
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Обязательный
                                        вопрос</label>
                                </div>
                            </div>
                            <div class="row m-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                           id="random" onchange="document.getElementById('ordered').disabled = !(document.getElementById('ordered').disabled);" unchecked>
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Случайный порядок
                                        предложенных вариантов ответов</label>
                                </div>
                            </div>
                            <div class="row m-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                           id="ordered" onchange="document.getElementById('random').disabled = !(document.getElementById('random').disabled);"  unchecked>
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Упорядочить предложенные варианты ответов</label>
                                </div>
                            </div>
                            
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить изменения</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="savePiece(${pos})">Сохранить</button>
                </div>`
    for (elem of form_data[pos]['additional_elements'].slice(1)) {
        document.getElementById('qestions_sandbox').insertAdjacentHTML('beforeend', `<div class="row">
                                <div class="col align-self-center m-2">
                                    <input type="text" class="form-control" placeholder="Добавить враиант" aria-label="Ответ" onclick="addPieceQestion(this, ${pos})" name="answer" value='${elem}'>
                                </div>
                                <div class="col-auto align-self-center">
                                    <button class='btn' onclick="deletePieceQuestion(this, ${pos})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>`);
    }
    document.getElementById('qestions_sandbox').insertAdjacentHTML('beforeend', `<div class="row">
                                <div class="col align-self-center m-2">
                                    <input type="text" class="form-control" placeholder="Добавить вариант" aria-label="Ответ" onclick="addPieceQestion(this, ${pos})" name="answer"'>
                                </div>
                                <div class="col-auto align-self-center">
                                    <button class='btn' onclick="deletePieceQuestion(this, ${pos})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor"
                                             class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>`);
    document.getElementById("required").checked = form_data[pos]['attributes']['required'];
    document.getElementById("random").checked = form_data[pos]['attributes']['random'];
    if (form_data[pos]['attributes']['random']) {
        document.getElementById('ordered').disabled = !(document.getElementById('ordered').disabled);
    }
    document.getElementById("ordered").checked = form_data[pos]['attributes']['ordered'];
    if (form_data[pos]['attributes']['ordered']) {
        document.getElementById('random').disabled = !(document.getElementById('random').disabled);
    }

}

function editShortText(pos) {
    console.log('short_text');
    let first_elem = form_data[pos]['additional_elements'][0];
    let feature_name = form_data[pos]['attributes']['feature_name'];
    let quest = form_data[pos]['question'];
    let type = form_data[pos].type;
    if (!feature_name) feature_name = '';
    document.getElementById('modal_content').innerHTML = `<div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Редактирование вопроса</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal_body">

                    <div class='container'>
                    ${form_classifier[type]}
                        <div class="row">
                            <h5>Вопрос</h5>
                        </div>
                        <div class="row m-2">
                            <textarea class="form-control" aria-label="With textarea" id="quest">${quest}</textarea>
                        </div>
                        <div class="row">
                            <h5>Параметры</h5>
                        </div>
                        <div class="row" id="additional_question_params">
                            <div class="row m-2">
                                <label for="feature_name" class="form-label">Идентефикатор в результирующем датасете</label>
                                <input type="text" class="form-control"
                                       placeholder="Идентефикатор в результирующем датасете (ex: feature_sample_name)"
                                       aria-label="Идентефикатор в результирующем датасете"
                                       id="feature_name" value="${feature_name}">
                            </div>
                            <div class="row m-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                           id="required" unchecked>
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Обязательный
                                        вопрос</label>
                                </div>
                            </div>
                            <div class="row m-2 px-0">
                                <div class="col-auto mx-0 px-0">
                                    <input class="form-control mx-0 px-0" type="number" id='min_length' placeholder="Минимальная длина ответа" aria-label="default input example" min="0">
                                </div>
                                <div class="col-auto">
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Минимальная длина ответа</label>
                                </div>
                            </div>
                            <div class="row m-2 px-0">
                                <div class="col-auto mx-0 px-0">
                                    <input class="form-control mx-0 px-0" type="number" id='max_length' placeholder="Максимальная длина ответа" aria-label="default input example" min="0">
                                </div>
                                <div class="col-auto">
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Максимальная длина ответа</label>
                                </div>
                            </div>
                            
                            
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить изменения</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="savePiece(${pos})">Сохранить</button>
                </div>`
    document.getElementById("required").checked = form_data[pos]['attributes']['required'];
    document.getElementById("min_length").value = form_data[pos]['attributes']['min_length'];
    document.getElementById("max_length").value = form_data[pos]['attributes']['max_length'];


    // document.getElementById("random").checked = form_data[pos]['attributes']['random'];
    // if (form_data[pos]['attributes']['random']) {
    //     document.getElementById('ordered').disabled = !(document.getElementById('ordered').disabled);
    // }

}

// Функция сохраняет параметры вопроса
function savePiece(pos) {
    form_data[pos]['additional_elements'] = []
    for (const elem of document.getElementsByName('answer')) {
        if (elem.value) {
            form_data[pos]['additional_elements'].push(elem.value);
        }
    }
    form_data[pos]['question'] = document.getElementById('quest').value;
    attributes_ids = ['feature_name', 'required', 'random', 'ordered', 'min_length', 'max_length']
    for (let i = 0; i < attributes_ids.length; i++) {
        elem = document.getElementById(attributes_ids[i])
        if (elem) {
            if (elem.value == 'on') {
                form_data[pos]['attributes'][attributes_ids[i]] = elem.checked
            } else {
                form_data[pos]['attributes'][attributes_ids[i]] = elem.value
            }
        }
        console.log(form_data[pos]['attributes'])
    }
    // form_data[pos]['attributes'] = {
    //     'feature_name': document.getElementById('result_name').value,
    //     "required": document.getElementById('required').checked,
    //     "random": document.getElementById('random').value,
    //     "ordered": document.getElementById('ordered').checked,
    //     // 'min_length': document.getElementById('min_length').value,
    //     // 'max_length': document.getElementById('max_length').value
    // }
    document.getElementsByName("quest_header")[pos].innerHTML = document.getElementById('quest').value;

}

// Функция открывает модальное окно, выбирает функцию наполнения в соответствии с типом
function editPiece(pos) {
    if (['chose', 'chose_many', 'dropdown'].includes(form_data[pos].type)) {
        editChoseOneOf(pos);
    }
    if (form_data[pos].type == 'short_text') {
        editShortText(pos);
    }


    const myModal = new bootstrap.Modal('#exampleModal');
    myModal.show();
    console.log(pos);
    // document.getElementById('exampleModal').modal('show');
    return;
}

function addFormLine(el, type) {
    form_data.push({
        'type': type,
        'question': "Ваш вопрос" + form_data.length,
        'attributes': {},
        'additional_elements': []
    });
    let last_elem_number = form_data.length - 1;
    document.getElementById('form_zone').insertAdjacentHTML('beforeend', getFormPiece(type, form_data[last_elem_number]['question'], last_elem_number));
    // document.getElementById('form_zone').insertAdjacentHTML('beforeend', getFormPiece(type, form_data[last_elem_number]['question'], last_elem_number));
    // alert(form_data[last_elem_number]['type']);

}