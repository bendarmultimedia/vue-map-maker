<script lang="ts" setup>
import {useGroupStore} from "@/stores/markerGroupStore";
import {useUIStore} from "@/stores/UIStore";
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";
import defaults from "../../config/defaults.json";
import MarkerGroup from "./MarkerGroup.vue";
import {PlusIcon} from "@heroicons/vue/24/solid";

const groupStore = useGroupStore()
const UIStore = useUIStore()
const {mapCenter} = storeToRefs(UIStore)
const {groups} = storeToRefs(groupStore)

const newMarkerCoords = ref({lat: mapCenter.value.lat, lng: mapCenter.value.lng})

const addMarkerGroup = (): void => {
  const newGroup = groupStore.addGroup(`${defaults.markerGroup.name} ${(groups.value.size + 1)}`)
  selectGroup(newGroup.id)
}

const selectGroup = (groupId: number): void => {
  groupStore.markSelectedGroup(groupId)
}

const removeGroup = (groupId: number): void => {
  console.log(groupId)
  groupStore.removeGroup(groupId)
  if (groups.value.size > 0) {
    const lastGroup = Array.from(groups.value.values()).pop()
    console.log(lastGroup)
    if (lastGroup) {
      selectGroup(lastGroup.id)
    }
  }
}
const addMarker = (groupId: number): void => {
  groupStore.addMarker(groupId, defaults.mapMarker.name, UIStore.mapCenter.lat, UIStore.mapCenter.lng)
}
watch(
    mapCenter,
    (currentMapCenter) => {
      newMarkerCoords.value = {
        lat: currentMapCenter.lat, lng: currentMapCenter.lng
      }
    }
)


</script>

<template>
  <div>
    <div class="tabs tabs-lift">
      <MarkerGroup v-for="group in Array.from(groups.values())" :key="group.id" :markerGroupId="group.id" @addMarker="addMarker"
                   @removeGroup="removeGroup"
                   @selectGroup="selectGroup"
      ></MarkerGroup>
      <div class="btn btn-xs btn-circle btn-primary mx-2 my-auto" @click="addMarkerGroup()">
        <PlusIcon class="size-4"></PlusIcon>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>