var Select2 = {
    init: function () {
        $("#m_select2_1, #m_select2_1_validate").select2({ placeholder: "Select a state" }),
            $("#m_select2_2, #m_select2_2_validate").select2({ placeholder: "Select a state" }),
            $("#m_select2_3, #m_select2_3_validate").select2({ placeholder: "Select a state" }),
            $("#m_select2_4").select2({ placeholder: "Select a state", allowClear: !0 }),
            // $("#projApprover").select2({ placeholder: "Select a value", data: [{ id: 0, text: "Enhancement" }, { id: 1, text: "Bug" }, { id: 2, text: "Duplicate" }, { id: 3, text: "Invalid" }, { id: 4, text: "Wontfix" }] }), $("#m_select2_6").select2({ placeholder: "Search for git repositories", allowClear: !0, ajax: { url: "https://api.github.com/search/repositories", dataType: "json", delay: 250, data: function (e) { return { q: e.term, page: e.page } }, processResults: function (e, t) { return t.page = t.page || 1, { results: e.items, pagination: { more: 30 * t.page < e.total_count } } }, cache: !0 }, escapeMarkup: function (e) { return e }, minimumInputLength: 1, templateResult: function (e) { if (e.loading) return e.text; var t = "<div class='select2-result-repository clearfix'><div class='select2-result-repository__meta'><div class='select2-result-repository__title'>" + e.full_name + "</div>"; return e.description && (t += "<div class='select2-result-repository__description'>" + e.description + "</div>"), t += "<div class='select2-result-repository__statistics'><div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + e.forks_count + " Forks</div><div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + e.stargazers_count + " Stars</div><div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + e.watchers_count + " Watchers</div></div></div></div>" }, templateSelection: function (e) { return e.full_name || e.text } }), $("#m_select2_12_1, #m_select2_12_2, #m_select2_12_3, #m_select2_12_4").select2({ placeholder: "Select an option" }), $("#m_select2_7").select2({ placeholder: "Select an option" }), $("#m_select2_8").select2({ placeholder: "Select an option" }),

            $("#projLead").select2({ placeholder: "Select your Project Leader", maximumSelectionLength: 1 }),
            $("#projApprover").select2({ placeholder: "Select Approver", maximumSelectionLength: 1 }),

            $("#m_select2_10").select2({ placeholder: "Select an option", minimumResultsForSearch: 1 / 0 }), $("#m_select2_11").select2({ placeholder: "Add a tag", tags: !0 }), $(".m-select2-general").select2({ placeholder: "Select an option" }), $("#m_select2_modal").on("shown.bs.modal", function () { $("#m_select2_1_modal").select2({ placeholder: "Select a state" }), $("#m_select2_2_modal").select2({ placeholder: "Select a state" }), $("#m_select2_3_modal").select2({ placeholder: "Select a state" }), $("#m_select2_4_modal").select2({ placeholder: "Select a state", allowClear: !0 }) })
    }
};

jQuery.each(jQuery('textarea[data-autoresize]'), function() {
    var offset = this.offsetHeight - this.clientHeight;
 
    var resizeTextarea = function(el) {
        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
    };
    jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
});

