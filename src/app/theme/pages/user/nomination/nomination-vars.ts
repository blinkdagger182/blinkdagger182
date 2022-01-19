export const NominationVars = Object.freeze({


    APIgetProfile: '/circle/friend/getProfile', // Get friend's profile
    APIallFriend: '/circle/people/friend/getAll', // Post all Pending, Recommended an all friends
    APIuserProfile: '/sp/basicInfo', // changed on 28 JUL 2020
    APIgetPersonalDetail: '/api/user/getProfile', //get current user detail
    APIgetSubordinates: '/sp/get_subordinates',
    APIgetUserProfile: '/user/career/profile', //changed 22 JUL 2020
    //APIgetNewSuccessorProfile: '/sp/get_newsuccessorprofile', //added 26 JUL 2020
    APIPostInfo: '/sp/basicInfo', // changed on 22 JUL 2020
    APIdownload: '/idp/admin/download2',
    getidpDetails: '/sp/get_idp',
    APIgetBoxList: '/tc/get_box_matrix',
    APIgetSuccessors: '/sp/get_successorsByCurrBatch',
    getSPCurrBatch: '/sp/admin/currBatch',
    //APIgetQuestionBoxChangeId: '/tc/assessment/getQuesListByBoxChgId',
    //APIsaveAssessmentDraft: '/tc/assessment/save_assessment',
    //APIupdateAssessmentDraft: '/tc/assessment/edit_assessment',
    //APIpostCompleteAssessment: '/tc/assessment/complete',
    actionSummaryAPI : '/user/action/summary',
    getLOBAPI: '/jobAdv/jobProfile/lob',
    jobProfileSearchLOB: '/jobAdv/jobProfile/search',
    spNomineeSearch: '/sp/searchsuccessors',
    spNomineeAdd: '/sp/add_successorsByBatchIdNew',
    spNomineeUpd: '/sp/upd_flightRisk',
    spNomineeDel: '/sp/del_successorsById',
    spNominationUpd: '/sp/upd_Status',
    //spNomineeCountByTypeId: '/sp/get_successorsCountByTypeId/',
    //spNomineeChkPostLvelAdd : '/sp/get_checkSuccessorPostLevel',

    getJobUserList: '/jobAdv/user/list',

    // Get user Picture
    APIGetImg: '/get/image',

    errNoData: '--- No Data ---',
    noData: '<div class="m-alert m-alert--icon m-alert--outline alert alert-warning alert-dismissible fade show" role="alert"><div class="m-alert__icon"><i class="la la-warning"></i></div><div class="m-alert__text">Ooopss... <strong>No data</strong> at the moment.</div><div class="m-alert__close"><button type="button" class="close" data-dismiss="alert" aria-label="Close"></button></div></div>',
    errLoadData: '[ERROR] Loading Data Failed.',
    errNoResult: 'No Result. Please try again.',
    errSearch: '[ERROR] Searching Failed.',
    pageSize: 10,
  

})

export class LOB {
    req: lobArr;
}

export class lobArr {
    constructor(name: string) {
        this.name = name;
    }
    name: string;
}
export class Successpr {
    constructor(id,image_url,pers_no,name,post_desc,staff_no,state_id,successor_type_id,ns_post_id,flight_risk,from) {}
}