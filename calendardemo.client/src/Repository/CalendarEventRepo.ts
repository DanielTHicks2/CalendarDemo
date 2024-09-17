import { RepoBase } from './RepoBase';
import { APIResult, CalendarSearchParams, CalendarEvent } from '../Common/Models'


export class CalendarEventRepo extends RepoBase {
    static async SearchCalendar(searchParams: CalendarSearchParams): Promise<APIResult<CalendarEvent[]>> {

        const response = await fetch(this.GetBaseURL().concat('Search'),
            {
                ...this.GetBasicFetchParams('POST'),
                body: JSON.stringify(searchParams)
            });

        return await this.CleanResponse(response);

    }

    static async EditCalendarEvent(event: CalendarEvent) {
        const response = await fetch(this.GetBaseURL().concat(String(event.EventID)),
            {
                ...this.GetBasicFetchParams('PUT'),
                body: JSON.stringify(event)
            });

        return await this.CleanResponse(response);
    }

    static async AddCalendarEvent(event: CalendarEvent) {
        const response = await fetch(CalendarEventRepo.GetBaseURL(),
            {
                ...this.GetBasicFetchParams('POST'),
                body: JSON.stringify(event)
            });

        return await this.CleanResponse(response);
    }


    static async DeleteCalendarEvent(eventId: number): Promise<APIResult<boolean>> {

        const response = await fetch(this.GetBaseURL().concat(String(eventId)),
                                        this.GetBasicFetchParams('DELETE'));

        return await this.CleanResponse(response);
    }

    protected static GetBaseURL(): string {
        return super.GetBaseURL().concat('CalendarEvent/');
    }
}
