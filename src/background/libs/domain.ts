import { IDomain, IThirdParty } from "../../common/messages";
import { ThirdParty } from "./thirdParty";

const mainHostNameRegex: RegExp = new RegExp(/[a-z\-_0-9]+\.[a-z]+$/);
const cdnRegex: RegExp = new RegExp(/[cdn]\.[a-z]+$/);

export class Domain {
    public static getMainHostName(hostname: string): string {
        return mainHostNameRegex.exec(hostname)[0];
    }

    public thirdPartyHostnames: Map = new Map();
    private hostname: string;
    private mainHostName: string;
    private thirdPartys: Map = new Map();

    public constructor(hostname: string) {
        this.hostname = hostname;
        this.mainHostName = Domain.getMainHostName(hostname);
    }

    public addThirdParty(request): ThirdParty {
        if (this.isThirdPartyDomain(request)) {
            const thirdParty: ThirdParty = new ThirdParty(request);
            if (!cdnRegex.exec(thirdParty.data.hostname)) {
                this.thirdPartyHostnames.set(thirdParty.data.hostname, thirdParty.data.protocol);
                this.thirdPartys.set(thirdParty.key, thirdParty);

                return thirdParty;
            }
        }
    }

    public toJson(): IDomain {
        const requests: [IThirdParty] = Array.from(this.thirdPartys.values())
            .map((r: ThirdParty): IThirdParty => r.toJson())
            .sort((r: IThirdParty): number => (r.hostname));

        const thirdPartyHostnames: [[string]] = Array.from(this.thirdPartyHostnames.entries())
            .sort((r: [[string]]): number => (r[0]));

        return {
            count: thirdPartyHostnames.length,
            hostname: this.hostname,
            requests,
            thirdPartyHostnames,
        };
    }

    private isThirdPartyDomain(request): boolean {
        return !cdnRegex.exec(request.url) && request.url.indexOf(this.mainHostName) === -1;
    }
}
