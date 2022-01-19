$(document).on('click', '#startDtAdd', function (e) {
    $("#startDtAdd").focus();
    $('#startDtAdd').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy", autoclose: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#startDtAdd').focus();
});

$(document).on('click', '#endDtAdd', function (e) {
    $("#endDtAdd").focus();
    $('#endDtAdd').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy", autoclose: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#endDtAdd').focus();
});
