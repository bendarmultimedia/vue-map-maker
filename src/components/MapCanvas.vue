<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useDebounceFn, useEventListener} from '@vueuse/core'
import {storeToRefs} from "pinia";
import LeafletMap from '@/class/LeafletMap';
import * as mapSettings from './../config/map.json';
import {useGroupStore} from '@/stores/markerGroupStore'
import {useUIStore} from "@/stores/UIStore";
import type {MarkerGroup} from "@/types/marker";

const map = ref<LeafletMap>(new LeafletMap(mapSettings));
const markerGroupStore = useGroupStore()
const {groups} = storeToRefs(markerGroupStore)
const UIStore = useUIStore()


const renderMarkers = function addMarkers(markerGroups: Map<number, MarkerGroup>) {
  const leafletMarkers = map.value.getMarkers;

  // Get all current marker IDs from the store
  const currentMarkerIds = new Set<number>();
  markerGroups.forEach(markerGroup => {
    markerGroup.markers?.forEach(marker => {
      currentMarkerIds.add(marker.id);
    });
  });

  // Remove markers that are no longer in the store
  leafletMarkers.forEach((leafletMarker, markerId) => {
    if (!currentMarkerIds.has(markerId)) {
      map.value.removeMarker({id: markerId} as any);
    }
  });

  // Add or update existing markers
  markerGroups.forEach(markerGroup => {
    markerGroup.markers?.forEach(marker => {
      if (!leafletMarkers.has(marker.id)) {
        map.value.addMarker(marker);
        const leafletMarker = leafletMarkers.get(marker.id);
        if (leafletMarker && marker.draggable) {
          leafletMarker.on('dragend', (e) => {
            const newLat = e.target.getLatLng().lat;
            const newLng = e.target.getLatLng().lng;
            markerGroupStore.updateMarkerPosition(markerGroup.id, marker.id, newLat, newLng);
          });
          leafletMarker._dragListenerAdded = true;
        }
      } else {
        const leafletMarker = leafletMarkers.get(marker.id)!;
        if (marker.draggable) {
          leafletMarker.dragging?.enable();
          if (!leafletMarker._dragListenerAdded) {
            leafletMarker.on('dragend', (e) => {
              const newLat = e.target.getLatLng().lat;
              const newLng = e.target.getLatLng().lng;
              markerGroupStore.updateMarkerPosition(markerGroup.id, marker.id, newLat, newLng);
            });
            leafletMarker._dragListenerAdded = true;
          }
        } else {
          leafletMarker.dragging?.disable();
        }
      }
    })
  })
}
watch(
    groups,
    (newGroups) => {
      renderMarkers(newGroups)
    },
    {deep: true} // watch nested changes (like m.draggable)
);
onMounted(() => {
  map.value.createMap();
  const mapCanvas = map.value.getMapCanvas;
  renderMarkers(groups.value);
  if (mapCanvas) {
    UIStore.setCenter(mapCanvas.getCenter().lat, mapCanvas.getCenter().lng);
    const debouncedMoveEndHandler = useDebounceFn(() => {
      const center = mapCanvas.getCenter();
      UIStore.setCenter(center.lat, center.lng);
    }, mapSettings.dragDebounce);

    useEventListener(mapCanvas, 'moveend', debouncedMoveEndHandler);
  }
})
</script>

<template>
  <div class="">
    <div id="mapCanvas" class="border-1 border-base-300 card rounded-box overflow-hidden h-100">Map</div>
  </div>
</template>

<style scoped>

</style>