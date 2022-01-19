
jQuery(document).ready(function () {
    
    $(document).on('click', '#btnMyAction', function (e) {
        e.preventDefault();
        swal({
            title: "Are you sure to proceed?",
            //text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Yes"
        }
        ).then(function (e) {
            if (e.value) {
                $("#btnMyAction2").click();
            }
        }
        )
    });
});

