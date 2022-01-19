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

export class ComCluster {
    comClus: comClusterArr;
}

export class comClusterArr {
    constructor(id: number, name: string) {
        this.id = id;
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