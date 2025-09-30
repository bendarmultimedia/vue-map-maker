import { defineStore } from "pinia";
import type {MapCenter, UIState} from "@/types";
import map from "./../config/map.json";
export const useUIStore = defineStore("UIStore", {
    state: (): UIState => {
        return {
            mapCenter: {
                lat: map.center.lat,
                lng: map.center.lng
            }
        }
    },
    actions: {
        setCenter(lat: number, lng: number) : MapCenter {
            const mapCenter = {
                     lat: lat,
                     lng: lng,
            }
            this.mapCenter = mapCenter;
            this.save();
            return mapCenter;
        },
        save(): void {
            localStorage.setItem('UIState', JSON.stringify(this.$state));
            console.log("UIState saved!");
        }
    }
})