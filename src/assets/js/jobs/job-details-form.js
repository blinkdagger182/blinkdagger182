var qualForm=$("#m_qual_form"),
	aorForm =$("#m_aor_form"),
	expForm =$("#m_exp_form");

var FormRepeater={
	init:function(){
		qualForm.repeater({
			initEmpty:false,
			defaultValues:{
				"text-input":"foo"
			},
			show:function(){console.log('add');$(this).slideDown()},
			hide:function(e){
				if(confirm('Are you sure you want to delete this data?')) {
                    $(this).slideUp(e);
                }
			}
		});	
	}
};
/*https://www.sitepoint.com/file-upload-form-express-dropzone-js/*/
var bannerDropzone={init:function(){
	Dropzone.options.app_banner=
	{paramName:"file",maxFiles:1,maxFilesize:5,addRemoveLinks:false,acceptedFiles:'image/*',uploadMultiple:false,
	headers: {
		/*
		'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value
		*/
	},
	init: function() {
	  this.on('thumbnail', function(e) {
		if ( e.width > 300 || e.height > 300 ) {
		  e.rejectDimensions();
		}
		else {
		  e.acceptDimensions();
		}
	  });
	},
	accept:function(e,o){
		if (e.size==0){o('Empty files will not be uploaded.');}
		e.acceptDimensions = done;
		e.rejectDimensions = function() {o('The image can not be more than 300 by 300 pixels in size');};
	}}
}};
bannerDropzone.init();
var AdvertiseDateRangepicker={init:function(){!function(){
	$("#advertise_daterangepicker").daterangepicker({
		minDate:getNextDateTomo.init(),//+" 00:00 AM",
		dateLimit:{"month":1},
		buttonClasses:"m-btn btn",
		applyClass:"btn-primary",
		cancelClass:"btn-secondary",
		//timePicker:!0,timePickerIncrement:30,
		locale:{format:"MM/DD/YYYY"}
		/*,todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}*/
	},
		function(a,t,n){
			$("#advertise_daterangepicker .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"));			
		}
	);
}()
}};
var getNextDateTomo=function(){return{init:function(){var cd=new Date();var m=cd.getMonth()+1;var y=cd.getFullYear();return m+"/"+(cd.getDate()+1)+"/"+y;}}}();

/*
$scope.safeApply = function( fn ) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        if(fn) {
            fn();
        }
    } else {
        this.$apply(fn);
    }
};
*/

