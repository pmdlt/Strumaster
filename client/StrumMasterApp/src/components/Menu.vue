<template>
  <v-container>

    <v-btn block prepend-icon="mdi-stop-circle-outline" stacked variant="tonal" color="red" size="x-large"
      @click="sendGetRequest('stop')">
      Emergency Stop
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-connection" variant="tonal" color="blue" @click="sendGetRequest('connect')">
      Test connection
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-update" variant="tonal" color="orange" @click="sendGetRequest('reset')">
      Reset all motors
    </v-btn>
    <br>
    <v-divider></v-divider>
    <br>
    <v-btn block prepend-icon="mdi-pause" variant="outlined" color="black" @click="sendGetRequest('pause')">
      Pause
    </v-btn>
    <br>
    <v-btn block prepend-icon="mdi-play" variant="outlined" color="green" @click="sendGetRequest('resume')">
      Resume
    </v-btn>
    <br>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">{{ snackbarText
    }}</v-snackbar>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    snackbarVisible: false,
    snackbarText: '',
    snackbarColor: '',
    snackbarTimeout: 2000,
  }),
  methods: {
    sendGetRequest(button) {
      const url = `http://192.168.174.140/${button}`
      console.log("Sending GET request to: " + url);
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            this.showSnackbar('An error occurred', 'warning')
          }
        })
        .then(response => {
          if (response) {
            this.showSnackbar(response, 'success');
          }
        })
        .catch(error => {
          console.error(error)
          this.showSnackbar('We lost connection with the board', 'error')
        })
    },
    showSnackbar(text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbarVisible = true
      console.log("Snackbar showed: ", text)
    },
  }
}
</script>
