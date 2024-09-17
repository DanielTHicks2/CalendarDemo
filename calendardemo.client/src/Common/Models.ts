
export { User }
export { LoginCredentials }

export { CalendarEvent }
export { CalendarSearchParams }
export { APIResult }

class APIResult<T> {
    status: number = 0;
    statusText: string = '';
    data: T = null!;
}

class ModelBase {
    Errors: Record<string, boolean> = {};
}

class User extends ModelBase {
    UserId?: number;
    UserName: string = '';
    FirstName: string = '';
    LastName: string = '';
}

class LoginCredentials extends ModelBase {
    Username: string = '';
    Password: string = '';
}

class CalendarEvent extends ModelBase {
    EventID: number = 0;
    EventOwnerID: number = 0;
    Title: string = '';
    Description: string = '';
    EventStartDateTime: string = '';
    EventEndDateTime: string = '';
    EventOwnerFirstName: string = '';
    EventOwnerLastName: string = '';
}

class CalendarSearchParams extends ModelBase {
    EventOwnerID?: number;
    Title: string  = '';
    StartDateTime: string = '';
    EndDateTime: string = '';
}









