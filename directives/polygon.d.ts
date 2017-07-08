import { BaseMapDirective } from './base-map-directive';
import { NguiMapComponent } from '../components/ngui-map.component';
export declare class Polygon extends BaseMapDirective {
    clickable: any;
    draggable: any;
    editable: any;
    fillColor: any;
    fillOpacity: any;
    geodesic: any;
    paths: any;
    strokeColor: any;
    strokeOpacity: any;
    strokePosition: any;
    strokeWeight: any;
    visible: any;
    zIndex: any;
    options: any;
    click: any;
    dblclick: any;
    drag: any;
    dragend: any;
    dragstart: any;
    mousedown: any;
    mousemove: any;
    mouseout: any;
    mouseover: any;
    mouseup: any;
    rightclick: any;
    constructor(nguiMapComp: NguiMapComponent);
}
export interface PolygonOutput {
    click: any;
    dblclick: any;
    drag: any;
    dragend: any;
    dragstart: any;
    mousedown: any;
    mousemove: any;
    mouseout: any;
    mouseover: any;
    mouseup: any;
    rightclick: any;
}
export interface PolygonInput {
    clickable: any;
    draggable: any;
    editable: any;
    fillColor: any;
    fillOpacity: any;
    geodesic: any;
    paths: any;
    strokeColor: any;
    strokeOpacity: any;
    strokePosition: any;
    strokeWeight: any;
    visible: any;
    zIndex: any;
    options: any;
}