/* :start combile date range picker in 1 inpout field */
var todayDate = new Date().getDate();
var endD= new Date(new Date().setDate(todayDate - 15));
var currDate = new Date();
var BootstrapDaterangepicker={init:function(){!function(){$("#m_daterangepicker_1, #m_daterangepicker_1_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"}),
$("#m_daterangepicker_2").daterangepicker(
	{
		minDate: moment(), 
		startDate: moment(),
        endDate: moment().add(15, 'days'),
		dateLimit:{"month":1}, // 60 #// new career ads // Advertisement Profile // Edit Career@TM Profile // Advertise this job // Advertise Position // adv period* // /admin/job/advertisement/new-career/edit/**********
		buttonClasses:"m-btn btn",
		applyClass:"btn-primary",
		cancelClass:"btn-secondary",
		locale: {
            format: 'DD-MM-YYYY'
        }
	},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("DD-MM-YYYY")+" to "+ t.format("DD-MM-YYYY"))}),$("#m_daterangepicker_2_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_4").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",timePicker:!0,timePickerIncrement:30,locale:{format:"MM/DD/YYYY h:mm A"}},function(a,t,n){$("#m_daterangepicker_4 .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"))}),$("#m_daterangepicker_5").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",singleDatePicker:!0,showDropdowns:!0,locale:{format:"MM/DD/YYYY"}},function(a,t,n){$("#m_daterangepicker_5 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))});var a=moment().subtract(29,"days"),t=moment();$("#m_daterangepicker_6").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",startDate:a,endDate:t,ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},function(a,t,n){$("#m_daterangepicker_6 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))})}(),$("#m_daterangepicker_1_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_1_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_2_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))})}};

	var BootstrapDaterangepicker2={init:function(){!function(){$("#m_daterangepicker_1, #m_daterangepicker_1_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"}),
	$("#m_daterangepicker_2b").daterangepicker(
		{
			minDate: moment(), 
			dateLimit:{"days":14}, // 60
			buttonClasses:"m-btn btn",
			applyClass:"btn-primary",
			cancelClass:"btn-secondary"
		},function(a,t,n){$("#m_daterangepicker_2b .form-control").val(a.format("MM-DD-YYYY")+" to "+ t.format("MM-DD-YYYY"))}),$("#m_daterangepicker_2_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_2 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_modal").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3 .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_4").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",timePicker:!0,timePickerIncrement:30,locale:{format:"MM/DD/YYYY h:mm A"}},function(a,t,n){$("#m_daterangepicker_4 .form-control").val(a.format("MM/DD/YYYY h:mm A")+" / "+t.format("MM/DD/YYYY h:mm A"))}),$("#m_daterangepicker_5").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",singleDatePicker:!0,showDropdowns:!0,locale:{format:"MM/DD/YYYY"}},function(a,t,n){$("#m_daterangepicker_5 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))});var a=moment().subtract(29,"days"),t=moment();$("#m_daterangepicker_6").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary",startDate:a,endDate:t,ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},function(a,t,n){$("#m_daterangepicker_6 .form-control").val(a.format("MM/DD/YYYY")+" / "+t.format("MM/DD/YYYY"))})}(),$("#m_daterangepicker_1_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_1_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_2_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))}),$("#m_daterangepicker_3_validate").daterangepicker({buttonClasses:"m-btn btn",applyClass:"btn-primary",cancelClass:"btn-secondary"},function(a,t,n){$("#m_daterangepicker_3_validate .form-control").val(a.format("YYYY-MM-DD")+" / "+t.format("YYYY-MM-DD"))})}};

/* : end		 */

/* :start seperate date range picker */
var StartDate={init:function(){!function(){
	/*$("#m_datepicker_5").datepicker({
		minDate: moment(), 
		autoclose: true,
		dateLimit:{"days":14}, 
		locale:{format:"DD/MM/YYYY"},
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	})*/
	/*var todayDate = new Date();//.getDate();
	$("#startDate").datepicker({ 
		//minDate:todayDate,
		startDate:todayDate,
		autoclose: true, 
		//locale:{format:"dd-MM-yyyy"},
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	})
	$("#endDate").datepicker({ 
		//minDate:todayDate,	
		startDate:todayDate,
		autoclose: true, 
		//locale:{format:"dd-MM-yyyy"},
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	})
	*/

}()
}};
/* :end seperate date range picker */



