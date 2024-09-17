import { RepoBase } from './RepoBase';
import { APIResult, LoginCredentials, User } from '../Common/Models'


export class AuthenticationRepo extends RepoBase {
    static async Login(loginInfo: LoginCredentials): Promise<APIResult<AuthenticationResponse>> {
       
        const response = await fetch(this.GetBaseURL().concat('login'),
            {
                ...this.GetBasicFetchParams('POST'),
                body: JSON.stringify(loginInfo)
            });

        return await this.CleanResponse(response);
    }

    static async Logout(): Promise<APIResult<any>> {
        const response = await fetch(this.GetBaseURL().concat('logout'),
            {
                ...this.GetBasicFetchParams('GET')
            });

        return await this.CleanResponse(response);
    }

    protected static GetBaseURL(): string {
        return super.GetBaseURL().concat('authentication/');
    }
}

export class AuthenticationResponse {
    User: User = null!;
    Token: string = '';
}
