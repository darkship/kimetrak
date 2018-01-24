// tslint:disable-next-line
declare const browser: any;

export class Head {
    private node: HTMLElement;

    public constructor(headerId: string) {
        this.node = document.getElementById(headerId);
    }
    public setText(i18nKey: string, options: [string | number] = []): void {
        this.node.innerText = browser.i18n.getMessage(i18nKey, options);
    }
}
