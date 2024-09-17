import { APIResult, User } from '../Common/Models'
import { RepoBase } from './RepoBase'

export class UserRepo extends RepoBase {
    static async GetUsers(): Promise<APIResult<User[]>> {
        const response = await fetch(this.GetBaseURL(), this.GetBasicFetchParams('GET'));

        return await this.CleanResponse(response);
    }

    protected static GetBaseURL(): string {
        return super.GetBaseURL().concat('user/');
    }   

}