export const IVars = Object.freeze({
    getIDPSummary : '/idp/user/summary',
    createIDP: '/idp/user/add',
    getIdpDetails: '/idp/user/get',
    updAspiration: '/idp/user/aspiration/edit',
    updMobility: '/idp/user/mobility/edit',

    addStrength: '/idp/user/strength/add',
    updStrength: '/idp/user/strength/edit',
    delStrength: '/idp/user/strength/del',

    addArea: '/idp/user/area/add',
    updArea: '/idp/user/area/edit',
    delArea: '/idp/user/area/del',

    addActionPlan: '/idp/user/action/add',
    updActionPlan: '/idp/user/action/edit',
    delActionPlan: '/idp/user/action/del',
    updActionStatus: '/idp/user/action/update',

    idpSubmitSupervisor: '/idp/user/submit',
    completeIDP: '/idp/user/complete',

    supAcknowledge: '/idp/supervisor/ack',
    supRevert: '/idp/supervisor/revert',

    getTrainCluster: '/jobAdv/getFcJobClusterList',
    getTrainFamily: '/jobAdv/getFcJobFamilyList',
    getTrainComp: '/jobAdv/getFcDescList',
    getfuncTraining: '/idp/user/action/training/functional',

    getleadCompetency: '/idp/user/action/training/leadership/filter',
    getLeadTraining: '/idp/user/action/training/leadership',
    getPrevYearData: '/idp/user/get/prev_year',
    getPrevYearAction: '/idp/user/get/prev_action',
    getPrevYearYear: '/idp/user/get/idp_form_list'
    
})

export const INVars = Object.freeze({
    
    postSearchidpAPI: '/idp/admin/search',
   //getidpDetails: '/idp/admin/viewidp',
    getidpDetails: '/idp/user/get',
    getStatusAPI: '/idp/admin/getStatus',
    getBatchAPI: '/idp/admin/listbatches',
    downloadAPI: '/idp/admin/download2',
    downloadNoIDPAPI: '/idp/admin/dldNoIDP',
    currBatchAPI: '/idp/admin/latestBtc',
    mobilityQFlex :'Are you flexible to be mobile?',
    mobilityQFunc :'Are you willing to explore in another function?',
    mobilityQLoc :'Are you willing to explore working in other locations?',
    mobilityQReason :'Why',
    mobilityQDue :'Until when',
    getProfilePictureAPI: '/get/image',
    mentorFeedback: '/idp/mentor/update'
});
