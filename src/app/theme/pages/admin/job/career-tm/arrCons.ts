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