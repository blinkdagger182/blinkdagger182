export class talentArr {
    req: talentSubdArr;
}

export class talentSubdArr {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}