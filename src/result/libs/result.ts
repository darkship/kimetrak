import * as browser from "webextension-polyfill";
import { EMessage, IDomain, IThirdParty, IthirdPartyRequests } from "../../common/messages";

export class Result {
    private list: HTMLElement;
    private summary: HTMLElement;
    private title: HTMLElement;

    public start(): void {
        browser.runtime.sendMessage({action: EMessage.thirdPartyRequests})
            .then((data: IthirdPartyRequests) => {
                this.showSummary(data);
                this.showTitle(data);
                this.showList(data);
            });
    }
    private showList(data: IthirdPartyRequests): void {
        this.list = document.getElementById("listTrackers");
        data.domains.forEach((domain: IDomain): void => {
            const headerElement: HTMLElement = document.createElement("div");
            headerElement.innerText = `${domain.hostname} (${domain.requests.length})`;
            headerElement.classList.add("domain-header");

            const listElement: HTMLElement = document.createElement("div");
            listElement.classList.add("domain-list");
            listElement.classList.add("hidden");

            domain.requests.forEach((thirdParty: IThirdParty): void => {
                const el: HTMLElement = document.createElement("div");
                el.innerText = `${thirdParty.type} - ${thirdParty.hostname}`;
                el.classList.add("domain-thirdparty");
                el.onclick = (e: Event): void => {
                    window.open(thirdParty.fullUrl);
                };
                listElement.appendChild(el);
            });

            const domainElement: HTMLElement = document.createElement("div");
            domainElement.classList.add("domain");
            domainElement.appendChild(headerElement);
            domainElement.appendChild(listElement);
            domainElement.onclick = (e: Event): void => {
              listElement.classList.toggle("hidden");
            };

            this.list.appendChild(domainElement);
        });
    }

    private showSummary(data: IthirdPartyRequests): void {
        this.summary = document.getElementById("summary");
        this.summary.textContent = browser.i18n.getMessage("statsSummary", [
                data.totalThirdPartyResquestCount,
                data.uniqueThirdPartysCount,
                data.domains.length,
                data.sharedThirdPartysCount,
            ]);
    }

    private showTitle(data: IthirdPartyRequests): void {
        if (data.domains.length > 0) {
            this.title = document.getElementById("listTrackersHead");
            this.title.textContent = browser.i18n.getMessage("statsTitle");
        }
    }
}
