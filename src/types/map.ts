// Map-related interfaces
export interface MapCenter {
    lat: number;
    lng: number;
}

export interface MapSettings {
    canvasID: string;
    center: MapCenter;
    zoom: number;
    templateUrl: string;
    maxZoom: number;
    attribution: string;
}

export interface TileLayerOptions {
    maxZoom: number;
    attribution: string;
    minZoom?: number;
    opacity?: number;
}
