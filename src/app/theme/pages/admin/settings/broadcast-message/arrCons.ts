export class StaffId {
    req: StaffIdArr;
}

export class StaffIdArr {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    id: string;
    name: string;
}
