interface IDateHelper {
    today: () => any;
    now: () => any;
    addDays: (date: any, days: any) => any;
    toLocalDate: (date: any) => any;
}

export default IDateHelper;
