<script setup lang="ts">
import {ref} from 'vue';
import MapCanvas from './components/MapCanvas.vue'
import ThemeSwitcher from "./components/UI/ThemeSwitcher.vue";
import GroupList from "./components/Marker/GroupList.vue";

const currentTheme = ref<string>('fantasy');

const setTheme = function (isDark: { value: boolean }) {
  currentTheme.value = isDark.value ? 'dracula' : 'fantasy';
}

</script>

<template>
  <div class="theme-wrapper" :data-theme="currentTheme">
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <a class="btn btn-dash radius-10 btn-default border-info hover:border-warning hover:bg-zinc-900 text-xl text-lime-600">
          <span class="text-sky-600">Map</span>Maker</a>
      </div>
      <div class="flex-none">
        <ThemeSwitcher @themeChanged="setTheme"/>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2">
        <GroupList class=" p-2"></GroupList>
        <MapCanvas class=" p-2"/>
    </div>
  </div>
</template>

<style scoped>

</style>
