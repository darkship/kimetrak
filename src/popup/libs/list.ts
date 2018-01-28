export interface IthirdPartyItem {
    hostname: string;
    protocol: string;
}

export class List {
    private node: HTMLElement;

    public constructor(listId: string) {
        this.node = document.getElementById(listId);
    }

    public addItem(item: IthirdPartyItem): List {
        const li: HTMLElement = document.createElement("li");
        li.innerText = item.hostname;
        li.onclick = (e: Event): void => {
            window.open(`${item.protocol}//${item.hostname}`);
        };
        this.node.appendChild(li);

        return this;
    }

    public reset(): void {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
    }
}
