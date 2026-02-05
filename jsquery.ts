export const { $, JSQuery } = (() => {
    class ElementArray extends Array<Element> {
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
        checked(val?: boolean): this | boolean[] {
            if (val) {
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
            this.forEach((v) => temp.push(v.new()));
            return temp;
        }
        //events
        click(func: (this:HTMLElement, ev: any) => any, s: boolean | AddEventListenerOptions) {
            this.forEach((v) => v.click(func, s));
            return this;
        }
    }

    function toArray(elt: NodeList | HTMLCollection | HTMLElement) {
        return elt instanceof NodeList || elt instanceof HTMLCollection;
    }

    class Element {
        elt: HTMLElement;
        #TriggerEvent(e: any, func: (this:HTMLElement, ev: any) => any, s: boolean | AddEventListenerOptions) {
            if (!func) {
                this.trigger(e);
                return;
            }
            this.on(e, func, s);
        }
        static from(elt: HTMLElement | NodeList | HTMLCollection) {
            if (elt == null) {
                return null;
            }
            if (toArray(elt)) {
                return ElementArray.from(elt).map((v) => new this(v as HTMLElement));
            }
            return new this(elt);
        }
        new() {
            return Element.from(this.elt);
        }
        constructor(elt:HTMLElement) {
            this.elt = elt;
        }
        on(e: any, func: (this:HTMLElement, ev: any) => any, s: boolean | AddEventListenerOptions) {
            this.elt.addEventListener(e, func, s);
            return this;
        }
        removeEvent(e: any, func: (this:HTMLElement, ev: any) => any, s: boolean | AddEventListenerOptions) {
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
        id(val: string | undefined): string | this {
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
        $(q: any) {
            return J.from(this.elt.querySelector(q));
        }
        all(q: any) {
            return J.from(this.elt.querySelectorAll(q));
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
        html(val?:string): string|this {
            if (val == undefined) return this.elt.innerHTML;
            this.elt.innerHTML = val;
            return this;
        }
        text(val?: string): string | this {
            if (val == undefined) return this.elt.textContent;
            this.elt.textContent = val;
            return this;
        }
        rect() {
            return this.elt.getBoundingClientRect().toJSON();
        }
        value(val?: string | undefined): string | this {
            if (val == undefined) return this.getProp("value");
            this.props({value: val});
            return this;
        }
        checked(val?: boolean): boolean| this {
            if (val == undefined) return this.getProp("checked") !== null;
            this.props({checked: val? "": null});
            return this;
        }
        //events
        click(func: (this:HTMLElement, ev: any) => any, s: boolean | AddEventListenerOptions) {
            this.#TriggerEvent("click", func, s);
            return this;
        }
    }

    function toElt(elt: Element): HTMLElement {
        if (elt instanceof Element) return elt.elt;
        return elt;
    }

    class Extension {
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

    function J(q: any) {
        return Element.from(document.querySelector(q));
    }

    J.from = (elt: HTMLElement | NodeList | HTMLCollection) => {
        return Element.from(elt);
    };

    J.all = (q: any) => {
        return Element.from(document.querySelectorAll(q));
    };

    let head: Element;
    J.head = () => {
        if (!head) head = Element.from(document.head) as Element;
        return head;
    };

    let body: Element;
    J.body = () => {
        if (!body) body = Element.from(document.body) as Element;
        return body;
    };

    let doc: Element;
    J.doc = () => {
        if (!doc) doc = Element.from(document as any) as Element;
        return doc;
    };

    J.create = (t: any) => {
        return Element.from(document.createElement(t));
    };

    const JSQuery = {
        Element,
        ElementArray,
        Extension,
        Plugin: Extension,
        Caching: class Caching extends Extension {
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
        },
    };

    J.loadExtension = (extend: new()=>Extension) => {
        if (Object.getPrototypeOf(extend) !== Extension) {
            throw new Error(
                "the class is not a child of JSQuery.Extension or the inputed class is an instance"
            );
        }
        body = undefined;
        head = undefined;
        const items = new extend().get();
        Object.assign(J, items.$);
        Object.assign(JSQuery, items.JSQuery);
        Object.assign(Element.prototype, items.Element);
        Object.assign(ElementArray.prototype, items.ElementArray);
        Object.assign(Element, items.static_Element);
        Object.assign(ElementArray, items.static_ElementArray);
    }

    J.loadPlugin = J.loadExtension;

    return { $: J, JSQuery };
})();
