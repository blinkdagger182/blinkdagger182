export const UsrVars = Object.freeze({
    getUserAPI : '/engagement/user/list',
    getLOBAPI : '/jobAdv/jobProfile/lob',
    jobAdvUserSearch: '/jobAdv/user/search',
    addNewUserAPI : '/engagement/user/add',
    delUserAPI : '/engagement/user/del',
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