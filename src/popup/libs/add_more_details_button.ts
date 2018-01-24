// tslint:disable-next-line
declare const browser: any;

export const addMoreDetailsButton: (id: string) => void = (id: string): void =>  {
    const link: HTMLElement = document.getElementById(id)
        .getElementsByTagName("a")[0];
    link.innerText = browser.i18n.getMessage("getMoreStats");
    link.setAttribute("href", browser.runtime.getURL("html/showResults.html"));
};
