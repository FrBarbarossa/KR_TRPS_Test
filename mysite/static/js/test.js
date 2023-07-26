$(document).ready(function () {
    // catch the form's submit event
    $('.test_button').on('click', function () {
        console.log($(this).attr('id'));
        // create an AJAX call
        $.ajax({
            data: $(this).serialize(), // get the form data
            url: "/polls/test_ajax",
            // on success
            success: function (response) {
                if (response.some_param == true) {
                    alert("Success message")
                } else {
                    alert("Not success message")
                }

            },
            // on error
            error: function (response) {
                // alert the error if any error occured
                alert("Not success message 2")
                console.log(response.responseJSON.errors)
            }
        });

        return false;
    });
})