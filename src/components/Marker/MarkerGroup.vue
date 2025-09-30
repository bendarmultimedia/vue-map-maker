<script lang="ts" setup>
import {onBeforeMount, ref, watch} from "vue";
import {MapPinIcon, PencilSquareIcon, PlusIcon, TrashIcon} from "@heroicons/vue/24/solid/index.js";
import * as translation from "../../config/translations/en.json"
import MarkerRow from "@/components/Marker/MarkerRow.vue";
import {useGroupStore} from "@/stores/markerGroupStore.js";
import {storeToRefs} from "pinia";
import {MarkerGroup} from "@/types";

const props = defineProps({
  markerGroupId: Number
})
const emit = defineEmits(["selectGroup", "removeGroup", "addMarker"]);

const groupStore = useGroupStore()
const markerGroup = ref<MarkerGroup>();
const {groups} = storeToRefs(groupStore)


const findMarkerGroup = (markerGroupId: number): MarkerGroup => {
  markerGroup.value = groups.value.get(markerGroupId);
}
const removeMarker = (groupId: number, markerId: number): void => {
  groupStore.removeMarker(groupId, markerId)
}
const renameMarker = (groupId: number, markerId: number, markerName: string): void => {
  groupStore.renameMarker(groupId, markerId, markerName)
}
const switchDraggable = (groupId: number, markerId: number): void => {
  groupStore.switchDraggable(groupId, markerId)
}

onBeforeMount(() => {
  findMarkerGroup(props.markerGroupId);
})

watch(
    groups,
    () => {
      findMarkerGroup(props.markerGroupId)
    }
);

</script>

<template>
  <input :aria-label="markerGroup.name" :checked="markerGroup.selected" class="tab" name="my_tabs_3" type="radio"
         @change="emit('selectGroup', markerGroup.id)"/>
  <div class="tab-content bg-base-100 border-base-300 p-6">
    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-2">
      <div class="flex items-center justify-between">
        <input v-model=markerGroup.name class="input input-ghost" type="text"/>
        <div class="join">
          <button class="btn btn-success btn-xs join-item" @click="emit('addMarker', markerGroup.id)">
            <PlusIcon class="size-3"/>
            {{ translation.addMarker }}
            <MapPinIcon class="size-3"/>
          </button>
          <button class="btn btn-info btn-xs join-item">
            <PencilSquareIcon class="size-3"/>
            {{ translation.rename }}
          </button>
          <button class="btn btn-error btn-xs join-item" @click="emit('removeGroup', markerGroup.id)">
            <TrashIcon class="size-3"/>
            {{ translation.remove }}
          </button>
        </div>
      </div>
      <div class="divider my-0"></div>
      <table class="table">
        <!-- head -->
        <thead>
        <tr>
          <th class="capitalize">id</th>
          <th class="capitalize">{{ translation.name }}</th>
          <th class="capitalize">{{ translation.latitude }}</th>
          <th class="capitalize">{{ translation.longitude }}</th>
          <th class="capitalize">{{ translation.action }}</th>
        </tr>
        </thead>
        <tbody>
        <MarkerRow v-for="marker in Array.from(markerGroup.markers.values())" :key="marker.id || marker.name" :groupId="markerGroup.id"
                   :marker="marker"
                   @removeMarker="removeMarker"
                   @switchDraggable="switchDraggable"
                   @renameMarker="renameMarker"
        />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>