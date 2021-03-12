interface IGroupController {
    create: (req: any, res: any) => void;
    delete: (req: any, res: any) => void;
    update: (req: any, res: any) => void;
    getByUserId: (req: any, res: any) => void;
    getById: (req: any, res: any) => void;
    getMyWords: (req: any, res: any) => void;
}

export default IGroupController;
