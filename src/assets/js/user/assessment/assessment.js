jQuery(document).ready(
    function () {
        performanceUiSlider.init();
    }
);
var performanceUiSlider = function() {
     
    var performanceAdd = function() {
        // init slider
        var slider = document.getElementById('m_nouislider_performance');

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
        var sliderInput = document.getElementById('m_nouislider_performance_input');

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
            performanceAdd(); 
            
        }
    };
    //cosn
}();
