export const Vars = Object.freeze({
    // :general 
    title1: 'Settings',
    pageSize: 20,
    errLoadData: '[ERROR] Loading Data Failed.',

    // :Sticky NAV
    jobUser: 'Job User',
    closed: 'Closed',
    broadcastMsg: 'Broadcast Message on ERA App',
    feedBack: 'Ask Us',
    verifySkillsets: 'Verify Skillsets',
    appVersioning: 'ERA App Versioning',
    faqMngt: 'Faq Management',

    // :Job User Section
    jUSec1: 'Admin', jUSec1Icon: 'flaticon-user-settings',
    jUSec2: 'HeadHCBD', jUSec2Icon: 'flaticon-avatar',
    jUSec3: 'Advertiser', jUSec3Icon: 'flaticon-paper-plane',
    jUSec4: 'Editor', jUSec4Icon: 'flaticon-edit-1',
    jUSec5: 'Career Management', jUSec5Icon: 'flaticon-suitcase',
    jUSec6: 'Talent Management', jUSec6Icon: 'flaticon-puzzle',
    jUSec7: 'Talent HCBD', jUSec7Icon: 'fa-grav',//fa-money fa-grav'
    jUSec8: 'Panel Management', jUSec8Icon: 'flaticon-edit',//fa-money fa-grav'
    jUSec9: 'RPM', jUSec9Icon: 'flaticon-rocket',//fa-money fa-grav'
    jUSec10: 'MAPS HCBD', jUSec10Icon: 'flaticon-puzzle',
    jUSec11: 'VRP HCBO', jUSec11Icon: 'flaticon-edit',
    admMaxPerPage: 20, headMaxPerPage: 20, advMaxPerPage: 20, edtMaxPerPage: 20, 
    proMaxPerPage: 20, expMaxPerPage: 20, pmMaxPerPage: 20, rpmMaxPerPage: 20, mapsMaxPerPage: 20,
    vrpMaxPerPage: 20,
    rJobUser: '/admin/settings/job-user',

    // :Closed Ads Section
    rClosedAds: '/admin/settings/closed-ads',
    clsMaxPerPage: 20,

    // :Broadcast Msg
    broadcastMsgMax: 256,
    broadcastTtlMax: 99,
    bcStaffIdList: '/user/notification/list', //'/jobAdv/requester/list',
    bcPostSingle: '/notification/push/single',//    "targetUser": "string", "notificationTitle": "string",  "notificationBody": "string"
    bcPostAll: '/notification/push/broadcast', //   "notificationTitle": "string", "notificationBody": "string"
    rBCast: '/admin/settings/broadcast-message',
    bcByLob: '/notification/push/topic',
    getLOBAPI: '/jobAdv/jobProfile/lob',
    bcPostSingleC: '/notification/career/push/single',	// Post to TMCAREER  
    bcPostAllC: '/notification/career/push/broadcast',	// Post to TMCAREER
    bcPostTopicC:'/notification/career/push/topic', // Post to TMCAREER

    // :Feedback
    fbList: '/feedback/list',
    maxFbPerPage: 20,
    downloadAllXLS: 'Download All',
    rFeedBack: '/admin/settings/feedbacks',
    APIsearchCircle: '/circle/search',// Post search name
    APIGetImg: '/get/image',
    APIfeedbackInsert: '/feedback/insert',
    APIfeedbackGetAll: '/feedback/getAll',
    APIfeedbackReply:'/feedback/comment/',
    APIfeedbackFilter:'/feedback/search/filter',
    APIfeedbackSearch:'/feedback/search',
    APIfeedbackClassUpdate: '/feedback/classification/update',

    // :Verify Skillsets
    vsTitle2: 'Verify Skillsets',
    skillsetMaxPerPage: 20,
    rVerSkills: '/admin/settings/verify-skillsets',

    // :Era App Versioning
    rVersioning: '/admin/settings/era-app-versioning',
    verMaxPerPage: 20,

    //Simulate User Account
    rSimulateUserAcc:'/admin/settings/simulate-user-account',
    SuaTitle: 'Simulate User Account', 
    SuaSec1Icon: 'flaticon-user-settings',
    SuaAddbtn: 'User',
}); 
