

var advFilterDatePicker = {
    init: function () {
        
        $('#startDt').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy",
            autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });

        $('#endDt').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy",
            autoclose: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    }
};

$(document).ready(function() {

    advFilterDatePicker.init();
    var st; var en;

    $("#startDt").on('changeDate', function() {
        st = $(this).datepicker("getDate"); 
        var end = st;
        
        if(en) {
            if(st < en )
                $('#endDt').datepicker('setStartDate', end); 
            else 
                $('#endDt').val('').datepicker('setStartDate', end);  
        }
        else
            $('#endDt').val('').datepicker('setStartDate', end);  

    })

    $("#endDt").on('changeDate', function() {
        en = $(this).datepicker("getDate"); 
    })

    $("#resetBtn").on('click', function() {
        $('#startDt').datepicker('setDate', null);
        $('#endDt').datepicker('setDate', null);
    });
    
})