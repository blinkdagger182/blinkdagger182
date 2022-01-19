export const SVars = Object.freeze({
    title1: 'Search Talent',
    title2: 'Search Talent List',

    //FILTER API DATA - Skillset, Age, Gender, Band
    // skillsetListAPI: '/skillset/list/all',
    searchSkillset: '/skillset/search',
    bandListAPI: '/skillset/list/all',
    talentSearch: '/talent/search',

    //    jobDataAPI: '/jobAdv/getAllForJobAdvPosition',
    jobAdvListAllAPI: '/jobAdv/list/all',
    jobAdvListActiveAPI: '/jobAdv/list/active',
    jobAdvListAdvertisedAPI: '/jobAdv/list/advertised',
    jobAdvLisEvaluateAPI: '/jobAdv/list/evaluate',
    jobAdvListInterviewAPI: '/jobAdv/list/interview',
    jobAdvListRevertAPI: '/jobAdv/list/revert',
    jobAdvListCompleteAPI: '/jobAdv/list/complete',

    pageSize: 20,
    errLoadData: '[ERROR] Loading Data Failed.',

    downloadAllXLS: 'Download All',
    dwApiAll: '/jobAdv/export/list/all',
    dwApiActive: '/jobAdv/export/list/active',
    dwApiEvaluate: '/jobAdv/export/list/evaluate',
    dwApiIview: '/jobAdv/export/list/interview',
    dwApiRevert: '/jobAdv/export/list/revert',
    dwApiComplete: '/jobAdv/export/list/complete',

    rAdvTrack: '/admin/job/advertisement-tracking',

    // reportFilter: '/report/jobAdv/tracking/filter',
    getFilterOptions: '/talent/search/filter',
    applyReportFilter: '/report/jobAdv/tracking',
    getStaffDetailsAPI: '/talent/details/get',
    getProfilePictureAPI: '/get/image',
    iviewAct: false,
    aplcAct: false,
});