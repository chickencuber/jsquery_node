export namespace JSQuery {
    function toArray(elt: NodeList | HTMLCollection | HTMLElement) {
        return elt instanceof NodeList || elt instanceof HTMLCollection;
    }
    function toElt(elt: Element): HTMLElement {
        if (elt instanceof Element) return elt.elt;
        return elt;
    }
    export class Extension {
        constructor() {
            if (this.constructor === Extension) {
                throw new Error(
                    "you can't make an instance of class: JSQuery.Extension"
                );
            }
        }
        get() {
            return {
                $: this.$(),
                Element: this.Element(),
                static_Element: this.static_Element(),
                static_ElementArray: this.static_ElementArray(),
                ElementArray: this.ElementArray(),
                JSQuery: this.JSQuery(),
            };
        }
        $() {
            return {};
        }
        Element() {
            return {};
        }
        ElementArray() {
            return {};
        }

        static_Element() {
            return {};
        }
        static_ElementArray() {
            return {};
        }

        JSQuery() {
            return {};
        }
    }
    export class Element {
        elt: HTMLElement;
        #TriggerEvent(e: any, func: (this:HTMLElement, ev: any) => any, s?: boolean | AddEventListenerOptions) {
            if (!func) {
                this.trigger(e);
                return;
            }
            this.on(e, func, s);
        }
        static from(elt: HTMLElement): Element|null;
        static from(elt: NodeList|HTMLCollection): ElementArray;
        static from(elt: HTMLElement | NodeList | HTMLCollection): Element | ElementArray | null {
            if (elt == null) {
                return null;
            }
            if (toArray(elt)) {
                return ElementArray.from(elt).map((v) => new this(v as HTMLElement)) as ElementArray;
            }
            return new this(elt);
        }
        new() {
            return Element.from(this.elt);
        }
        constructor(elt:HTMLElement) {
            this.elt = elt;
        }
        on(e: any, func: (this:HTMLElement, ev: any) => any, s?: boolean | AddEventListenerOptions) {
            this.elt.addEventListener(e, func, s);
            return this;
        }
        removeEvent(e: any, func: (this:HTMLElement, ev: any) => any, s?: boolean | AddEventListenerOptions) {
            this.elt.removeEventListener(e, func, s);
            return this;
        }
        trigger(e: any) {
            this.elt[e]();
            return this;
        }
        css(styles: Record<string, any>) {
            for (const [name, val] of Object.entries(styles)) {
                this.elt.style[name] = val;
            }
            return this;
        }
        getCss(style: string) {
            return this.elt.style[style];
        }
        props(props: Record<string, any>) {
            for (const [name, val] of Object.entries(props)) {
                if(val === null) {
                    this.elt.removeAttribute(name);
                } else {
                    this.elt.setAttribute(name, val);
                }
            }
            return this;
        }
        getProp(name: string) {
            return this.elt.getAttribute(name);
        }
        id(): string;
        id(val: string): this;
        id(val?: string): string | this {
            if (val == undefined) return this.getProp("id");
            this.props({ id: val });
            return this;
        }
        class(names: string | string[]) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.add(name));
            } else {
                this.elt.classList.add(names);
            }
            return this;
        }
        removeClass(names: string | string[]) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.remove(name));
            } else {
                this.elt.classList.remove(names);
            }
            return this;
        }
        toggleClass(names: string | string[]) {
            if (Array.isArray(names)) {
                names.forEach((name) => this.elt.classList.toggle(name));
            } else {
                this.elt.classList.toggle(names);
            }
            return this;
        }
        hasClass(name: string) {
            return this.elt.classList.contains(name);
        }
        $(q: any): Element|null {
            return J.from(this.elt.querySelector(q)) as any;
        }
        all(q: any): ElementArray {
            return J.from(this.elt.querySelectorAll(q)) as any;
        }
        is(q:string) {
            return this.elt.matches(q);
        }
        child(children: Element|Element[]) {
            if (Array.isArray(children)) {
                children.forEach((child:Element) => this.elt.appendChild(toElt(child)));
            } else {
                this.elt.appendChild(toElt(children));
            }
            return this;
        }
        remove() {
            this.elt.remove();
            return this;
        }
        get children() {
            return Element.from(this.elt.children);
        }
        html(): string;
        html(val: string): this;
        html(val?:string): string|this {
            if (val == undefined) return this.elt.innerHTML;
            this.elt.innerHTML = val;
            return this;
        }
        text(): string;
        text(val: string): this;
        text(val?: string): string | this {
            if (val == undefined) return this.elt.textContent;
            this.elt.textContent = val;
            return this;
        }
        rect() {
            return this.elt.getBoundingClientRect().toJSON();
        }
        value(): string;
        value(val: string): this;
        value(val?: string): string | this {
            if (val == undefined) return (this.elt as any).value;
            (this.elt as any).value = val;
            return this;
        }
        checked(): boolean;
        checked(val: boolean): this;
        checked(val?: boolean): boolean| this {
            if (val == undefined) return (this.elt as any).checked;
            (this.elt as any).checked = val;
            return this;
        }
        //events
        click(func?: (this:HTMLElement, ev: any) => any, s?: boolean | AddEventListenerOptions) {
            this.#TriggerEvent("click", func, s);
            return this;
        }
    }
    export class Caching extends Extension {
        $() {
            return {
                cache<T extends (...args:any[])=>any>(func: T): T {
                    const f = (...args: Parameters<T>): ReturnType<T> => {
                        const val = JSON.stringify(args);
                        if (f.cache.hasOwnProperty(val)) {
                            return f.cache[val];
                        }
                        const temp = func(...args);
                        f.cache[val] = temp;
                        return temp;
                    };
                    f.cache = {};
                    return f as any;
                },
            };
        }
    }
    export class ElementArray extends Array<Element> {
        on<K extends keyof DocumentEventMap>(e: K, func: (this: HTMLElement, ev: DocumentEventMap[K])=>any, s?: boolean | AddEventListenerOptions) {
            this.forEach((v) => v.on(e, func, s));
            return this;
        }
        rect() {
            return this.map((v) => v.rect());
        }
        hasClass(c:string) {
            return this.map((v) => v.hasClass(c));
        }
        is(q:string) {
            return this.map((v) => v.is(q));
        }
        checked(): boolean[];
        checked(val: boolean): this;
        checked(val?: boolean): this | boolean[] {
            if (val !== undefined) {
                this.forEach((v) => v.checked(val));
                return this;
            }
            return this.map((v) => v.checked()) as any;
        }
        trigger(e: any) {
            this.forEach((v) => v.trigger(e));
            return this;
        }
        css(styles: Record<string, any>) {
            this.forEach((v) => v.css(styles));
            return this;
        }
        props(props: Record<string, any>) {
            this.forEach((v) => v.props(props));
            return this;
        }
        class(names: string | string[]) {
            this.forEach((v) => v.class(names));
            return this;
        }
        removeClass(names: string | string[]) {
            this.forEach((v) => v.removeClass(names));
            return this;
        }
        toggleClass(names: string | string[]) {
            this.forEach((v) => v.toggleClass(names));
            return this;
        }
        remove() {
            this.forEach((v) => v.remove());
            return this;
        }
        new() {
            const temp = new ElementArray();
            this.forEach((v) => temp.push(v.new() as any));
            return temp;
        }
        //events
        click(func: (this:HTMLElement, ev: any) => any, s?: boolean | AddEventListenerOptions) {
            this.forEach((v) => v.click(func, s));
            return this;
        }
    }
    export const Plugin = Extension;
    export type Plugin = Extension;
}


