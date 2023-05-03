<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="3">
            <v-sheet rounded="lg">
              <the-menu-bar />
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="9">
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-select v-model="functionToUse" :items="['SetGoal()', 'ToGoal()', 'SetSpeed()']"
                        label="Function to use"></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-slider v-model="stepperId" min="1" max="6" label="Stepper ID"></v-slider>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-slider v-model="value" min="0" max="100" label="Value"></v-slider>
                    </v-col>
                  </v-row>
                  <v-btn @click="sendAndPlay" block class="mt-2">Send and play</v-btn>
                </v-form>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">{{ snackbarText }}</v-snackbar>
  </v-app>
</template>

<script>
import TheMenuBar from '../components/Menu.vue'

export default {
  components: {
    TheMenuBar,
  },
  data: () => ({
    links: [
      "Dashboard",
      "Play song (via Midi)",
      "Play notes",
      "Debug and calibrate motors",
    ],
    functionToUse: null,
    stepperId: null,
    value: 0,
    snackbarVisible: false,
    snackbarText: '',
    snackbarColor: '',
    snackbarTimeout: 3000,
  }),
  methods: {
    sendAndPlay() {
      const url = `http://192.168.1.1/debug_stepper?function=${this.functionToUse}&id=${this.stepperId}&value=${this.value}`
      fetch(url)
        .then(response => {
          if (response.ok) {
            this.showSnackbar('Success', 'green')
          } else {
            this.showSnackbar('Error', 'red')
          }
        })
        .catch(error => {
          console.error(error)
          this.showSnackbar('Error', 'red')
        })
    },
    showSnackbar(text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbarVisible = true
    },
  },
}
</script>