let form_data = [];
let form_classifier = {
    'chose': "<div class=\"list-group-item list-group-item-action list-group-item-secondary\" " + "style=\"min-height: 100px;\">" + "A simple secondary list group item</div>"
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

function getFormPiece(type, question, position) {
    return `<div class="container list-group-item list-group-item-action list-group-item-secondary" name="form-piece"
                         style="min-height:75px;" onclick="editPiece(event)">
                        <div class="row">
                            <div class="col col-auto">
                                <h5>${question}</h5>
                            </div>
                        </div>
                        <div class="row justify-content-between">
                            <div class="col col-auto">
                                ${type}
                            </div>
                            <div class="col col-auto">
                                <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); makeUp(${position})" id="up_btn">
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

        parentDiv[pos - 1].setAttribute("onclick", "editPiece(event)");

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

        parentDiv[pos + 1].setAttribute("onclick", "editPiece(event)");
        // parentDiv[pos].setAttribute("onclick", "editPiece(event)");


        parentDiv[pos].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos})`);
        parentDiv[pos + 1].querySelector('#down_btn').setAttribute("onclick", `event.stopPropagation(); makeDown(${pos + 1})`);
        parentDiv[pos].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos})`);
        parentDiv[pos + 1].querySelector('#up_btn').setAttribute("onclick", `event.stopPropagation(); makeUp(${pos + 1})`);
    }
}

function editPiece(ev) {
    console.log('Good!');
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