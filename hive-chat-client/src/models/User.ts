export default class User {

    constructor(connectionId: string) {
        const userIdParts = connectionId.split('|');
        this.name = userIdParts[0];
        this.id = userIdParts[1];
        this.connectionId = connectionId;
    }
    connectionId: string;
    id!: string;
    name!: string;

}