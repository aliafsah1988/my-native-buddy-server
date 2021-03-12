import IBaseModel from './IBaseModel';

interface IWordDbModel extends IBaseModel {
  text: string;
  description: string;
  synonyms: string;
  translation: string;
  nextpractice: number;
  correctcount: number;
  userId: object;
  groupId: object;
  langId: object;
}

export default IWordDbModel;
