import { LocalStorageUtils } from '../Common/Utils';
import { Constants } from '../Common/Constants'
import { APIResult } from '../Common/Models';


export class RepoBase {

    protected static async CleanResponse(response: Response) {
        let completeResponse: APIResult<any> = { status: response.status, statusText: response.statusText, data: null };
        if (response.status == 200) {
            const resp = await response.json();
            completeResponse = { ...completeResponse, data: resp };
        }

        return completeResponse;
    }

    protected static GetJsonHeader() {
        const storedToken = LocalStorageUtils.GetItem(Constants.AuthenticationToken);

        let basicHeader = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (!!storedToken && storedToken.Token?.length > 0) {
            return { ...basicHeader, 'Authorization': 'Bearer '.concat(storedToken.Token!) }
        }
        else {
            return basicHeader;
        }
    }

    protected static GetBasicFetchParams(method: string) {

        return {
            method: method,
            headers: this.GetJsonHeader()
        };
    }

    protected static GetBaseURL(): string {
        return 'api/'
    }   

}