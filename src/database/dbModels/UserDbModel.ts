import IUserDbModel from './IUserDbModel';

class UserDbModel implements IUserDbModel {
    public readonly createDate: number;
    public readonly persistDate: number;
    public email: string;
    public password: string;
    public role: string;
    public active: boolean;
    public firstName: string;
    public lastName: string;
    public phone_number: string;
    public location: string;
    public birth_date: number;
    public _id: any;

    constructor(_id: object,
                email: string,
                password: string,
                role: string,
                active: boolean,
                firstName: string,
                lastName: string,
                phone_number: string,
                location: string,
                birth_date: number,
                createDate: number,
                persistDate: number) {
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
        this.createDate = createDate;
        this.persistDate = persistDate  ;
    }
}

export default UserDbModel;
