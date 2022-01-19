export const MovementPermitVars = Object.freeze({
    letterId:6,

    apiGetBasicInfo: '/evl/user/getbasicInfo',
    apiGetAppliedLetterList: '/evl/user/getletterlist',

    apiGetLetterType: '/evl/user/getlettertypes',
    apiGetPurpose: '/evl/user/getpurposes/6',
    apiGetSupervisor: '/evl/user/getSupervisor',
    apiGetSuppdoc: '/evl/user/getsuppdoc/6',

    apiPostUploadsuppdoc: '/evl/user/uploadsuppdoc',
    apiPostAddletter: '/evl/user/addletter',
    APIGetImg: '/get/image',

    apiUploadRemove: '/evl/user/deletesuppdoc/',
    
    // app.get  ('/evl/user/getbasicInfo', getBasicInfo, share.sendQuery);
    // app.get  ('/evl/user/getlettertypes', getLetterType, share.sendQuery);
    // app.get  ('/evl/user/getletterlist', getletterList, share.sendQuery);
    // app.get  ('/evl/user/getletterlistreptto', getletterListReptto, share.sendQuery);
    // app.get  ('/evl/user/getpurposes/:Id', getPurposeByType, share.sendQuery);
    // app.get  ('/evl/user/getSupervisor', getSupervisor, share.sendQuery);
    // app.get  ('/evl/user/getsuppdoc/:letterId', getUserAttachList, share.sendQuery);
    // app.post ('/evl/user/addletter', addletter, share.updateQuery);
    // app.post ('/evl/user/uploadsuppdoc', userUploadSuppDoc);
    // app.get  ('/evl/user/deletesuppdoc/:Id', delUserAttachList, share.updateQuery);
})