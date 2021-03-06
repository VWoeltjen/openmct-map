import TelemetryGroup from './TelemetryGroup';

class Layer {
    constructor(openmct, options) {
        this.openmct = openmct;
        this.options = options;
    }

    destroy() {
    }
}

class ImageLayer extends Layer {
    show(map) {
        map.image(
            this.options.url,
            this.options.left,
            this.options.bottom,
            this.options.right,
            this.options.top
        );
    }
}

class TelemetryLayer extends Layer {
    constructor(openmct, options, ids, triggers) {
        super(openmct, options);
        this.telemetry = new TelemetryGroup(openmct, ids, triggers);
    }

    show(map) {
        let layer = this.layer(map);
        this.telemetry.on('reset', layer.reset.bind(layer));
        this.telemetry.on('add', layer.add.bind(layer));
        this.telemetry.activate();
    }

    layer(map) {
        throw new Error("Unimplemented.");
    }

    destroy() {
        this.telemetry.destroy();
    }
}

class XYLayer extends TelemetryLayer {
    constructor(openmct, options) {
        super(openmct, options, { x: options.x, y: options.y }, ['x', 'y']);
    }
}

class PathLayer extends XYLayer {
    layer(map) {
        return map.line();
    }
}

class PointLayer extends XYLayer {
    layer(map) {
        return map.point();
    }
}

class PointsLayer extends XYLayer {
    layer(map) {
        return map.points();
    }
}

class CameraLayer extends XYLayer {
    layer(map) {
        return map.camera();
    }
}

class HeatLayer extends TelemetryLayer {
    constructor(openmct, options) {
        super(openmct, options, { x: options.x, y: options.y, z: options.z }, ['z']);
    }

    layer(map) {
        return map.heatmap(
            this.options.blur,
            this.options.radius,
            this.options.gradient,
            (datum) => (datum.z - this.options.low) / (this.options.high - this.options.low)
        );
    }
}

class PlanLayer extends Layer {
    show(map) {
        let layer = map.line();
        this.options.coordinates.forEach(layer.add.bind(layer));
    }
}

const CONSTRUCTORS = {
    image: ImageLayer,
    path: PathLayer,
    plan: PlanLayer,
    heat: HeatLayer,
    point: PointLayer,
    points: PointsLayer,
    camera: CameraLayer
};

export default class LayerFactory {
    constructor(openmct) {
        this.openmct = openmct;
    }

    create(options) {
        let Constructor = CONSTRUCTORS[options.type];
        return new Constructor(this.openmct, options);
    }
}
