export * as JSQuery from "./jsquerymod.js";
import * as JSQuery from "./jsquerymod.js";
function J(q) {
    return JSQuery.Element.from(document.querySelector(q));
}
;
J.from = ((elt) => {
    return JSQuery.Element.from(elt);
});
J.all = (q) => {
    return JSQuery.Element.from(document.querySelectorAll(q));
};
let head;
J.head = () => {
    if (!head)
        head = JSQuery.Element.from(document.head);
    return head;
};
let body;
J.body = () => {
    if (!body)
        body = JSQuery.Element.from(document.body);
    return body;
};
let doc;
J.doc = () => {
    if (!doc)
        doc = JSQuery.Element.from(document);
    return doc;
};
J.create = (t) => {
    return JSQuery.Element.from(document.createElement(t));
};
J.loadExtension = (extend) => {
    if (Object.getPrototypeOf(extend) !== JSQuery.Extension) {
        throw new Error("the class is not a child of JSQuery.Extension or the inputed class is an instance");
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
};
J.loadPlugin = J.loadExtension;
export const $ = J;
