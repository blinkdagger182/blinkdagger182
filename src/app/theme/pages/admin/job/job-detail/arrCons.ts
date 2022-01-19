export class Qualification {
    qua: quaArr;
}

export class quaArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class FuncCluster {
    funcClus: funcClusterArr;
}

export class funcClusterArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class FuncFam {
    funcFam: funcFamArr;
}

export class funcFamArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class FuncFamDesc {
    funcFamDesc: funcFamDescArr;
}

export class funcFamDescArr {
    constructor(id: number, name: string, desc: string) {
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
    id: number;
    name: string;
    desc: string;
}



export class ComCluster {
    comClus: comClusterArr;
}

export class comClusterArr {
    // constructor(id: number, name: string) {
    constructor(name: string) {
        //this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class ComCat {
    comCat: comCatArr;
}

export class comCatArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class ComCom {
    comCom: comComArr;
}

export class comComArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}


export class ComLvl {
    comLvl: comLvlArr;
}

export class comLvlArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}

export class Requestor {
    req: reqArr;
}

export class reqArr {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    id: string;
    name: string;
}