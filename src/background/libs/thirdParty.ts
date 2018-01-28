import { IThirdParty } from "../../common/messages";

export class ThirdParty {
    public static extractDataFromRequest(request): IThirdParty {
        const requestURL: URL = new URL(request.url);

        return {
            fullUrl: request.url,
            hostname: requestURL.hostname,
            iframe: (request.frameId > 0),
            ip: request.ip,
            pathname: requestURL.pathname,
            protocol: requestURL.protocol,
            secure: (requestURL.protocol === "https:"),
            timeStamp: request.timeStamp,
            type: request.type,
            url: `${requestURL.protocol}//${requestURL.hostname}${requestURL.pathname}`,
        };
    }

    public data: IThirdParty;

    public constructor(request) {
        this.data = ThirdParty.extractDataFromRequest(request);
    }

    public get key(): string {
        return this.data.fullUrl;
    }

    public toJson(): IThirdParty {
        return {
            ...this.data,
        };
    }
}
