import IDateHelper from './IDateHelper';
import moment from 'moment';
import ILogger from 'services/ILogger';

class DateHelper implements IDateHelper {
    private readonly _logger: ILogger;

    constructor(logger: ILogger) {
        this._logger = logger;
    }

    public today(): any {
        try {
          return moment().utc().startOf('day').toDate();
        } catch (error) {
            this._logger.error(error);
          return undefined;
        }
    }

    public now(): any {
        try {
          return moment().utc().toDate();
        } catch (error) {
            this._logger.error(error);
          return undefined;
        }
    }

    public addDays(date: any, days: any): any {
        try {
          return moment(date).add(days, 'days').toDate();
        } catch (error) {
          return undefined;
        }
    }

    public toLocalDate(date: any): any {
        return date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
    }
}

export default DateHelper;
