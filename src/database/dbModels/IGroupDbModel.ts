import IBaseModel from './IBaseModel';

interface IGroupDbModel extends IBaseModel {
    Name: string;
    Description: string;
    UserId: object;
    LangId: object; // default language
}

export default IGroupDbModel;
