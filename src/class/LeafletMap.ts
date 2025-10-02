import * as leaflet from 'leaflet';
import {MapSettings, MapMarker} from '@/types';

export default class LeafletMap {
    private readonly settings: MapSettings;
    private readonly leaflet: typeof leaflet;
    private mapCanvas: leaflet.Map | null = null;
    private leafletMarkers: Map<string | number, leaflet.Marker>;

    constructor(settings: MapSettings) {
        this.settings = settings;
        this.leaflet = leaflet;
        this.leafletMarkers = new Map<string, leaflet.Marker>();
        return this;
    }

    get getMapCanvas(): leaflet.Map | null {
        return this.mapCanvas;
    }

    get getMarkers(): Map<string | number, leaflet.Marker> {
        return this.leafletMarkers;
    }

    createMap = (): void => {
        this.mapCanvas = this.leaflet.map(this.settings.canvasID).setView(
            [this.settings.center.lat, this.settings.center.lng],
            this.settings.zoom
        );
        
        this.leaflet.tileLayer(this.settings.templateUrl, {
            maxZoom: this.settings.maxZoom,
            attribution: this.settings.attribution,
        }).addTo(this.mapCanvas);
    }

    addMarker = (marker: MapMarker): MapMarker | null => {
        if (this.mapCanvas) {
            const leafletMarker = this.leaflet.marker([marker.lat, marker.lng], {draggable:marker.draggable ?? false}).addTo(this.mapCanvas);
            leafletMarker.bindPopup(marker.name + " id: " + marker.id);
            this.leafletMarkers.set(marker.id, leafletMarker);
            return marker;
        }
        return null;
    }
    removeMarker = (marker: MapMarker): boolean => {
        if (this.mapCanvas && this.leafletMarkers.has(marker.id)) {
            const leafletMarker = this.leafletMarkers.get(marker.id);
            if (leafletMarker) {
                this.mapCanvas.removeLayer(leafletMarker);
                return this.leafletMarkers.delete(marker.id);
            }
        }
        return false;
    }
}