export * as JSQuery from "./jsquerymod.js";
import * as JSQuery from "./jsquerymod.js";

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

