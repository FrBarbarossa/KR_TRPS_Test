$(document).ready(function () {
    // catch the form's submit event
    $('.add_form').on('click', function () {
        console.log($(this).attr('class'));
        var some = $('input[name^="input_"]').last().attr('id');  // Matches those that begin with 'tcol';
        console.log(some);
        if (!some) {
            some = 0;
        } else {
            some = Number(some);
            console.log('!!!');
            console.log(some);

        }
        $('#additional_form').append(
            '       <label>Введите имя:</label>\n' +
            `        <input type="text" name=${"input_" + Number(some + 1)} id=${some + 1}>\n` +
            `        <input type="text" name=${"input_" + Number(some + 2)} id=${some + 2}>\n`
        );


        return false;
    });
})