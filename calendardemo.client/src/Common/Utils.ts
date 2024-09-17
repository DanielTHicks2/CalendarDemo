
export class LocalStorageUtils {
    static GetItem(name: string): any {
        return JSON.parse(localStorage.getItem(name)!);
    }

    static SetItem(name: string, value: any): void{
        localStorage.setItem(name, value);
    }

}
export class DateUtils {

    static FormatDate(dateToFormat: string): string {

        if (!this.IsValidDate(dateToFormat)) {
            return dateToFormat;
        }

        const dt = new Date(dateToFormat);

        return `${dt.getFullYear()}-${(this.FormatDateTimePart(dt.getMonth() + 1))}-${this.FormatDateTimePart(dt.getDate())}`;
    }

    static FormatDateTimeFromParts(date: string, time: string): string {

        return date.concat(' ').concat(time);
    }
     
    static FormatTime(dtTmToFormat: string): string {

        if (!this.IsValidDate(dtTmToFormat)) {
            return '';
        }

        const dt = new Date(dtTmToFormat);

        return `${this.FormatDateTimePart(dt.getHours())}:${(this.FormatDateTimePart(dt.getMinutes()))}`;
    }

    static FormatDateTimePart(part: number): string {
        return String(part).padStart(2, '0');
    }

    static IsValidDate(date: string): boolean {
        return !isNaN(new Date(date).getTime());
    }

    static DateGreaterOrEqual(referenceDate: string, dateToValidate: string): boolean {
        if (this.IsValidDate(dateToValidate)) {
            if (!this.IsValidDate(referenceDate)) {
                return true;
            }
            else {
                return new Date(dateToValidate).getTime() >= new Date(referenceDate).getTime();
            }
        }

        return true;
    }

}


