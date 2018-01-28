export enum EMessage {
    update,
    thirdPartyRequests,
    tabRequests,
}

export interface IThirdParty {
    fullUrl: string;
    hostname: string;
    iframe: boolean;
    ip: string;
    pathname: string;
    protocol: string;
    secure: boolean;
    timeStamp: number;
    type: string;
    url: string;
}

export interface IDomain {
    count: number;
    hostname: string;
    requests: [IThirdParty];
    thirdPartyHostnames: [[string]];
}

export interface IthirdPartyRequests {
    domains: [IDomain];
    sharedThirdPartysCount: number;
    totalThirdPartyResquestCount: number;
    uniqueThirdPartysCount: number;
}
