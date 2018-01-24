import { Head } from "./head";
import { List } from "./list";

// tslint:disable-next-line
declare const browser: any;

export const getInfosFromBG: (listTrackers: List, listTrackersHead: Head) => void =
    async (listTrackers: List, listTrackersHead: Head): void => {
    try {
        const infos = await browser.runtime.sendMessage({action: "thisTabRequests"});
        listTrackers.reset();
        if (infos && infos.count > 0) {
            const textPlural: string = infos.count > 1 ? "s" : "";
            document.createTextNode(browser.i18n.getMessage("getMoreStats"));
            listTrackersHead.setText("popupTitle", [infos.count, textPlural, infos.hostname]);
            infos.thirdPartysHostnames.forEach((hostname: string) => {
                listTrackers.addItem({hostname, protocol: ""});
            });
        } else {
            listTrackersHead.setText("popupTitleNone");
        }
    } catch (e) {
        // Console.error(e);
    }
};
