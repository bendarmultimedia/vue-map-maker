import {defineStore} from "pinia";
import iconsConfig from "./../config/icons.json";
import defaults from "./../config/defaults.json";
import type {DefaultMarkerGroup, MapMarker, MarkerGroup, MarkerGroupState} from "@/types";

export const useGroupStore = defineStore("markerGroupStore", {
    state: (): MarkerGroupState => {
        const createDefaultGroup = (): MarkerGroup => {
            const defaultGroup = defaults.markerGroup as DefaultMarkerGroup;
            const markersMap = new Map<number, MapMarker>();
            defaultGroup.markers.forEach(marker => {
                markersMap.set(marker.id, {
                    id: marker.id,
                    name: marker.name,
                    lat: marker.lat,
                    lng: marker.lng,
                    selected: false
                });
            });
            return {
                id: Date.now(),
                name: defaultGroup.name,
                icon: defaultGroup.icon,
                selected: defaultGroup.selected,
                markers: markersMap
            };
        }
        const getInitialGroups = (): Map<number, MarkerGroup> => {
            let parsedGroups: MarkerGroup[] | null = null;
            try {
                const raw = localStorage.getItem('markerGroups');
                parsedGroups = raw ? JSON.parse(raw) : null;
            } catch (e) {
            }

            const groupsArray = Array.isArray(parsedGroups) && parsedGroups?.length > 0
                ? parsedGroups
                : [createDefaultGroup()];

            const groupsMap = new Map<number, MarkerGroup>();
            groupsArray.forEach(group => {
                const markersMap = new Map<number, MapMarker>();
                if (group.markers && Array.isArray(group.markers)) {
                    group.markers.forEach((marker: MapMarker) => {
                        markersMap.set(marker.id, marker);
                    });
                }

                groupsMap.set(group.id, {
                    ...group,
                    markers: markersMap
                });
            });

            return groupsMap;
        }

        return {
            groups: getInitialGroups()
        }
    },
    actions: {
        addGroup(name: string): MarkerGroup {
            const newId = Date.now();
            const newGroup: MarkerGroup = {
                id: newId,
                name,
                icon: iconsConfig.icons[0],
                selected: false,
                markers: new Map<number, MapMarker>()
            };
            this.groups.set(newId, newGroup);
            this.save();
            return newGroup;
        },
        removeGroup(id: number): void {
            this.groups.delete(id);
            this.save();
        },
        markSelectedGroup(id: number): void {
            this.groups.forEach(group => {
                group.selected = false;
            });
            const group = this.groups.get(id);
            if (group) {
                group.selected = true;
            }
            console.log(this.groups);
            this.save();
        },
        addMarker(groupId: number, markerName: string, lat: number, lng: number): void {
            const group = this.findGroup(groupId);
            if (!group) return;

            const newMarker: MapMarker = {
                id: Date.now(),
                name: markerName,
                lat: lat,
                lng: lng,
                selected: true,
                draggable: true
            };
            group.markers.set(newMarker.id, newMarker);
            this.save();
        },
        removeMarker(groupId: number, markerId: number): void {
            const group = this.findGroup(groupId);
            if (!group) return;

            group.markers.delete(markerId);
            this.save();
        },
        switchDraggable(groupId: number, markerId: number): MapMarker | null {
            const marker = this.findMarker(groupId, markerId)
            if (marker) {
                marker.draggable = !marker.draggable;
                this.save();
            }
            return marker;
        },
        renameMarker(groupId: number, markerId: number, name: string): MapMarker | null {
            const marker = this.findMarker(groupId, markerId)
            if (!marker) return null;
            marker.name = name;
            this.save();
            return marker;
        },
        findMarker(groupId: number, markerId: number): MapMarker | null {
            const group = this.findGroup(groupId);
            if (!group) return null;

            const marker = group.markers.get(markerId);
            if (!marker) return null;

            return marker;
        },
        findGroup(groupId: number,): MarkerGroup | null {
            const group = this.groups.get(groupId);
            if (!group) return null;

            return group;
        },
        updateMarkerPosition(groupId: number, markerId: number, lat: number, lng: number): void {
            const marker = this.findMarker(groupId, markerId)
            if (marker) {
                marker.lat = lat;
                marker.lng = lng;
            }
            this.save();
        },
        save(): void {
            const groupsArray = Array.from(this.groups.values()).map(group => ({
                ...group,
                markers: Array.from(group.markers.values())
            }));
            localStorage.setItem('markerGroups', JSON.stringify(groupsArray));
        }
    }
})