jQuery(document).ready(function(){
	FormRepeater.init();
	AdvertiseDateRangepicker.init();	
	BootstrapDaterangepicker.init();  // COMBINE START AND END DATE IN 1 FIELD
	BootstrapDaterangepicker2.init(); // COMBINE START AND END DATE IN 1 FIELD
	StartDate.init();

	var todayDate = new Date();//.getDate();

	// :start NEW ADV
	$('#st').datepicker({  
		startDate:todayDate,
		autoclose: true,  
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	}).on("changeDate", function (e) { 
		$("#et").datepicker('option', 'startDate', $("#st").datepicker('getDate'));
		$("#startDate2").val($("#st").datepicker('getDate'));
		$("#startDate2").focus();

		var a = document.querySelector("#selectedJobAdsType");
		console.log("the value of struser is: " +a.value);

		var b;
		if ( a.value === "" ) {	b = 1;}
		else if ( a.value === "External (Career@TM)" ) { b = 2;}
		else if ( a.value === "Internal (ERA)" ) { b = 1;}


		//
		//let newDate = new Date();
		//newDate.setDate($("#st").datepicker('getDate') );
		//$("#et").val($("#st").datepicker('getDate')+'+13d');
		//$("#endDate2").val($("#st").datepicker('getDate')+'+13d');

		if ( b === 1 )	{
			var date2 = $('#st').datepicker('getDate', '+13d'); 
			date2.setDate(date2.getDate()+13); 
		} else if ( b === 2 )	{
			var date2 = $('#st').datepicker('getDate', '+30d'); 
			date2.setDate(date2.getDate()+30); 
		}
		$('#et').datepicker('setDate', date2);
		//$('#endDate2').datepicker('setDate', new Date(date2));
		$("#endDate2").val($("#et").datepicker('getDate'));
	});

	$('#et').datepicker({  
		startDate:todayDate,
		autoclose: true,  
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	}).on("changeDate", function (e) { 
		$("#et").datepicker('option', 'startDate', $("#et").datepicker('getDate'));
		$("#endDate2").val($("#et").datepicker('getDate'));
		$("#endDate2").focus();
	});
	// :end NEW ADV

	// :start RESUBMIT
	$('#stResubmit').datepicker({  
		startDate:todayDate,
		autoclose: true,  
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	}).on("changeDate", function (e) { 
		$("#etResubmit").datepicker('option', 'startDate', $("#stResubmit").datepicker('getDate'));
		$("#startDate2Resubmit").val($("#stResubmit").datepicker('getDate'));
		$("#startDate2Resubmit").focus();
		// Update end date to 14 days
		var date2 = $('#stResubmit').datepicker('getDate', '+13d'); 
		date2.setDate(date2.getDate()+13); 
		$('#etResubmit').datepicker('setDate', date2); 
		$("#endDate2Resubmit").val($("#etResubmit").datepicker('getDate'));
	});

	$('#etResubmit').datepicker({  
		startDate:todayDate,
		autoclose: true,  
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	}).on("changeDate", function (e) { 
		$("#etResubmit").datepicker('option', 'startDate', $("#etResubmit").datepicker('getDate'));
		$("#endDate2Resubmit").val($("#etResubmit").datepicker('getDate'));
		$("#endDate2Resubmit").focus();
	});
	// :end RESUBMIT

	/*
	var datepickerConfiguration = {
		format:"dd-mm-yyyy",
		//select: onDateSelect
		onSelect: function(dateText, inst) { alert("Working"); }
	  };
	  ///--- Component Binding ---///
	  $('#st, #et').datepicker(datepickerConfiguration)
	  .on("changeDate", function (e) {
		onDateSelect;//alert("Working");
	});

	var onDateSelect = function(selectedDate, input) {
		alert("masuk");
		alert(input.id);
		if (input.id == 'st') { //Start date selected - update End Date picker
		  $("#et").datepicker('option', 'startDate', selectedDate);
		} else { //End date selected - update Start Date picker
		  $("#st").datepicker('option', 'maxDate', selectedDate);
		}
	
		$('#startDate2').datepicker('setDate', selectedDate);
	  };
	*/

	/*
	$("#startDate").datepicker({ 
		//minDate:todayDate,
		startDate:todayDate,
		autoclose: true, 
		//locale:{format:"dd-MM-yyyy"},
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		},
		//onSelect: function(dateText, inst){
		//	alert($("#startDate").datepicker("getDate"));
		//	$("#endDate").datepicker("option","startDate",$("#startDate").datepicker("getDate"));
		// },
		onSelect: function(dateText, inst){
			alert($("#startDate").datepicker("getDate"));
			$("#endDate").datepicker("option","startDate",
			$("#startDate").datepicker("getDate"));
		 }
		 
	});

	$("#endDate").datepicker({ 
		//minDate:todayDate,
		startDate:$("#startDate").datepicker("getDate") ,
		autoclose: true, 
		//locale:{format:"dd-MM-yyyy"},
		format:"dd-mm-yyyy",
		todayHighlight:!0,
		templates:{
			leftArrow:'<i class="la la-angle-left"></i>',
			rightArrow:'<i class="la la-angle-right"></i>'
		}
	})*/
});

