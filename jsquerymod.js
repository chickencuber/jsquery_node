var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Element_instances, _Element_TriggerEvent;
function toArray(elt) {
    return elt instanceof NodeList || elt instanceof HTMLCollection;
}
function toElt(elt) {
    if (elt instanceof Element)
        return elt.elt;
    return elt;
}
export class Extension {
    constructor() {
        if (this.constructor === Extension) {
            throw new Error("you can't make an instance of class: JSQuery.Extension");
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
    static from(elt) {
        if (elt == null) {
            return null;
        }
        if (toArray(elt)) {
            return ElementArray.from(elt).map((v) => new this(v));
        }
        return new this(elt);
    }
    new() {
        return Element.from(this.elt);
    }
    constructor(elt) {
        _Element_instances.add(this);
        this.elt = elt;
    }
    on(e, func, s) {
        this.elt.addEventListener(e, func, s);
        return this;
    }
    removeEvent(e, func, s) {
        this.elt.removeEventListener(e, func, s);
        return this;
    }
    trigger(e) {
        this.elt[e]();
        return this;
    }
    css(styles) {
        for (const [name, val] of Object.entries(styles)) {
            this.elt.style[name] = val;
        }
        return this;
    }
    getCss(style) {
        return this.elt.style[style];
    }
    props(props) {
        for (const [name, val] of Object.entries(props)) {
            if (val === null) {
                this.elt.removeAttribute(name);
            }
            else {
                this.elt.setAttribute(name, val);
            }
        }
        return this;
    }
    getProp(name) {
        return this.elt.getAttribute(name);
    }
    id(val) {
        if (val == undefined)
            return this.getProp("id");
        this.props({ id: val });
        return this;
    }
    class(names) {
        if (Array.isArray(names)) {
            names.forEach((name) => this.elt.classList.add(name));
        }
        else {
            this.elt.classList.add(names);
        }
        return this;
    }
    removeClass(names) {
        if (Array.isArray(names)) {
            names.forEach((name) => this.elt.classList.remove(name));
        }
        else {
            this.elt.classList.remove(names);
        }
        return this;
    }
    toggleClass(names) {
        if (Array.isArray(names)) {
            names.forEach((name) => this.elt.classList.toggle(name));
        }
        else {
            this.elt.classList.toggle(names);
        }
        return this;
    }
    hasClass(name) {
        return this.elt.classList.contains(name);
    }
    $(q) {
        return Element.from(this.elt.querySelector(q));
    }
    all(q) {
        return Element.from(this.elt.querySelectorAll(q));
    }
    is(q) {
        return this.elt.matches(q);
    }
    child(children) {
        if (Array.isArray(children)) {
            children.forEach((child) => this.elt.appendChild(toElt(child)));
        }
        else {
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
    html(val) {
        if (val == undefined)
            return this.elt.innerHTML;
        this.elt.innerHTML = val;
        return this;
    }
    text(val) {
        if (val == undefined)
            return this.elt.textContent;
        this.elt.textContent = val;
        return this;
    }
    rect() {
        return this.elt.getBoundingClientRect().toJSON();
    }
    value(val) {
        if (val == undefined)
            return this.elt.value;
        this.elt.value = val;
        return this;
    }
    checked(val) {
        if (val == undefined)
            return this.elt.checked;
        this.elt.checked = val;
        return this;
    }
    //events
    click(func, s) {
        __classPrivateFieldGet(this, _Element_instances, "m", _Element_TriggerEvent).call(this, "click", func, s);
        return this;
    }
}
_Element_instances = new WeakSet(), _Element_TriggerEvent = function _Element_TriggerEvent(e, func, s) {
    if (!func) {
        this.trigger(e);
        return;
    }
    this.on(e, func, s);
};
export class Caching extends Extension {
    $() {
        return {
            cache(func) {
                const f = (...args) => {
                    const val = JSON.stringify(args);
                    if (f.cache.hasOwnProperty(val)) {
                        return f.cache[val];
                    }
                    const temp = func(...args);
                    f.cache[val] = temp;
                    return temp;
                };
                f.cache = {};
                return f;
            },
        };
    }
}
export class ElementArray extends Array {
    on(e, func, s) {
        this.forEach((v) => v.on(e, func, s));
        return this;
    }
    rect() {
        return this.map((v) => v.rect());
    }
    hasClass(c) {
        return this.map((v) => v.hasClass(c));
    }
    is(q) {
        return this.map((v) => v.is(q));
    }
    checked(val) {
        if (val !== undefined) {
            this.forEach((v) => v.checked(val));
            return this;
        }
        return this.map((v) => v.checked());
    }
    trigger(e) {
        this.forEach((v) => v.trigger(e));
        return this;
    }
    css(styles) {
        this.forEach((v) => v.css(styles));
        return this;
    }
    props(props) {
        this.forEach((v) => v.props(props));
        return this;
    }
    class(names) {
        this.forEach((v) => v.class(names));
        return this;
    }
    removeClass(names) {
        this.forEach((v) => v.removeClass(names));
        return this;
    }
    toggleClass(names) {
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
    click(func, s) {
        this.forEach((v) => v.click(func, s));
        return this;
    }
}
export const Plugin = Extension;
