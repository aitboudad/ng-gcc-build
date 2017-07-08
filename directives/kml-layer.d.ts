import { BaseMapDirective } from './base-map-directive';
import { NguiMapComponent } from '../components/ngui-map.component';
export declare class KmlLayer extends BaseMapDirective {
    clickable: any;
    preserveViewport: any;
    screenOverlays: any;
    suppressInfoWindows: any;
    url: any;
    zIndex: any;
    options: any;
    click: any;
    defaultviewport_changed: any;
    status_changed: any;
    constructor(nguiMapComp: NguiMapComponent);
}
export interface KmlLayerOutput {
    click: any;
    defaultviewport_changed: any;
    status_changed: any;
}
export interface KmlLayerInput {
    clickable: any;
    preserveViewport: any;
    screenOverlays: any;
    suppressInfoWindows: any;
    url: any;
    zIndex: any;
    options: any;
}
