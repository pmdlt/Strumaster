<template>
    <v-app id="inspire">
        <v-main class="bg-grey-lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="3">
                        <v-sheet rounded="lg">
                            <the-menu-bar/>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="9">
                        <v-sheet min-height="70vh" rounded="lg">
                            <v-container>
                                <v-form ref="form">
                                    <p class="text-center">Insert a midi file to be played by the guitar<br><br></p>
                                    <v-file-input v-model="file" label="MIDI File" variant="solo"></v-file-input>

                                    <p class="text-center">Parameters</p>
                                    
                                    <v-slider v-model="channel" :min="0" :max="16" :step="1" thumb-label label="MIDI Channel"></v-slider>

                                    <v-slider v-model="speed" :min="0" :max="100" thumb-label label="Speed"></v-slider>

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
        speed: 0,
        channel: 0,
        file: null,
    }),
    methods: {
        sendAndPlay() {
            const params = new URLSearchParams({
                channel: this.channel,
                speed: this.speed,
                file: this.file,
            });
            const url = `http://192.168.1.1/play_midi?${params.toString()}`;
            fetch(url, { method: "GET" })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    // handle successful response
                })
                .catch(error => {
                    console.error("There was a problem with the network request:", error);
                    // handle error
                });
        }
    }
}
</script>
