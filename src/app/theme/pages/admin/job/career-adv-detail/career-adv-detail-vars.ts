export const JDVars = Object.freeze({
    rJobAdvProf: '/admin/job/advertisement/profile/detail',
    rJobAdvTrack: '/admin/job/advertisement-tracking/detail',
    rNEPromo: '/admin/job/advertisement/nePromo/detail',

    title1: 'Create Job Profile',
    errLoadData: '[ERROR] Loading Data Failed.',

    jobPostAdv: '/jobcareer/addCareerAdv', //Advertise

    btnAdvertise: 'Advertise this Job',
    btnPrvAdvertise: 'Preview this Job',
    btnGotoAdvertise: 'Go to Advertisement Page',
    btnGotoAdsTracking: 'Go to Tracking Page',
    btnGotoNEPromo: 'Go to Non-Exec Promotion Page',

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

    msgAdvPeriod: 'Please select advertisement start and end date',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">We currently have <strong>no data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    //noData: '<b>No Data</b>',
    advDisableMsg: 'Job purpose is required if you wish to advertise this job profile.',

    msgOccupied: 'I understand that this application is OCCUPIED but still would like to proceed for advertisement',
    msgDefault: 'To complete the advertisement, kindly select the advertisement period start and end date (14 days range)',

    approverList: '/jobAdv/approval/list',

    posDesc: '/jobAdv/editPositionDesc',
    skillSearch: '/skillset/search',
    requestorList: '/jobAdv/requester/list',

    APISearchUser: '/jobAdv/user/search',
    jobProfById: '/jobCareer/getJobPost',
    jobProfByIdC: '/jobCareer/addJobPost',
    jobProfByIdU: '/jobCareer/editJobPost',
    masterList: '/jobCareer/getJobPostDataList',

    jobFcClusAPI: '/jobAdv/getFcJobClusterList',
    jobFcFamilyAPI: '/jobAdv/getFcJobFamilyList',
    jobFcFamilyDescAPI: '/jobAdv/getFcDescList',

    jobUpdPurpose: '/jobCareer/editJobPurpose',

    // AOR
    jobAddAor: '/jobCareer/addJobAor',
    jobUpdAor: '/jobCareer/editJobAor',
    jobDelAor: '/jobCareer/delJobAor',
    // Technical
    jobAddTech: '/jobCareer/addJobTechnical',
    jobUpdTech: '/jobCareer/editJobTechnical',
    jobDelTech: '/jobCareer/delJobTechnical',
    // Functional
    jobAddFunc: '/jobCareer/addJobFunctional',
    jobUpdFunc: '/jobCareer/editJobFunctional',
    jobDelFunc: '/jobCareer/delJobFunctional',
    // Experience
    jobAddExp: '/jobCareer/addJobExperience',
    jobUpdExp: '/jobCareer/editJobExperience',
    jobDelExp: '/jobCareer/delJobExperience',
    // Quality
    jobAddQua: '/jobCareer/addJobQualification',
    jobUpdQua: '/jobCareer/editJobQualification',
    jobDelQua: '/jobCareer/delJobQualification',

    jobOptClusterCom: '/jobAdv/getTcJobClusterList',
    jobOptCatTechCom: '/jobAdv/getTcJobCategoryList',
    jobOptComTechCom: '/jobAdv/getTcJobCompetencyList',
    jobOptDefTechCom: '/jobAdv/getTcJobCompetencyDef',
}); 
