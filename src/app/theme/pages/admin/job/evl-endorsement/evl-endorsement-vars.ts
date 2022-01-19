export const INVars = Object.freeze({
    getEmpgroupsAPI : '/evl/admin/getempgroup',
    getLtypeAPI: '/evl/admin/getlettertypes',
    getStatesAPI: '/evl/admin/getstates',
    getBandsPI: '/evl/admin/getbands',
    postSearchLettrsAPI: '/evl/admin/getletterlist',
    getStatusAPI:'/evl/admin/getstatusendorsed',
    getLobAPI:'/evl/admin/getlob',
    getLetterDetails:'/evl/admin/getletter/',
    getDocumentLists:'/evl/admin/getendorsedoc/',
    getDelDocument:'/evl/admin/deleteendorsedoc/',
    postLetterAttachUploadAPI: '/evl/admin/uploadendorsedoc',
})

export class letter {
    constructor(id, pers_no, name, post_desc, staff_no, purpose, location, destination, approver,from) {}
}