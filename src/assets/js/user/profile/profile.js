jQuery(document).ready(
    function () {
        skillUiSlider.init();
        leaderUiSlider.init();
        traitsUiSlider.init();
    }
);

var BootstrapDatepicker={init:function(){$("#m_datepicker_1, #m_datepicker_1_validate").datepicker({todayHighlight:!0,orientation:"bottom left",templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_1_modal").datepicker({todayHighlight:!0,orientation:"bottom left",templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_2, #m_datepicker_2_validate").datepicker({todayHighlight:!0,orientation:"bottom left",templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_2_modal").datepicker({todayHighlight:!0,orientation:"bottom left",templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_3, #m_datepicker_3_validate").datepicker({todayBtn:"linked",clearBtn:!0,todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_3_modal").datepicker({todayBtn:"linked",clearBtn:!0,todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_4_1").datepicker({orientation:"top left",todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_4_2").datepicker({orientation:"top right",todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_4_3").datepicker({orientation:"bottom left",todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_4_4").datepicker({orientation:"bottom right",todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_5").datepicker({todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}}),$("#m_datepicker_6").datepicker({todayHighlight:!0,templates:{leftArrow:'<i class="la la-angle-left"></i>',rightArrow:'<i class="la la-angle-right"></i>'}})}};jQuery(document).ready(function(){BootstrapDatepicker.init()});

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

$(document).on('click', '#startDtEdt', function (e) {
    $("#startDtEdt").focus();
    $('#startDtEdt').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy", autoclose: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#startDtEdt').focus();
});

$(document).on('click', '#endDtEdt', function (e) {
    $("#endDtEdt").focus();
    $('#endDtEdt').datepicker({
        todayHighlight: true, format: "dd-mm-yyyy", autoclose: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#endDtEdt').focus();
});


var skillUiSlider = function() {
     
    var skillAdd = function() {
        // init slider
        var slider = document.getElementById('m_nouislider_skill');

        noUiSlider.create(slider, {
            start: [ 2 ],
            step: 1,
            connect: [true, false],
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_skill_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    }
    return {
        // public functions
        init: function() {
            skillAdd(); 
            
        }
    };
}();


var leaderUiSlider = function() {
     
    var leaderAdd = function() {
        // init slider
        var slider = document.getElementById('m_nouislider_leader');

        noUiSlider.create(slider, {
            start: [ 2 ],
            step: 1,
            connect: [true, false],
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_leader_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    }
    return {
        // public functions
        init: function() {
            leaderAdd(); 
            
        }
    };
}();

var traitsUiSlider = function() {
     
    var traitsAdd = function() {
        // init slider
        var slider = document.getElementById('m_nouislider_traits');

        noUiSlider.create(slider, {
            start: [ 2 ],
            step: 1,
            connect: [true, false],
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_traits_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    }
    return {
        // public functions
        init: function() {
            traitsAdd(); 
            
        }
    };
}();

jQuery(document).ready(function () {
	//confirmApplicant.init();	
    $(document).on('click', '#edtBtn', function (e) {
        e.preventDefault();

        // init slider
        var slider = document.getElementById('m_nouislider_skill_edt');
        if (slider.noUiSlider && slider.noUiSlider.destroy) {
            slider.noUiSlider.destroy();
        } 
        noUiSlider.create(slider, {
            start: $("#m_nouislider_skill_edt_input").val(),
            step: 1,
            connect: [true, false],
            behaviour: "snap",
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_skill_edt_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    });
});

jQuery(document).ready(function () {
	//confirmApplicant.init();	
    $(document).on('click', '#addComp', function (e) {
        e.preventDefault();

        // init slider
        console.log('abc');
        var slider = document.getElementById('m_nouislider_comp');
        if (slider.noUiSlider && slider.noUiSlider.destroy) {
            slider.noUiSlider.destroy();
        } 
        noUiSlider.create(slider, {
            start: 2,
            step: 1,
            connect: [true, false],
            behaviour: "snap",
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_comp_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    });
});

jQuery(document).ready(function () {
	//confirmApplicant.init();	
    $(document).on('click', '#edtBtnComp', function (e) {
        e.preventDefault();

        // init slider
        var slider = document.getElementById('m_nouislider_comp_edt');
        if (slider.noUiSlider && slider.noUiSlider.destroy) {
            slider.noUiSlider.destroy();
        } 
        noUiSlider.create(slider, {
            start: $("#m_nouislider_comp_edt_input").val(),
            step: 1,
            connect: [true, false],
            behaviour: "snap",
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_comp_edt_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    });
});

// jQuery(document).ready(function () {
// 	//confirmApplicant.init();	
//     $(document).on('click', '#addLeader', function (e) {
//         e.preventDefault();

//         // init slider
//         var slider = document.getElementById('m_nouislider_leader');
//         console.log(slider);
//         if (slider.noUiSlider && slider.noUiSlider.destroy) {
//             slider.noUiSlider.destroy();
//         } 
//         noUiSlider.create(slider, {
//             start: 2,
//             step: 1,
//             connect: [true, false],
//             behaviour: "snap",
//             range: {
//                 'min': [ 1 ],
//                 'max': [ 3 ]
//             },
//             format: wNumb({
//                 decimals: 0 
//             })
//         });

//         // init slider input
//         var sliderInput = document.getElementById('m_nouislider_leader_input');

//         slider.noUiSlider.on('update', function( values, handle ) {
//             sliderInput.value = values[handle];
//         });

//         sliderInput.addEventListener('change', function(){
//             slider.noUiSlider.set(this.value);
//         });
//     });
// });

jQuery(document).ready(function () {
	//confirmApplicant.init();	
    $(document).on('click', '#edtBtnLeader', function (e) {
        e.preventDefault();

        // init slider
        var slider = document.getElementById('m_nouislider_leader_edt');
        if (slider.noUiSlider && slider.noUiSlider.destroy) {
            slider.noUiSlider.destroy();
        } 
        noUiSlider.create(slider, {
            start: $("#m_nouislider_leader_edt_input").val(),
            step: 1,
            connect: [true, false],
            behaviour: "snap",
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_leader_edt_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    });
});

// jQuery(document).ready(function () {
// 	//confirmApplicant.init();	
//     $(document).on('click', '#addTraits', function (e) {
//         e.preventDefault();

//         // init slider
//         var slider = document.getElementById('m_nouislider_traits');
//         if (slider.noUiSlider && slider.noUiSlider.destroy) {
//             slider.noUiSlider.destroy();
//         } 
//         noUiSlider.create(slider, {
//             start: 2,
//             step: 1,
//             connect: [true, false],
//             behaviour: "snap",
//             range: {
//                 'min': [ 1 ],
//                 'max': [ 3 ]
//             },
//             format: wNumb({
//                 decimals: 0 
//             })
//         });

//         // init slider input
//         var sliderInput = document.getElementById('m_nouislider_traits_input');

//         slider.noUiSlider.on('update', function( values, handle ) {
//             sliderInput.value = values[handle];
//         });

//         sliderInput.addEventListener('change', function(){
//             slider.noUiSlider.set(this.value);
//         });
//     });
// });

jQuery(document).ready(function () {
	//confirmApplicant.init();	
    $(document).on('click', '#edtBtnTraits', function (e) {
        e.preventDefault();

        // init slider
        var slider = document.getElementById('m_nouislider_traits_edt');
        if (slider.noUiSlider && slider.noUiSlider.destroy) {
            slider.noUiSlider.destroy();
        } 
        noUiSlider.create(slider, {
            start: $("#m_nouislider_traits_edt_input").val(),
            step: 1,
            connect: [true, false],
            behaviour: "snap",
            range: {
                'min': [ 1 ],
                'max': [ 3 ]
            },
            format: wNumb({
                decimals: 0 
            })
        });

        // init slider input
        var sliderInput = document.getElementById('m_nouislider_traits_edt_input');

        slider.noUiSlider.on('update', function( values, handle ) {
            sliderInput.value = values[handle];
        });

        sliderInput.addEventListener('change', function(){
            slider.noUiSlider.set(this.value);
        });
    });
});