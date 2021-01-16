import IGroupDbModel from './IGroupDbModel';

class GroupDbModel implements IGroupDbModel {
    public readonly persistedAt: number;
    public readonly updatedAt: number;
    private name: string;
    private description: string;
    private userId: object;
    private langId: object;
    private _id: any;

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

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }

    public get UserId(): object {
        return this.userId;
    }

    public get LangId(): object {
        return this.langId;
    }

    public get id(): object {
        return this._id;
    }
}

export default GroupDbModel;
