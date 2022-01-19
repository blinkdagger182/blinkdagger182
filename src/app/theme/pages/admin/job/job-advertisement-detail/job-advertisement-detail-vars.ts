export const JADVars = Object.freeze({
    rJobProfDetails: '/admin/job/profile/detail',
    title1: 'Job Advertisement Details',
    title2: 'Advertisement #',
    title3: 'Advertisement Info',
    title4: 'Applicant List',
    title5: 'Interview List',
    title6: 'History',
    title7: 'Job Purpose',
    title8: 'Job Profile Info',
    title9: 'Comments',
    title10: 'Successful Candidates',

    appList: '', // Applicant List  (HCBD HEAD, HCBO)
    iViewList: '',//  (HCBD HEAD, HCBO)
    hist: '',//  (HCBD HEAD, HCBO)
    chooseApp: '',//Choose applicant (HCBD)
    appDetail: '',//  (HCBD HEAD, HCBO)
    errNoData: '--- No Data ---',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">Ooopss... <strong>No data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    errLoadData: '[ERROR] Loading Data Failed.',

    advInfoById: '', // Get Advertisement Info  (HCBD HEAD, HCBO)
    jobProfById: '/jobAdv/get', // Get Job Profile Info  (HCBD HEAD, HCBO)
    // actApprHCBD: '/jobAdv/approval/hcbd/edit', // Post approval by HCBD
    // actApprHCBO: '/jobAdv/approval/hcbo/edit', // Post approval by HCBD
    actAppr: '/jobAdv/approval/pending/edit', // Post approval 

    //JOBCAREER API
    jobCareerProfById: '/jobCareer/ads/get',
    actApprCareer: '/jobCareer/ads/approval/edit',

    // Get Personnel Profile Picture
    getProfilePictureAPI: '/get/image',

    // Applicant List Panel
    showPanelApplList: false, // show or hide panel based on advertisement status
    aplcAct: false, // hide or show select applicant function . show only if status=4 and isOwner=1
    aplcSubmit: false, // initial
    aplcStatus: false,
    btnCallIview: 'Call for Interview', // button label
    errNoApplicant: '--- Applicant List is Empty ---',
    selectApplicantForIviewAPI: '/jobAdvApply/hcbd/applicant/edit',
    getApplicantDetailsAPI: '/jobAdvApply/applicant/get',

    // Interview List Panel
    iviewPanel: false, // show or hide panel based on advertisement status
    iviewAct: false, // choose applicant from list and also submit button (multiple choose)
    iviewSubmit: false, // disable submit button if applicant selected <1
    iviewStatus: false,
    btnAcceptForPosition: 'Success Candidate',
    errNoIview: '--- Interview List is Empty ---',
    selectSuccessFromIviewAPI: '/jobAdvApply/hcbd/interview/edit',

    advExpDate: 'Advertisement start date has ended. Please update to proceed with the advertisement.',
    advExceedDate: 'Advertisement date range exceed 14 days limit.',
    advIsOccupied: 'Advertisement request is for <b>OCCUPIED</b> position.',

    btnReSubmit: 'Resubmit',
    btnWithDraw: 'Cancel this Ads',
    btnClose: 'Close this Ads',
    apiResubmit: '/jobAdv/resubmit',
    apiClosed: '/jobAdv/closed',

    btnGotoJobProfile: 'Go to Job Profile Page',
    btnGotoCareerProfile: 'Go to CareerTM Profile Page',

    advApplDwApi: '/jobAdvApply/applicant/pccs/list',
    advApplDwBtn: 'Download Applicant Details',

    jobAdvpostCloseAds: '/jobAdv/advertised/close',
    joblistcloseAdsAPI: '/jobAdv/advertised/list',


    AssessmentResFCAPI: '/jobAdvApply/assessment/results',
    AssessmentResTCAPI: '/talent/assessment/results',
    HarrisonUpdateAPI: '/jobAdvApply/harrison/update',

    //NE Promo
    postAddSession: '/recruitment/admin/add_session',
    postApplicantDetails: '/recruitment/admin/intvwDetails',
    getCandidateReport: '/recruitment/admin/getCandReport',
    postDownloadAssessment: '/api/talent/assessment/resultLeadership',
    postDownloadApplicant: '/api/jobAdvApply/applicant/pccs/listNE',
    postApprove: '/api/jobAdvApply/approveNE',
    postIvEditNE: '/api/jobAdvApply/hcbd/interview/edit_NE',
    postSuccessOffer: '/api/jobAdvApply/successoffer',
    postOfferLetter: '/api/jobAdvApply/applicant/offerletter'
}); 