function J(q: any): JSQuery.Element | null {
    return JSQuery.Element.from(document.querySelector(q)) as any;
};

J.from = ((elt:any) => {
    return JSQuery.Element.from(elt);
}) as typeof JSQuery.Element.from;

J.all = (q: any): JSQuery.ElementArray => {
    return JSQuery.Element.from(document.querySelectorAll(q)) as any;
};

let head: JSQuery.Element;
J.head = () => {
    if (!head) head = JSQuery.Element.from(document.head) as JSQuery.Element;
    return head;
};

let body: JSQuery.Element;
J.body = () => {
    if (!body) body = JSQuery.Element.from(document.body) as JSQuery.Element;
    return body;
};

let doc: JSQuery.Element;
J.doc = () => {
    if (!doc) doc = JSQuery.Element.from(document as any) as JSQuery.Element;
    return doc;
};

J.create = (t: any): JSQuery.Element => {
    return JSQuery.Element.from(document.createElement(t)) as any;
};

J.loadExtension = (extend: new()=>JSQuery.Extension) => {
    if (Object.getPrototypeOf(extend) !== JSQuery.Extension) {
        throw new Error(
            "the class is not a child of JSQuery.Extension or the inputed class is an instance"
        );
    }
    body = undefined;
    head = undefined;
    const items = new extend().get();
    Object.assign(J, items.$);
    Object.assign(JSQuery, items.JSQuery);
    Object.assign(JSQuery.Element.prototype, items.Element);
    Object.assign(JSQuery.ElementArray.prototype, items.ElementArray);
    Object.assign(JSQuery.Element, items.static_Element);
    Object.assign(JSQuery.ElementArray, items.static_ElementArray);
}

J.loadPlugin = J.loadExtension;
export const $ = J;

