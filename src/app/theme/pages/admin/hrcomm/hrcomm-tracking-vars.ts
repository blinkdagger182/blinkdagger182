export const hrcVars = Object.freeze({
    title1: 'MESRA 2021 Tracking',

    pageSize: 10,
    errLoadData: '[ERROR] Loading Data Failed.',
    
    getProfile: '/user/getProfile',
    APIGetImg: '/get/image',

    postCommListAPI: '/hrc/admin/comm/getlist',
    postCommDetailListAPI: '/hrc/admin/comm/getdetails',   
    postCommAddAPI: '/hrc/admin/comm/add',
    postCommEditAPI: '/hrc/admin/comm/upd',
    postCommBodyImgAddAPI: '/hrc/admin/body/upload',
    postCommBodyEngImgAddAPI: '/hrc/admin/body/upload_en',
    postCommThumbImgAddAPI:'/hrc/admin/thumb/upload',
    postCommUpdAPI: '/hrc/admin/comm/upd',
    postCommAttachUploadAPI: '/hrc/admin/attach/upload',
    postCommPublishAPI: '/hrc/admin/comm/publish',

    // delete comment and Download
    postDownPdf:'/hrc/admin/comm/pdfdownload',
    postDelSecLayer: '/hrc/admin/comm/commentlayerdel',
    postDelFirstLayer : '/hrc/admin/comm/commentdel',
   
   //Attachment
    getCommDetail: '/hrc/user/get/comm/',
    getAnnImg: '/hrc/get/image/',
    getCommAttachment: '/hrc/user/attach/getlist/',

    //Report
    getReport: '/hrc/admin/comm/getreport',
    postFilterYear: '/hrc/admin/comm/getreportbyyear',
    postDwnReport: '/hrc/admin/comm/getlistsdashdown',

    //Add New
    postNewCategory: '/hrc/admin/comm/addcategory',
    postNewCommType: '/hrc/admin/comm/addtype',

  });
export class News {
    constructor(id, subject, image_url, from_group, category, location, publish_date, status,from) {}
}