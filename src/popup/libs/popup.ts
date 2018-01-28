import * as browser from "webextension-polyfill";
import { EMessage, IDomain } from "../../common/messages";
import { Head } from "./head";
import { List } from "./list";

export class Popup {
    private static addMoreDetailsButton(id: string): void {
        const link: HTMLElement = document.getElementById(id)
            .getElementsByTagName("a")[0];
        link.innerText = browser.i18n.getMessage("getMoreStats");
        link.setAttribute("href", browser.runtime.getURL("html/showResults.html"));
    }

    private eventListener: HTMLElement = document.getElementById("header");
    private listTrackers: List = new List("listTrackers");
    private listTrackersHead: Head = new Head("listTrackersHead");

    public start(): void {
        Popup.addMoreDetailsButton("moreDetails");
        this.getInfosFromBG();
        this.eventListener.addEventListener("click", () => (window.open("http://www.kimetrak.fr")), false);
        browser.runtime.onMessage.addListener(() => {
            this.getInfosFromBG();
        });
    }

    private async getInfosFromBG(): void {
            try {
                const infos: IDomain = await browser.runtime.sendMessage({action: EMessage.tabRequests});
                this.listTrackers.reset();
                if (infos && infos.thirdPartyHostnames.length > 0) {
                    const textPlural: string = infos.count > 1 ? "s" : "";
                    document.createTextNode(browser.i18n.getMessage("getMoreStats"));
                    this.listTrackersHead.setText("popupTitle", [infos.count, textPlural, infos.hostname]);
                    infos.thirdPartyHostnames.forEach((data: [string, string]) => {
                        this.listTrackers.addItem({hostname: data[0], protocol: data[1]});
                    });
                } else {
                    this.listTrackersHead.setText("popupTitleNone");
                }
            } catch (e) {
                // Console.error(e);
            }
        }
}
