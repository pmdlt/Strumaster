<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" color="white" flat density="compact">


      <v-spacer></v-spacer>

      <v-tabs centered color="grey-darken-2">
        <v-tab v-for="link in links" :key="link">
          {{ link }}
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="3">
            <v-sheet rounded="lg">
              <v-container>

                <v-btn block prepend-icon="mdi-stop-circle-outline" stacked variant="outlined" color="red">
                  Emergency Stop
                </v-btn>
                <br>
                <v-btn block prepend-icon="mdi-pause" variant="outlined" color="black">
                  Pause
                </v-btn>
                <br>
                <v-btn block prepend-icon="mdi-play" variant="outlined" color="green">
                  continue
                </v-btn>
                <br>
                <v-btn block prepend-icon="mdi-update" stacked variant="outlined" color="orange">
                  Reset all motors
                </v-btn>

              </v-container>
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="9">
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>
                <v-form ref="form">
                  <p class="text-center">Insert a midi file to be played by the guitar<br><br></p>
                  <v-file-input v-model="file" label="MIDI File" variant="solo"></v-file-input>

                  <p class="text-center">Parameters</p>

                  <p class="text-left">MIDI Channel<br></p>
                  <v-slider v-model="channel" :min="0" :max="16" :step="1" thumb-label></v-slider>

                  <div :class="text - h6">Speed<br></div>

                  <v-slider v-model="speed" :min="0" :max="100" thumb-label></v-slider>

                  <v-btn type="submit" block class="mt-2">Send and play</v-btn>
                </v-form>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
    speed: 0,
    channel: 0,
    file: null,
  }),
}
</script>