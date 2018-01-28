// tslint:disable-next-line
declare const browser: any;

export interface Itab {
        active: boolean;
        id: number;
        url: string;
}

export const currentTab: () => Itab = async (): Itab => {
        const tabs: [Itab] = await browser.tabs.query({active: true, currentWindow: true});

        return tabs[0];
};
