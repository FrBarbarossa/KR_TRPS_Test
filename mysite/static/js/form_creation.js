let form_data = [];
window.onload = getOnloadConfig;
window.setInterval(saveConfig, 15000);


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
                for (let i = 0; i < form_data.length; i++) {
                    document.getElementById('form_zone').insertAdjacentHTML('beforeend', getFormPiece(form_data[i]['type'],form_data[i]['question'], i));

                }


            } else {
                form_data = []
            }

        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log("Not success message 2")
            console.log(response.responseJSON.errors)
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
                console.log("Not success message")
            }

        },
        // on error
        error: function (response) {
            // alert the error if any error occured
            console.log("Not success message 2")
            console.log(response.responseJSON.errors)
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (ev.target.id == 'div1') {
        // ev.target.appendChild(
        //     '<p>Hello!</p>'
        //     // document.getElementById(data)
        // );
        // alert(ev.target);
        ev.target.insertAdjacentHTML('afterbegin', "<p>Hello!</p>");
        document.getElementById("test_btn").setAttribute("disabled", "");
        alert(document.getElementById("test_btn"));
    } else {
        alert(ev.target.id)
    }
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
                                ${form_classifier['chose']}
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
    if (!feature_name) feature_name = '';
    if (!first_elem) first_elem = 'Ответ_0';
    document.getElementById('modal_content').innerHTML = `<div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Редактирование вопроса</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal_body">

                    <div class='container'>
<!--                    Этот кусок нужно переписать, если функция будет обрабатывать не только "один из". Добавить вариативность от переданного типа вопроса-->
                    ${form_classifier['chose']}
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
                        <div class="row">
                            <div class="row m-2">
                                <label for="result_name" class="form-label">Идентефикатор в результирующем датасете</label>
                                <input type="text" class="form-control"
                                       placeholder="Идентефикатор в результирующем датасете (ex: feature_sample_name)"
                                       aria-label="Идентефикатор в результирующем датасете"
                                       id="result_name" value="${feature_name}">
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
                                           id="random" unchecked>
                                    <label class="form-check-label" for="flexSwitchCheckChecked">Случайный порядок
                                        предложенных вариантов ответов</label>
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
    form_data[pos]['attributes'] = {
        'feature_name': document.getElementById('result_name').value,
        "required": document.getElementById('required').checked,
        "random": document.getElementById('random').checked
    }
    document.getElementsByName("quest_header")[pos].innerHTML = document.getElementById('quest').value;

}

// Функция открывает модальное окно, выбирает функцию наполнения в соответствии с типом
function editPiece(pos) {
    if (form_data[pos].type == 'chose') {
        editChoseOneOf(pos);
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