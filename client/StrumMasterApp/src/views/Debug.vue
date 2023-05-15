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
                  <p class="text-center">Calibrate stepper<br><br></p>

                  <v-select v-model="stepperFunctionToUse" :items="[1, 2]" label="Function to use"
                    variant="outlined"></v-select>

                  <v-slider v-model="stepperId" :min="0" :max="6" :step="1" thumb-label label="Stepper ID"></v-slider>

                  <v-text-field v-model="stepperValue" label="Value" variant="outlined"></v-text-field>

                  <v-btn @click="debugStepper" block class="mt-2">Debug Stepper</v-btn><br><br>

                  <v-divider></v-divider><br><br>

                  <p class="text-center">Test servo<br><br></p>

                  <v-slider v-model="servoId" :min="0" :max="6" :step="1" thumb-label label="Servo ID"></v-slider>

                  <v-btn @click="debugServo" block class="mt-2">Move Servo</v-btn>
                </v-form>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">{{ snackbarText
    }}</v-snackbar>
  </v-app>
</template>

<script>
import TheMenuBar from '../components/Menu.vue'

export default {
  components: {
    TheMenuBar,
  },
  data: () => ({
    stepperFunctionToUse: 0,
    stepperId: 1,
    stepperValue: null,
    servoId: 1,
    snackbarVisible: false,
    snackbarText: '',
    snackbarColor: '',
    snackbarTimeout: 2000,
  }),
  methods: {
    debugStepper() {
      const url = `https://app.strumaster.pmd.lt/server/debug_stepper?function=${this.stepperFunctionToUse}&id=${this.stepperId}&value=${this.stepperValue}`
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
    debugServo() {
      const url = `https://app.strumaster.pmd.lt/server/debug_stepper?function=${this.stepperId}`
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