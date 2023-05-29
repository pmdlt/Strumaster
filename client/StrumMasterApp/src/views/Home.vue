<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12">
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>
                <h1 class="title text-center">Strumaster</h1>

                <p class="text-center">Welcome to the control center app of the Strumaster project.<br>

                  You can control the guitar from this app, play a specific note and your favourite song via MIDI
                  file.<br><br>
                </p>

                <p class="text-center">Please connect to the WiFi of the board (strumaster_control) with password
                  12345678.<br>

                  Then click the button below to test your connection with the board.<br><br>
                </p>
                <v-divider></v-divider><br>
                <p class="text-center">Please remove strong HTTPS security for this website in your browser in order to
                  communicate with the board.<br>
                  Don't worry, security is not an issue here, we are not sending any sensitive data. Also, it's just
                  between your PC and the board, not you and the internet.<br>
                  <br>
                </p>
                <v-img class="center" contain :width="500" src="@/assets/1.png" />
                <v-img class="center" contain :width="500" src="@/assets/2.png" />
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
};
</script>
