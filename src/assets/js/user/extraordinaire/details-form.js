jQuery(document).ready(function () {
    // FormRepeater.init();
    // AdvertiseDateRangepicker.init();	
    // BootstrapDaterangepicker.init();  // COMBINE START AND END DATE IN 1 FIELD
    // BootstrapDaterangepicker2.init(); // COMBINE START AND END DATE IN 1 FIELD
    // StartDate.init();

    var todayDate = new Date();
var endD= new Date(new Date().setDate(new Date().getDate() + 13));

    $("#startDate2").val(todayDate);
     $("#endDate2").val(endD);

     var todayDate = new Date();//.getDate();
    // :start NEW ADV
    $('#st').datepicker({
        startDate: todayDate,
        autoclose: true,
        format: "dd-mm-yyyy",
        todayHighlight: !0,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }).on("changeDate", function (e) {
        $("#et").datepicker('option', 'startDate', $("#st").datepicker('getDate'));
        $("#startDate2").val($("#st").datepicker('getDate'));
        $("#startDate2").focus();
        var date2 = $('#st').datepicker('getDate', '+13d');
        date2.setDate(date2.getDate() + 13);
        $('#et').datepicker('setDate', date2);
        $("#endDate2").val($("#et").datepicker('getDate'));
    });

    $('#et').datepicker({
        startDate: todayDate,
        autoclose: true,
        format: "dd-mm-yyyy",
        todayHighlight: !0,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }).on("changeDate", function (e) {
        $("#et").datepicker('option', 'startDate', $("#et").datepicker('getDate'));
        $("#endDate2").val($("#et").datepicker('getDate'));
        $("#endDate2").focus();
    });
    // :end NEW ADV

    
    $(document).on('click', '#exorAdvertise', function (e) {
        e.preventDefault();
        var todayDate = new Date();
var endD= new Date(new Date().setDate(new Date().getDate() + 13));

    $("#startDate2").val(todayDate);
     $("#endDate2").val(endD);
    });

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

    $(document).on('click', '#chooseApp', function (e) {
        e.preventDefault();
        swal({
            title: "Are you sure to proceed with this selection?",
            //text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Yes"
        }
        ).then(function (e) {
            if (e.value) {
                $("#chooseApp2").click();
                var j = $("#form_sel_appl_msg_act");
                mApp.scrollTo(j, -200)
            }
        }
        )
    });

    
});

