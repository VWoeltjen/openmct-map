export default class TraverseView {
    constructor(domainObject, map) {
        this.domainObject = domainObject;
        this.map = map;

        this.map.image("data/ldem.png", -47, 88, -48, 87);
        this.map.traverse("data/plan.kml");
    }

    show(element) {
        var div = document.createElement('div');
        element.appendChild(div);
        this.map.show(div);
    }

    destroy() {
        this.map.destroy();
    }
}