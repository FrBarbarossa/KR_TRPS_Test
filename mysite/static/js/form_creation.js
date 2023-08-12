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
        ev.target.insertAdjacentHTML('afterbegin',"<p>Hello!</p>");
    }
    else {alert(ev.target.id)}
}