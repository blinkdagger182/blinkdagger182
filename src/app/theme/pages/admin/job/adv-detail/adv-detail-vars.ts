export const JDVars = Object.freeze({
    title1: 'Advertisement Details',
    title2: 'Position #',
    errLoadData: '[ERROR] Loading Data Failed.',

    jobProfById: '/jobAdv/getJobProfileByPosId',
    jobUpdPurpose: '/jobAdv/editJobPurpose',
    //jobAddQua: '/jobAdv/addJobQualification',
    //jobUpdQua: '/jobAdv/editJobQualification',
    //jobDelQua: '/jobAdv/delJobQualification',
    jobPostAdv: '/jobAdv/addJobAdv',

    btnAdvertise: 'Advertise this Job',
    btnGotoJobProfile: 'Go to Job Profile Page',

    // Panel
    tab1Title: 'Job Info',
    tab2Title: 'S.U.C.C.E.S.S Competencies',
    tab3Title: 'Job Purpose',
    tab4Title: 'Qualification',
    tab5Title: 'Technical Competencies',
    tab6Title: 'Area of Responsibilities',
    tab7Title: 'Experience',//'Requirement', 
    tab8Title: 'Functional Competencies',
    tab9Title: 'Digital Competencies',
    tab10Title: 'Skillsets',

    msgAdvPeriod: 'Please select advertisement start and end date',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">Ooopss... <strong>No data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    //noData: '<b>No Data</b>',
    advDisableMsg: 'Job purpose is required to submit this job profile for advertisement.',
    advDisableMsg2: 'Job purpose and skillsets are required to submit this job profile for advertisement.',

    msgOccupied: 'I understand that this application is OCCUPIED but still would like to proceed for advertisement',
    msgDefault: 'To complete the advertisement, kindly select the advertisement period start and end date (14 days range if Internal (Era) and 30 days range if External (Career@TM)) ',

    requestorList: '/jobAdv/requester/list',
    approverList: '/jobAdv/approval/list',
    posDesc: '/jobAdv/editPositionDesc',

    unauthorizeMsg: 'Unauthorized Access. You do not have privilege for job advertisement. Kindly contact your HCBD personnel. Thank you.',
    cannotAdv: 'This position cannot be advertised.',

    rJobDetails: '/admin/job/profile/detail',
    skillSearch: '/skillset/search',
}); 
