jQuery(document).ready(function () {

    $('#reg_option_0,#reg_option_1,#reg_option_2,#reg_option_3').on('click', function () {
        $('.registration_form_option').not(this).removeClass('checked');
            $(this).addClass('checked');
            $(':checkbox').not(this).prop('checked', false);
            $('#'+this.id+'_check').prop('checked', true);
    });
})