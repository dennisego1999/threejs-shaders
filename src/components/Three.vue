<script setup lang="ts">
import Scene from "../classes/Scene.ts";
import {nextTick} from "vue";

nextTick(() => {
  //Create new three.js scene
  const scene = new Scene('three-canvas');
});
</script>

<template>
  <canvas id="three-canvas"></canvas>
</template>