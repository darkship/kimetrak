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
        const a: HTMLElement = document.createElement("a");
        a.innerText = item.hostname;
        a.setAttribute("href", `${item.protocol}://${item.hostname}`);
        a.setAttribute("target", "_blank");

        const li: HTMLElement = document.createElement("li");
        li.appendChild(a);
        this.node.appendChild(li);

        return this;
    }

    public reset(): void {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
    }
}
