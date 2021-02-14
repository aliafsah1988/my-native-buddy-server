import IGroupDbModel from './IGroupDbModel';

class GroupDbModel implements IGroupDbModel {
    public readonly persistedAt: number;
    public readonly updatedAt: number;
    public name: string;
    public description: string;
    public userId: object;
    public langId: object;
    public _id: any;

    constructor(_id: object,
                name: string,
                description: string,
                userId: object,
                langId: object,
                persistedAt: number,
                updatedAt: number) {
        if (_id) { this._id = _id; }
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.langId = langId;
        this.persistedAt = persistedAt;
        this.updatedAt = updatedAt;
    }
}

export default GroupDbModel;
