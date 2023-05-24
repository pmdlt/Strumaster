<template>
  <v-container>

    <v-btn block prepend-icon="mdi-stop-circle-outline" stacked variant="tonal" color="red" size="x-large"
      @click="sendGetRequest('stop')">
      Emergency Stop
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-pause" variant="outlined" color="black" @click="sendGetRequest('pause')">
      Pause
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-play" variant="outlined" color="green" @click="sendGetRequest('continue')">
      continue
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-update" variant="tonal" color="orange" @click="sendGetRequest('reset')">
      Reset all motors
    </v-btn>

  </v-container>
</template>

<script>
export default {
  methods: {
    sendGetRequest(button) {
      fetch(`http://192.168.174.140/${button}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  }
}
</script>
