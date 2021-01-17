import IBaseModel from './IBaseModel';

interface IWordDbModel extends IBaseModel {
  Text: string;
  Description: string;
  Synonyms: string;
  Translation: string;
  Nextpractice: number;
  Correctcount: number;
  UserId: object;
  GroupId: object;
  LangId: object;
}

export default IWordDbModel;
