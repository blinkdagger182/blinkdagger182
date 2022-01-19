export class recfriend {
    req: recFriendArr;
}

export class recFriendArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class allfriendArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class profileInfoArr {
    constructor(id: number,
        name: string,
        email: string,
        about_me: string,
        mobile: number,
        org: string,
        status: string,
        photo: string,
        mutualNo: string) {

        this.id = id;
        this.name = name;
        this.about_me = about_me;
        this.email = email;
        this.mobile = mobile;
        this.org = org;
        this.status = status;
        this.photo = photo;
        this.mutualNo = mutualNo;
    }
    id: number;
    name: string;
    email: string;
    mobile: number;
    org: string;
    status: string;
    photo: string;
    mutualNo: string;
    about_me: string;
}

export class skillArr {
    constructor(id: number, skillname: number) {
        this.id = id;
        this.skillname = skillname;
    }
    id: number;
    skillname: number;
}
