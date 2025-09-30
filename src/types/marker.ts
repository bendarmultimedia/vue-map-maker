export interface MarkerGroup {
    id: number;
    name: string;
    icon: string;
    selected: boolean;
    markers: Map<number, MapMarker>;
}
export interface MapMarker {
    id: number;
    name: string;
    lat: number;
    lng: number;
    selected?: boolean;
    icon?: string;
    popup?: string;
    draggable?: boolean;
}

export interface MarkerGroupState {
    groups: Map<number, MarkerGroup>;
}

export interface DefaultMarkerGroup {
    id: number;
    name: string;
    icon: string;
    selected: boolean;
    markers: Array<MapMarker>;
}
