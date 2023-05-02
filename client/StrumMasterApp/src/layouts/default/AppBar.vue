<template>
  <v-app-bar class="px-3" color="white" flat density="compact">
    <v-spacer></v-spacer>
    <v-tabs centered color="grey-darken-2">
      <router-link to="/">
        <v-tab>Dashboard</v-tab>
      </router-link>
      <router-link to="/play-song">
        <v-tab>Play song (via Midi)</v-tab>
      </router-link>
      <router-link to="/play-notes">
        <v-tab>Play notes</v-tab>
      </router-link>
      <router-link to="/debug">
        <v-tab>Debug and calibrate motors</v-tab>
      </router-link>
    </v-tabs>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  }
}
</script>