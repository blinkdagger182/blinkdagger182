export const SUAVars = Object.freeze({

    getLOBAPI: '/jobAdv/jobProfile/lob',
    jobProfileSearchLOB: '/jobAdv/jobProfile/search',
    jobAdvUserSearch: '/jobAdv/user/search',
    jobAdvUserAdd: '/jobAdv/user/add',
    jobAdvUserDel: '/jobAdv/user/del',

    getJobUserList: '/jobAdv/user/list',

    myType: '/admin/job/profile/detail',
    APIGetSUAList: '/localuser/list',
    APIPosSUADelete: '/localuser/delete',
    APIPosSUAAdd: '/localuser/add',
    
    APIPostAdd: '/localuser/add',
    APIPostDelete: '/localuser/delete',
    APIGetList: '/localuser/list',

})

export class LOBSUA {
    req: lobSUAArr;
}

export class lobSUAArr {
    constructor(name: string) {
        this.name = name;
    }
    name: string;
}