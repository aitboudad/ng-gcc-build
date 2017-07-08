/// <reference types="googlemaps" />
import { BaseMapDirective } from './base-map-directive';
import { NguiMapComponent } from '../components/ngui-map.component';
export declare class Circle extends BaseMapDirective {
    private nguiMapComp;
    center: any;
    clickable: any;
    draggable: any;
    editable: any;
    fillColor: any;
    fillOpacity: any;
    map: any;
    radius: any;
    strokeColor: any;
    strokeOpacity: any;
    strokePosition: any;
    strokeWeight: any;
    visible: any;
    zIndex: any;
    options: any;
    geoFallbackCenter: any;
    centerChanged: any;
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
    radiusChanged: any;
    rightclick: any;
    mapObject: google.maps.Circle;
    objectOptions: google.maps.CircleOptions;
    constructor(nguiMapComp: NguiMapComponent);
    initialize(): void;
    setCenter(): void;
}
export interface CircleOutput {
    centerChanged: any;
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
    radiusChanged: any;
    rightclick: any;
}
export interface CircleInput {
    center: any;
    clickable: any;
    draggable: any;
    editable: any;
    fillColor: any;
    fillOpacity: any;
    map: any;
    radius: any;
    strokeColor: any;
    strokeOpacity: any;
    strokePosition: any;
    strokeWeight: any;
    visible: any;
    zIndex: any;
    options: any;
    geoFallbackCenter: any;
}
