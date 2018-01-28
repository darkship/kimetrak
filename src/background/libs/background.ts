import * as browser from "webextension-polyfill";
import { EMessage, IDomain, IthirdPartyRequests } from "../../common/messages";
import { Domain } from "./domain";
import { currentTab, Itab } from "./tab";
import { ThirdParty } from "./thirdParty";

export class Background {
    private domains: Map = new Map();
    private greenLimit: number = 20;
    private orangeLimit: number = 50;
    private sharedThirdPartys: Map = new Map();
    private totalThirdPartyResquestCount: number = 0;

    public start(): void {
        browser.runtime.onMessage.addListener((msg: {action: EMessage}) => this.messageHandler(msg.action));
        browser.webRequest.onCompleted.addListener((request) => this.requestHandler(request), {urls: ["<all_urls>"]});
        browser.tabs.onActivated.addListener(() => this.tabChangeHandler());
    }

    private async messageHandler(action: EMessage): IDomain | IthirdPartyRequests {
        try {
            switch (action) {
                case EMessage.thirdPartyRequests:
                    return {
                        domains : Array.from(this.domains.values())
                            .map((d: Domain) => d.toJson()),
                        sharedThirdPartysCount: Array.from(this.sharedThirdPartys.values())
                            .reduce((t: number, c: Set) => (t + c.size > 1 ? 1 : 0), 0),
                        totalThirdPartyResquestCount: this.totalThirdPartyResquestCount,
                        uniqueThirdPartysCount: this.sharedThirdPartys.size,
                    };
                case EMessage.tabRequests:
                    const tabInfos: Itab = await currentTab();
                    const domain: Domain = this.domains.get(new URL(tabInfos.url).hostname);
                    if (domain) {
                        return domain.toJson();
                    } else {
                        // Console.log("no data send");
                    }
                    break;
                default:
            }
        } catch (e) {
            // Console.error(e)
        }
    }

    private async requestHandler(request): void {
        try {
            if (request.tabId < 1) {
                return;
            }
            const currentTabInfo: Itab = await currentTab();
            const tabinfo: Itab = await browser.tabs.get(request.tabId);

            if (!tabinfo.url.startsWith("http")) {
                return;
            }

            const hostname: string = new URL(tabinfo.url).hostname;
            let domain: Domain = this.domains.get(hostname);
            if (!domain) {
                domain = new Domain(hostname);
                this.domains.set(hostname, domain);
            }
            const thirdparty: ThirdParty = domain.addThirdParty(request);
            if (thirdparty) {
                this.totalThirdPartyResquestCount++;
                let sharedDomains: Set = this.sharedThirdPartys.get(thirdparty.key);
                if (!sharedDomains) {
                    sharedDomains = new Set();
                    this.sharedThirdPartys.set(thirdparty.key, sharedDomains);
                }
                sharedDomains.add(hostname);
            }

            if (currentTabInfo && tabinfo.id === currentTabInfo.id) {
                this.updateBadgeCountAndColor(domain.thirdPartyHostnames.size, true);
                browser.runtime.sendMessage({action: "Update"});
            }
        } catch (e) {
            //
        }
    }

    private async tabChangeHandler(): void {
        try {
            const currentTabInfo: Itab = await currentTab();
            const hostname: string = new URL(currentTabInfo.url).hostname;
            const domain: Domain = this.domains.get(hostname);
            if (domain) {
                this.updateBadgeCountAndColor(domain.thirdPartyHostnames.size, true);
            } else {
                this.updateBadgeCountAndColor(0, false);
            }
        } catch (e) {
            // Console.error(e);
        }
    }

    private updateBadgeCountAndColor(count: number, useColor: boolean): void {
        let color: string = "#9E9E9E";
        if (useColor) {
            if (count < this.greenLimit) {
                color = "green";
            } else if (count < this.orangeLimit) {
                color = "#E47F26";
            } else {
                color = "#A93226";
            }
        }
        browser.browserAction.setBadgeText({text: count.toString()});
        browser.browserAction.setBadgeBackgroundColor({color});
    }
}
