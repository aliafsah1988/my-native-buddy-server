import IBaseModel from './IBaseModel';

interface IGroupDbModel extends IBaseModel {
    name: string;
    description: string;
    userId: object;
    langId: object; // default language
}

export default IGroupDbModel;
