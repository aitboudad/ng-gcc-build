import { BaseMapDirective } from './base-map-directive';
import { NguiMapComponent } from '../components/ngui-map.component';
export declare class TrafficLayer extends BaseMapDirective {
    autoRefresh: any;
    options: any;
    constructor(nguiMapComp: NguiMapComponent);
}
export interface TrafficLayerOutput {
}
export interface TrafficLayerInput {
    autoRefresh: any;
    options: any;
}
