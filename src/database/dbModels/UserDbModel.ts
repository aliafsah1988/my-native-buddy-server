import IUserDbModel from './IUserDbModel';

class UserDbModel implements IUserDbModel {
    public readonly persistedAt: number;
    public readonly updatedAt: number;
    private email: string;
    private password: string;
    private role: string;
    private active: string;
    private firstName: string;
    private lastName: string;
    private phone_number: string;
    private location: string;
    private birth_date: number;
    private _id: any;

    constructor(_id: object,
                email: string,
                password: string,
                role: string,
                active: string,
                firstName: string,
                lastName: string,
                phone_number: string,
                location: string,
                birth_date: number,
                persistedAt: number,
                updatedAt: number) {
        if (_id) { this._id = _id; }
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone_number = phone_number;
        this.location = location;
        this.birth_date = birth_date;
        this.persistedAt = persistedAt;
        this.updatedAt = updatedAt;
    }

    public get Email(): string {
        return this.email;
    }

    public get Password(): string {
        return this.password;
    }

    public get Role(): string {
        return this.role;
    }

    public get Active(): string {
        return this.active;
    }

    public get FirstName(): string {
        return this.firstName;
    }

    public get LastName(): string {
        return this.lastName;
    }

    public get Phone_number(): string {
        return this.phone_number;
    }

    public get Location(): string {
        return this.location;
    }

    public get Birth_date(): number {
        return this.birth_date;
    }

    public get id(): object {
        return this._id;
    }
}

export default UserDbModel;
