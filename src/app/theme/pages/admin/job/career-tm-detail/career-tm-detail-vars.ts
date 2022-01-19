export const JADVars = Object.freeze({
    rJobProfDetailsCareer: '/admin/job/advertisement/new-career/detail',
    rJobProfDetailsERA: '/admin/job/profile/detail',
    title1: 'Career@TM Details',
    title2: 'Career@TM #',
    title3: 'Career@TM Info',
    title4: 'Applicant List',
    title5: 'Interview List',
    title6: 'History',
    title7: 'Job Purpose',
    title8: 'CareerTM Profile Info',
    title9: 'Comments',

    appList: '', // Applicant List  (HCBD HEAD, HCBO)
    iViewList: '',//  (HCBD HEAD, HCBO)
    hist: '',//  (HCBD HEAD, HCBO)
    chooseApp: '',//Choose applicant (HCBD)
    appDetail: '',//  (HCBD HEAD, HCBO)
    errNoData: '--- No Data ---',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">Ooopss... <strong>No data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    errLoadData: '[ERROR] Loading Data Failed.',

    advInfoById: '', // Get Advertisement Info  (HCBD HEAD, HCBO)
    jobProfById: '/jobCareer/ads/get', // Get Job Profile Info  (HCBD HEAD, HCBO)
    // actApprHCBD: '/jobAdv/approval/hcbd/edit', // Post approval by HCBD
    // actApprHCBO: '/jobAdv/approval/hcbo/edit', // Post approval by HCBD
    // actAppr: '/jobAdv/approval/pending/edit', // Post approval 
    actAppr: '/jobCareer/ads/approval/edit', // Post approval - Replace with correct API

    // Get Personnel Profile Picture
    getProfilePictureAPI: '/get/image',
    getERAattachmentAPI: '/era/getDoc',

    // Applicant List Panel
    showPanelApplList: false, // show or hide panel based on advertisement status
    aplcAct: false, // hide or show select applicant function . show only if status=4 and isOwner=1
    aplcSubmit: false, // initial
    aplcStatus: false,
    btnCallIview: 'Call for Interview', // button label
    errNoApplicant: '--- Applicant List is Empty ---',
    selectApplicantForIviewAPI: '/jobCareer/ads/applicant/edit',
    getApplicantDetailsAPI: '/jobAdvApply/applicant/get',
    getEraUserDetailsAPI: '/era/applicant/get',//replace here to get era_user_access
    
    // Interview List Panel
    iviewPanel: false, // show or hide panel based on advertisement status
    iviewAct: false, // choose applicant from list and also submit button (multiple choose)
    iviewSubmit: false, // disable submit button if applicant selected <1
    iviewStatus: false,
    btnAcceptForPosition: 'Success Candidate',
    errNoIview: '--- Interview List is Empty ---',
    selectSuccessFromIviewAPI: '/jobCareer/ads/interview/edit',
    selectMulSuccFromIviewAPI: '/jobCareer/ads/interview/select',

    advExpDate: 'Advertisement start date has ended. Please update to proceed with the advertisement.',
    advExceedDate: 'Advertisement date range exceed 14 days limit.',
    advIsOccupied: 'Advertisement request is for <b>OCCUPIED</b> position.',

    btnReSubmit: 'Resubmit',
    btnWithDraw: 'Cancel this Ads',
    btnClose: 'Close this Ads',
    apiResubmit: '/jobAdv/resubmit',
    apiClosed: '/jobCareer/ads/closed',

    btnGotoCareerProfile: 'Go to CareerTM Profile Page',
    btnGotoJobProfile: 'Go to Job Profile Page',

    advApplDwApi: '/jobAdvApply/applicant/pccs/list',
    eraAdvApplicant: '/era/adv/applicants',
    eraAdvApplicantPaging: '/era/adv/applicants/paging',

    advApplDwBtn: 'Download Applicant Details',

    jobAdvpostCloseAds: '/jobAdv/advertised/close',
    joblistcloseAdsAPI: '/jobAdv/advertised/list',
}); 