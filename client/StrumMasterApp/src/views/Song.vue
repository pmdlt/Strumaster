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
                                    <p class="text-center">Insert a midi file to be played by the guitar<br><br></p>
                                    <v-file-input v-model="file" label="MIDI File" variant="solo"></v-file-input>

                                    <p class="text-center">Parameters</p>

                                    <v-slider v-model="channel" :min="0" :max="16" :step="1" thumb-label
                                        label="MIDI Channel"></v-slider>

                                    <v-slider v-model="speed" :min="0" :max="100" thumb-label label="Speed"></v-slider>

                                    <v-btn @click="sendAndPlay" block class="mt-2">Send and Play</v-btn>
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
import { Midi } from 'tone';
import TheMenuBar from '../components/Menu.vue'

export default {
    components: {
        TheMenuBar,
    },
    data: () => ({
        speed: 0,
        channel: 0,
        file: null,
        snackbarVisible: false,
        snackbarText: '',
        snackbarColor: '',
        snackbarTimeout: 2000,
    }),
    methods: {
        async sendAndPlay() {
            const reader = new FileReader();
            reader.readAsArrayBuffer(this.file);
            reader.onload = async () => {
                const buffer = reader.result;
                const midi = await Midi.fromArrayBuffer(buffer);
                const notes = midi.toNotes();
                console.log(notes);

                /* const url = `http://192.168.174.140/play_midi?${this.toSend}}`;
                fetch(url, { method: "GET" })
                    .then(response => {
                        if (response.ok) {
                            this.showSnackbar(response.text(), 'success')
                        } else {
                            console.error(response)
                            this.showSnackbar('An error occurred', 'warning')
                        }
                    })
                    .catch(error => {
                        console.error(error)
                        this.showSnackbar('We lost connection with the board', 'error')
                    }) */
            };
        },
        showSnackbar(text, color) {
            this.snackbarText = text
            this.snackbarColor = color
            this.snackbarVisible = true
        },
    },
};
</script>
