
jQuery(document).ready(function () {
    var todayDate = new Date();
    var endD= new Date(new Date().setDate(new Date().getDate() + 13));
    var date2;
    
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
            date2 = $('#st').datepicker('getDate', '+13d');
            date2.setDate(date2.getDate() + 13);
            $('#et').datepicker('setStartDate', $("#st").val());
            $('#et').datepicker('setEndDate', date2);
            $('#et').datepicker('setDate', date2);
            $("#endDate2").val($("#et").datepicker('getDate'));
        });
    
        $('#et').datepicker({
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
    
   
        
    $(document).on('click', '#btnMyAction', function (e) {
        e.preventDefault();
        swal({
            title: "Do you wish to proceed?",
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

