import { addMoreDetailsButton } from "./libs/add_more_details_button";
import { getInfosFromBG } from "./libs/get_infos_from_background";
import { Head } from "./libs/head";
import { List } from "./libs/list";

// tslint:disable-next-line
declare const browser: any;

const listTrackersHead: Head = new Head("listTrackersHead");
const listTrackers: List = new List("listTrackers");
const eventListener: HTMLElement = document.getElementById("header");
eventListener.addEventListener("click", () => (window.open("http://www.kimetrak.fr")), false);

addMoreDetailsButton("moreDetails");
getInfosFromBG(listTrackers, listTrackersHead);

browser.runtime.onMessage.addListener(() => {
    getInfosFromBG(listTrackers, listTrackersHead);
});
