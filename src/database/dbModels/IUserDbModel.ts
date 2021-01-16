import IBaseModel from './IBaseModel';

interface IUserDbModel extends IBaseModel {
    Email: string;
    Password: string;
    Role: string;
    Active: string;
    FirstName: string;
    LastName: string;
    Phone_number: string;
    Location: string;
    Birth_date: number;
}

export default IUserDbModel;