var BootstrapDatepicker = {
    init: function () {
        $("#m_datepicker_1, #m_datepicker_1_validate").datepicker({ todayHighlight: !0, orientation: "bottom left", templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_1_modal").datepicker({ todayHighlight: !0, orientation: "bottom left", templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_2, #m_datepicker_2_validate").datepicker({ todayHighlight: !0, orientation: "bottom left", templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_2_modal").datepicker({ todayHighlight: !0, orientation: "bottom left", templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_3, #m_datepicker_3_validate").datepicker({ todayBtn: "linked", clearBtn: !0, todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }),
            // $(".m_datepicker_3_modal").datepicker({todayBtn:"linked",clearBtn:!0,todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),
            $("#m_datepicker_4_1").datepicker({ orientation: "top left", todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_4_2").datepicker({ orientation: "top right", todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_4_3").datepicker({ orientation: "bottom left", todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_4_4").datepicker({ orientation: "bottom right", todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_5").datepicker({ todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } }), $("#m_datepicker_6").datepicker({ todayHighlight: !0, templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' } })
    }
};

var todayDate = new Date();
var projTimelineDatePicker = {
    init: function () {
        $('#exor_new_date_picker').datepicker({
            todayHighlight: true, format: "dd-mm-yyyy", autoclose: true, startDate: new Date(),
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        })
    }
};
var timelineDt = $(".m_datepicker_3_modal").datepicker({
    todayBtn: "linked", clearBtn: !0, todayHighlight: !0, format: "dd-mm-yyyy", //startDate: todayDate,
    templates: { leftArrow: '<i class="la la-angle-left"></i>', rightArrow: '<i class="la la-angle-right"></i>' }
});


var FormControls = {
    init: function () {
        $("#form_create_proj").validate({
            rules: {
                //projName: { required: !0, minlength: 3 }, 
                //projObj: { required: !0, minlength: 3 }, 
                //   projSumm: { required: !0, minlength: 3 }, 
                //projRmk:  { required: !0, minlength: 3 }, 
                // projName: { required: !0},
            },
            invalidHandler: function (e, r) {
                var i = $("#form_create_proj_msg");
                i.removeClass("m--hide").show(), mApp.scrollTo(i, -200);
                $("#errMs, #errVac").removeClass("m--hide").show();

                if (($("#startDt").val().length < 1) || ($("#endDt").val().length < 1)) {
                    $("#msgTimeline").addClass("errMsg");
                } else {
                    $("#msgTimeline").removeClass("errMsg");
                }

                if (($("#ctcName").val().length < 1)) {
                    $("#errCtcName").removeClass("m--hide").show();
                } else {
                    $("#errCtcName").addClass("m--hide").show();
                }

                if (($("#prjLead").val().length < 1)) {
                    $("#errLeadName").removeClass("m--hide").show();
                } else {
                    $("#errLeadName").addClass("m--hide").show();
                }

                /*if (!$('[id^=ms_]').val().length>0){
                    $("#errMs").removeClass("m--hide").show(); 
                } else $("#errMs").addClass("m--hide").show(); 
                var value = ($('[id^=targetDt_]').map(function() {
                    console.log($(this).attr('id').match(/\d+$/));
                    console.log($(this).attr('id').lenth());
                  }).get());
                  
                  console.log(value);

                console.log($('#ms_0').val().length<0);*/
            },
            submitHandler: function (e, event) {
                event.preventDefault();
                $("#errMs2").addClass("m--hide").show();
                $("#errMs, #errVac").removeClass("m--hide").show();
                var ret = true;

                if (($("#startDt").val().length < 1) || ($("#endDt").val().length < 1)) {
                    $("#msgTimeline").addClass("errMsg");
                    console.log('timeline')
                    ret = false;
                }
                var x = new Date($("#startDt").val());
                var y = new Date($("#endDt").val());
                var z = new Date();
                if (y < x) {
                    console.log('timeline')
                    $("#errTlDt1").removeClass("m--hide").show(); ret = false;
                } else { $("#errTlDt1").addClass("m--hide").show(); }
                if (y < z) {
                    console.log('timeline')
                    $("#errTlDt2").removeClass("m--hide").show(); ret = false;
                } else { $("#errTlDt2").addClass("m--hide").show(); }

                if (($("#ctcName").val().length < 1)) {
                    console.log('contact name')
                    $("#errCtcName").removeClass("m--hide").show();
                    ret = false;
                }
                if (($("#prjLead").val().length < 1)) {
                    console.log('leader')
                    $("#errLeadName").removeClass("m--hide").show();
                    ret = false;
                }
                if (($("#projName").val().length < 3)) {
                    console.log('projName')
                    $("#errProjName").removeClass("m--hide").show(); ret = false;
                } else { $("#errProjName").addClass("m--hide").show(); }

                if (($("#projObj").val().length < 3)) {
                    console.log('projObj')
                    $("#errProjObj").removeClass("m--hide").show(); ret = false;
                } else { $("#errProjObj").addClass("m--hide").show(); }

                if (($("#projSumm").val().length < 3)) {
                    console.log('projSumm')
                    $("#errProjSumm").removeClass("m--hide").show(); ret = false;
                } else { $("#errProjSumm").addClass("m--hide").show(); }

                if (($("#projLob").val().length < 1)) {
                    console.log('projLob')
                    $("#errProjLob").removeClass("m--hide").show(); ret = false;
                } else { $("#errProjLob").addClass("m--hide").show(); }

                if (($("#startDt").val().length < 1) || ($("#endDt").val().length < 1)) {
                    console.log('msgTimeline')
                    $("#msgTimeline").addClass("errMsg"); ret = false;
                } else {
                    $("#msgTimeline").removeClass("errMsg");
                }
                if (($("#ctcName").val().length < 1)) {
                    $("#errCtcName").removeClass("m--hide").show(); ret = false;
                } else {
                    $("#errCtcName").addClass("m--hide").show();
                }

                if (($("#prjLead").val().length < 1)) {
                    $("#errLeadName").removeClass("m--hide").show(); ret = false;
                } else {
                    $("#errLeadName").addClass("m--hide").show();
                }
                
                // alert(ret);
                console.log('ret', ret);
                if (ret == false) {
                    // alert('abc');
                    console.log('abc')
                    var i = $("#form_create_proj_msg");
                    i.removeClass("m--hide").show(), mApp.scrollTo(i, -200);
                    return false;
                } else {
                    // alert('def');
                    console.log('def')
                    $("#msgTimeline").removeClass("errMsg");
                    $("#form_create_proj_msg").addClass("m--hide").hide();
                    //console.log($(document.activeElement).val());
                    /*var val=$(document.activeElement).val();
                    if (val==1) $("#btn_save_draft_hidden").click();
                    if (val==2) $("#btn_submit_hidden").click();
                    $("#startDt").val();$("#endDt").val();
                    $("#errMs, #errVac").addClass("m--hide").show(); 
                    var j = $("#form_create_proj_msg_act");
                    mApp.scrollTo(j, -200)*/
                    swal({
                        title: "Do you wish to proceed?",
                        type: "warning",
                        showCancelButton: !0,
                        confirmButtonText: "Yes"
                    }
                    ).then(function (e) {
                        if (e.value) {
                            var val = $(document.activeElement).val();
                            if (val == 1) $("#btn_save_draft_hidden").click();
                            if (val == 2) $("#btn_submit_hidden").click();
                            $("#startDt").val(); $("#endDt").val();
                            $("#errMs, #errVac").addClass("m--hide").show();
                            var j = $("#form_create_proj_msg_act");
                            mApp.scrollTo(j, -200)
                        }
                    }
                    )
                }
                //}
            }
        })
    }
};

jQuery(document).ready(

    function () {
        $(".fancybox").fancybox({
            openEffect: "none",
            closeEffect: "none"
        });
        $(".zoom").hover(function () {
            $(this).addClass('transition');
        }, function () {

            $(this).removeClass('transition');
        });

        FormControls.init();
        /* $(document).on('click', ' #btn_save_draft', function (e) {
             e.preventDefault(); 
             $("#form_create_proj").validate({
                 rules: {
                     projName: { required: !0 }
                 },
                 invalidHandler: function (e, r) {
                     var i = $("#form_create_proj_msg");
                     i.removeClass("m--hide").show(), mApp.scrollTo(i, -200)
                 },
                 submitHandler: function (e) { }
             });
         }); */

        //BootstrapDatepicker.init();



        projTimelineDatePicker.init();
        timelineDt.init();
        Select2.init();
        /*$(document).on('change', '#projApprover', function (e) {
            var Accessids = "", selArr = [];
            $('select#projApprover option:selected').each(function (i, obj) {
                selArr = ($(obj).val()).split(": ");
                Accessids = Accessids + selArr[1].slice(1, -1) + ",";
            });
            Accessids = Accessids.substring(0, Accessids.length - 1);
            $('#projApproverSelected').val(Accessids);
        });
        $(document).on('change', '#projLead', function (e) {
            var Accessids = "", selArr = [];
            $('select#projLead option:selected').each(function (i, obj) {
                selArr = ($(obj).val()).split(": ");
                Accessids = Accessids + selArr[1].slice(1, -1) + ",";
            });
            Accessids = Accessids.substring(0, Accessids.length - 1);
            $('#projLeadSelected').val(Accessids);
        });*/

        $("#AddMoreMs2").click(function (e) {
            e.preventDefault();
            // alert('abc');
            $(".m_datepicker_3_modal2").datepicker({
                todayBtn: "linked", clearBtn: !0, todayHighlight: !0,
                format: "dd-mm-yyyy",
                // startDate: todayDate,
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>'
                }
            });
        });

        $('[id^="targetDt_"]').click(function (e) {
            // e.preventDefault();
            // alert('test');
        });

        
        /*$(document).on('click', '#AddMoreMs2', function (e) {
            alert('click');console.log('click');
            e.preventDefault();
            $(".m_datepicker_3_modal").datepicker({
                todayBtn: "linked", clearBtn: !0, todayHighlight: !0,
                format: "dd-mm-yyyy", startDate: todayDate,
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>'
                }
            });
        });*/
        // if ($('[id^=ms_]').val().length<0){  targetDt_


    });

///
$(document).on('click', '#btn_save_draft, #btn_submit', function (e1) {
    // console.log('e1.target.id',e1.target.id);
    e1.preventDefault();
    $("#errMs2").addClass("m--hide").show();
    $("#errMs, #errVac").removeClass("m--hide").show();
    var ret = true;

    if (($("#startDt").val().length < 1) || ($("#endDt").val().length < 1)) {
        $("#msgTimeline").addClass("errMsg");
        ret = false;
    }
    // var x = new Date($("#startDt").val());
    var startDt = $("#startDt").val();
    // var y = new Date($("#endDt").val());
    var endDt = $("#endDt").val();
    var z = new Date();

    var today = ((''+z.getDate()).length<2 ? '0' : '') + z.getDate() + '-' 
                + ((''+(z.getMonth()+1)).length<2 ? '0' : '') + (z.getMonth()+1) + '-'
                + z.getFullYear() ;

    startDt = startDt.split('-'); 
    endDt = endDt.split('-');
    today = today.split('-'); 

    var new_startDt = new Date(startDt[2],startDt[1],startDt[0]);
    var new_endDt = new Date(endDt[2],endDt[1],endDt[0]);
    var new_today = new Date(today[2],today[1],today[0]);

    if(new_endDt < new_startDt){
        console.log("end Date should be after the start date"); ret = false;
    }

    if(new_today > new_startDt){
        console.log("expired"); ret = false;
    }  
    
    // if (y < x) {
    //     $("#errTlDt1").removeClass("m--hide").show(); ret = false; console.log("ret",ret);
    // } else { $("#errTlDt1").addClass("m--hide").show(); }
    // if (y < z) {
    //     $("#errTlDt2").removeClass("m--hide").show(); ret = false; console.log("ret",ret);
    // } else { $("#errTlDt2").addClass("m--hide").show(); }

    if (($("#prjLead").val().length < 1)) {
        $("#errLeadName").addClass("errMsg").show();ret = false;
    } else { $("#errLeadName").removeClass("errMsg"); }

    if (($("#ctcName").val().length < 1)) {
        $("#errCtcName").addClass("errMsg").show();ret = false;
    } else { $("#errCtcName").removeClass("errMsg"); }

    if ( $("#proLoc").val().length < 1 ) {
        $("#errProjLoc").removeClass("m--hide");
    }

    if (($("#projName").val().length < 3)) {
        $("#errProjName").removeClass("m--hide").show(); 
        $("#errProjName").addClass("errMsg").show(); ret = false;
    } else { 
        $("#errProjName").addClass("m--hide").show(); 
        $("#errProjName").removeClass("errMsg").show();
    }

    if (($("#projObj").val().length < 3)) {
        $("#errProjObj").removeClass("m--hide").show(); ret = false;
    } else { $("#errProjObj").addClass("m--hide").show(); }

    if (($("#projSumm").val().length < 3)) {
        $("#errProjSumm").removeClass("m--hide").show(); ret = false;
    } else { $("#errProjSumm").addClass("m--hide").show(); }

    if (($("#projLob").val().length < 1)) {
        $("#errProjLob").removeClass("m--hide").show(); ret = false;
    } else { $("#errProjLob").addClass("m--hide").show(); }

    if (($("#startDt").val().length < 1) || ($("#endDt").val().length < 1)) {
        $("#msgTimeline").addClass("errMsg"); ret = false;
    } else {
        $("#msgTimeline").removeClass("errMsg");
    }
    if (($("#ctcName").val().length < 1)) {
        $("#errCtcName").removeClass("m--hide").show(); ret = false;
    } else {
        $("#errCtcName").addClass("m--hide").show();
    }

    if (($("#prjLead").val().length < 1)) {
        $("#errLeadName").removeClass("m--hide").show(); ret = false;
    } else {
        $("#errLeadName").addClass("m--hide").show();
    }

    //keyMilestone
    var kmMatched = $(".km-group .km-input");
    var numKm = kmMatched.length;
    console.log("numKm", numKm);

    // for( var i=0; i < numKm; i++){

    //     var kmDt = $("#targetDt_"+i).val();
    //     kmDt = kmDt.split('-');
    //     var new_kmDt = new Date(kmDt[2],kmDt[1],kmDt[0]);
    //     if( (new_kmDt < new_startDt) || new_kmDt > new_endDt){
    //         console.log("milestone date should be within project timeline"); ret = false;
    //     }
       
    //     if( !$("#targetDt_"+i).val() || !$("#inputKM_"+i).val() ) {
    //         console.log("kmilestone")
    //         ret = false;
    //     }


    // }

    //vacancy
    var vacMatched = $(".vac-group .vac-input");
    var numVac = vacMatched.length;
    console.log("numVac",numVac);
    $("#errVac").addClass("m--hide").show();
    for( var i=0; i < numVac; i++){

        if( !$("#PosName_"+i).val() || !$("#vacTar_"+i).val() || 
            !$("#vacNo_"+i).val() || !$("#vacStatus_"+i).val() === '0' )
        {
            $("#errVac").removeClass("m--hide").show();
            ret = false;
        }
    }

    //skillsets
    //console.log("skillset", $("#skillset").tagsInput);
    var skillMatched = $("#skillsetItem");
    var skillsNum = skillMatched.length;
    
    if( skillsNum < 1){
        $("#errSkill").removeClass("m--hide"); ret = false;
    }
    else
        $("#errSkill").addClass("m--hide");
    


    console.log('ret', ret)
    if (ret == false) {
        // alert('abc');
        console.log('abc')
        var i = $("#form_create_proj_msg");
        i.removeClass("m--hide").show(), mApp.scrollTo(i, -200);
        return false;
    } else {
        // alert('def');
        console.log('def');
        $("#msgTimeline").removeClass("errMsg");
        $("#form_create_proj_msg").addClass("m--hide").hide();
        swal({
            title: "Do you wish to proceed?",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Yes"
        }
        ).then(function (e) {
            if (e.value) {
                // var val = $(document.activeElement).val();
                var val = e1.target.id;
                console.log(val)
                if (val == 'btn_save_draft') $("#btn_save_draft_hidden").click();
                if (val == 'btn_submit') $("#btn_submit_hidden").click();
                $("#startDt").val(); $("#endDt").val();
                $("#errMs, #errVac").addClass("m--hide").show();
                var j = $("#form_create_proj_msg_act");
                mApp.scrollTo(j, -200)
            }
        }
        )
    }
});

$(document).on('click', '#btn_close', function (e) {
    console.log("New form clicked");
    // $("#form_create_proj_msg").addClass("m--hide");
    //$("#errProjName").addClass("m--hide");
    //$("#errProjName").removeClass("errMsg");
    //$("#errCtcName").removeClass("errMsg");
    //$("#errProjObj").addClass("m--hide");
    //$("#errProjSumm").addClass("m--hide");
    $('#startDt').datepicker('setDate', null);
    $('#endDt').datepicker('setDate', null);
    $("#errLeadName, #errCtcName").removeClass("errMsg");  
    $("#form_create_proj_msg,#errProjName,#errProjLoc,#errProjObj," +
        "#errProjSumm,#errMs2,#errMs,#errVac,#errSkill").addClass("m--hide");
    
});

///
$(document).on('click', '[id^="showTargetDt_"]', function (e) {
    // e.preventDefault();
    $("#" + e.target.id).focus().datepicker({
        todayBtn: "linked", clearBtn: !0, todayHighlight: !0,
        format: "dd-mm-yyyy", //startDate: todayDate,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $("#" + e.target.id).focus();
});

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
