

var projTimelineDatePicker = {
    init: function () {
        $('#track_date_picker').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", autoclose: true, startDate: new Date(),
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        })
    }
};

$(document).on('click', '#startDt', function (e) {
    $("#startDt").focus();
    $('#startDt').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy",
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#startDt').focus();
});

$(document).on('click', '#endDt', function (e) {
    $("#endDt").focus();
    $('#endDt').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy",
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#endDt').focus();
});