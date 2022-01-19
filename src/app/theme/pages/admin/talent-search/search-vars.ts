export const SVars = Object.freeze({
    title1: 'Search Talent',
    title2: 'Search Talent List',

    //FILTER API DATA - Skillset, Age, Gender, Band
    // skillsetListAPI: '/skillset/list/all',
    searchSkillset: '/skillset/search',
    bandListAPI: '/skillset/list/all',
    talentSearch: '/talent/search/role',

    //    jobDataAPI: '/jobAdv/getAllForJobAdvPosition',
    jobAdvListAllAPI: '/jobAdv/list/all',
    jobAdvListActiveAPI: '/jobAdv/list/active',
    jobAdvListAdvertisedAPI: '/jobAdv/list/advertised',
    jobAdvLisEvaluateAPI: '/jobAdv/list/evaluate',
    jobAdvListInterviewAPI: '/jobAdv/list/interview',
    jobAdvListRevertAPI: '/jobAdv/list/revert',
    jobAdvListCompleteAPI: '/jobAdv/list/complete',


    // Get user Picture
    APIGetImg: '/get/image',
    getidpDetails: '/sp/get_idp',

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
    //getLOBJobAdsAPI: '/sp/admin/getloblist',
    getLOBJobAdsAPI: '/admin/editor/lob',
    applyReportFilter: '/report/jobAdv/tracking',
    getStaffDetailsAPI: '/talent/details/get',
    APIgetSuccessors: '/sp/admin/getsuccessorsByBatch',
    getSPCurrBatch: '/sp/admin/currBatch',
    getProfilePictureAPI: '/get/image',
    iviewAct: false,
    aplcAct: false,
})

export class Successpr {
    constructor(id,image_url,pers_no,name,post_desc,staff_no,state_id,successor_type_id,ns_post_id,flight_risk,from) {}
}