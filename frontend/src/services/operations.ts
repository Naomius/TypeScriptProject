import config from "../../config/config";
import {Auth} from "./auth";


export class Operations {
    public static refreshTokenKey = 'refreshToken';
    public static refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);


    static async getOperations(period: number | string | undefined, dateFrom: number | string | undefined, dateTo: number | string | undefined) {
        if (this.refreshToken) {
            if (dateFrom && dateTo && period) {
                const response = await fetch(config.host + '/operations' + '?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': this.refreshToken,
                    },
                });
                if (response && response.status === 200) {
                    const result = await response.json()
                    if (result && !result.error) {
                        return result;
                    }
                }
            } else if (period) {
                const response = await fetch(config.host + '/operations' + '?period=' + period, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': this.refreshToken,
                    },
                });
                if (response && response.status === 200) {
                    const result = await response.json()
                    if (result && !result.error) {
                        return result;
                    }
                }
            }

        }
    }

}