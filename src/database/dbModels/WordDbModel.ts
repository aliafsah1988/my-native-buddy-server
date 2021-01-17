import IWordDbModel from './IWordDbModel';

class WordDbModel implements IWordDbModel {
    public readonly persistedAt: number;
    public readonly updatedAt: number;
    private text: string;
    private description: string;
    private synonyms: string;
    private translation: string;
    private nextpractice: number;
    private correctcount: number;
    private userId: object;
    private groupId: object;
    private langId: object;
    private _id: any;

    constructor(_id: object,
                text: string,
                description: string,
                synonyms: string,
                translation: string,
                nextpractice: number,
                correctcount: number,
                userId: object,
                groupId: object,
                langId: object,
                persistedAt: number,
                updatedAt: number) {
        if (_id) { this._id = _id; }
        this.text = text;
        this.description = description;
        this.synonyms = synonyms;
        this.translation = translation;
        this.nextpractice = nextpractice;
        this.correctcount = correctcount;
        this.userId = userId;
        this.groupId = groupId;
        this.langId = langId;
        this.persistedAt = persistedAt;
        this.updatedAt = updatedAt;
    }

    public get Text(): string {
        return this.text;
    }

    public get Description(): string {
        return this.description;
    }

    public get Synonyms(): string {
        return this.synonyms;
    }

    public get Translation(): string {
        return this.translation;
    }

    public get Nextpractice(): number {
        return this.nextpractice;
    }

    public get Correctcount(): number {
        return this.correctcount;
    }

    public get UserId(): object {
        return this.userId;
    }

    public get GroupId(): object {
        return this.groupId;
    }

    public get LangId(): object {
        return this.langId;
    }

    public get id(): object {
        return this._id;
    }
}

export default WordDbModel;
