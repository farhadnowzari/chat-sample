export default class User {

    constructor(userId: string) {
        const userIdParts = userId.split('|');
        this.name = userIdParts[0];
        this.id = userIdParts[1];
        this.completeId = userId;
    }
    completeId: string;
    id!: string;
    name!: string;

}