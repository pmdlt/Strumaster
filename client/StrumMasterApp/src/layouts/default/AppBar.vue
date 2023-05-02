<template>
  <v-app-bar class="px-3" color="white" flat density="compact">
    <v-spacer></v-spacer>
    <v-tabs centered color="grey-darken-2">
      <v-tab v-for="link in links" :key="link">
        {{ link }}
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    links: [
      'Dashboard',
      'Play song (via Midi)',
      'Play notes',
      'Debug and calibrate motors',
    ],
  }),
}
</script>
