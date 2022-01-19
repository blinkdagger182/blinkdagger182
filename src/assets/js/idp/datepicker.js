
var startDate = {
    init: function () {
        $('#startDt').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", //autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
};
var endDate = {
    init: function () {
        $('#endDt').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", //autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
};
var mobileUntil = {
    init: function () {
        $('#mobileUntil').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", //autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
};
var nextReview = {
    init: function () {
        $('#nextReview').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", //autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
};

jQuery(document).ready(
    function () {
        startDate.init();
        endDate.init();
        mobileUntil.init();
        nextReview.init();
    }
);

$(document).on('click', '#startDt', function (e) {
    $("#startDt").focus();
});

$(document).on('click', '#endDt', function (e) {
    $("#endDt").focus();
});

$(document).on('click', '#mobileUntil', function (e) {
    $("#mobileUntil").focus();
});

$(document).on('click', '#nextReview', function (e) {
    $("#nextReview").focus();
});

$(document).on('click', '#modal-close-btn, #modal-close-btn2', function (e) {
    $('#startDt').datepicker('setDate', null);
    $('#endDt').datepicker('setDate', null);
    $('#mobileUntil').datepicker('setDate', null);
    $('#nextReview').datepicker('setDate', null);
});