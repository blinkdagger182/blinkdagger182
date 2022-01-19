export const JUVars = Object.freeze({

    getLOBAPI: '/jobAdv/jobProfile/lob',
    getCOMPAPI: '/jobAdv/jobProfile/comp',
    jobProfileSearchLOB: '/jobAdv/jobProfile/search',
    jobAdvUserSearch: '/jobAdv/user/search',
    jobAdvUserAdd: '/jobAdv/user/add',
    jobAddPnlMgmt: '/recruitment/admin/addPanelMgmt',
    jobAdvUserCompAdd: '/jobAdv/user/comp/add',
    jobAdvUserDel: '/jobAdv/user/del',
    getJobUserList: '/jobAdv/user/list',

    myType: '/admin/job/profile/detail',

})

export class LOB {
    req: lobArr;
}

export class COMP {
    req: CompArr;
}

export class lobArr {
    constructor(name: string) {
        this.name = name;
    }
    name: string;
}

export class CompArr {
    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }
    code: string;
    name: string;
}