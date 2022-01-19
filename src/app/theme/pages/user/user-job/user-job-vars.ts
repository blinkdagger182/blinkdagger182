export const JobsVars = Object.freeze({
    pageTitle: 'Available Vacancies',
    imgAPI: '/get/image/',
    jobTotalAPI: '/jobAdv/lob/advertised/total',
    getUserProfileAPI: '/user/career/profile',

    jobListAPI: '/jobAdv/lob/advertised/list',
    likeJobAPI: '/jobAdv/like/add',
    unLikeJobAPI: '/jobAdv/like/del',
    getLikedUserPI: '/jobAdv/like/get',

    getApplHistoryAPI: '/jobAdv/apply/history',
    getApplHisListAPI: '/jobAdv/apply/history/list',
    deleteApplNEpromo: '/jobAdv/delJobApplication',
    getPanelFeedback : '/jobAdvApply/panelFeedback',

    updRatingAPI: '/jobAdvApply/rating',
    getBadgeAPI: '/box/badge/get',
    getJobApproveSupList: '/jobAdvApply/approval/superior/list',
    editJobApproveSupList: '/jobAdvApply/approval/superior/edit',

    //offer letter
    getApplicantData: '/jobAdvApply/applicant/get',
    getUserApplicantData: '/jobAdvApply/applicant/offerletter',
    postApprove: '/api/jobAdvApply/approveNE',
    acceptOffer: '/api/jobAdvApply/acceptedNE',
    rejectOffer: '/api/jobAdvApply/rejectNE',

    jobProfileAPI: '/jobAdv/get',
    jobApplyAPI: '/jobAdv/apply',
    superiorInfoAPI: '/jobAdvApply/superior/get',
    jobAppAPI: '/jobAdv/app/get',
    jobAppStatusAPI: '/jobAdv/apply/status',

    APIgetProfile: '/circle/friend/getProfile',
    APIsendRequestFr: '/circle/friend/request/sent', //send request
    APIrejectFriend: '/circle/friend/request/unfriend', //unfriend
    APIacceptFriend: '/circle/friend/request/accept', //Post accept/follow friend 
    
    APIAssessmentList:'/talent/assessment/list',
    APIAssessmentQuestion:'/talent/assessment/get',
    APIAssessmentAnswered:'/talent/assessment/add',
    APIFCQuestion:'/jobAdvApply/assessment/get',
    APIFCAnswered:'/jobAdvApply/assessment/add',

    checkRequestApplicantAPI: '/jobAdvApply/assessment/check',
    requestApplicantAPI: '/jobAdvApply/assessment/request',
    HarrisonUpdateAPI: '/jobAdvApply/harrison/update',

    getPanelListByStaffNo: '/recruitment/user/getPanelListByStaffNo',
    getApplicantByStaffNo: '/recruitment/user/getApplicantByStaffNo',
    getApplicantByAdsID: '/recruitment/user/getApplicantByAdsID',
    getJobInfoByAdsID: '/recruitment/user/getJobInfoByAdsID',

    APIGetImg: '/get/image',
    
    getVrpSession: '/vrp/user/get_activeSession',
    getRoleVrp: '/vrp/user/check_login_role',
    
    getRoleVsp: '/vrp/user/check_login_role_vsp',
});