<script lang="ts" setup>
import {TrashIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon} from "@heroicons/vue/24/solid/index.js";
import {ref} from "vue";

const emit = defineEmits(["removeMarker", "switchDraggable", "renameMarker"]);

const props = defineProps({
  groupId: Number,
  marker: Object
})
const marker = ref(props.marker)
</script>

<template>
  <tr>
    <td>{{ marker.id }}</td>
    <td><input v-model=marker.name class="input input-ghost" type="text" @change="emit('renameMarker', groupId, marker.id, marker.name)" /></td>
    <td>{{ marker.lat }}</td>
    <td>{{ marker.lng }}</td>
    <td>
      <button class="mx-2 btn btn-error btn-xs join-item btn-circle"
              @click="emit('removeMarker', groupId, marker.id)">
        <TrashIcon class="size-4"/>
      </button>
      <button class="mx-2 btn btn-info btn-xs join-item btn-circle"
              @click="emit('switchDraggable', groupId, marker.id)">
        <ArrowsPointingInIcon v-if="marker.draggable" class="size-4"/>
        <ArrowsPointingOutIcon v-else class="size-4"/>

      </button>
    </td>
  </tr>
</template>

<style scoped>

</style>