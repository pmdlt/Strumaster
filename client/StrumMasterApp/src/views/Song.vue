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
                                    <v-file-input label="MIDI File" variant="solo" @change="loadFile"></v-file-input>

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
import { Midi } from '@tonejs/midi';

import TheMenuBar from '../components/Menu.vue';

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

        loadFile(event) {
            const midiFile = event.target.files[0];
            console.log(midiFile);
            const reader = new FileReader();
            reader.readAsDataURL(midiFile);
            console.log("hello");
            reader.onload = (event) => {
                const midiData = event.target.result;
                console.log(midiData);
                this.file = Midi.fromBytes(new Uint8Array(midiData));
            }
        },

        sendAndPlay() {
            if (!this.file) {
                this.showSnackbar('Please select a MIDI file', 'error');
                return;
            }
            console.log(this.file);
            const csvToSend = transform(this.file, this.channel);
            console.log(csvToSend);

            const url = `http://192.168.174.140/play_song?song=${csvToSend}`;
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        this.showSnackbar('An error occurred', 'warning')
                    }
                })
                .then(response => {
                    this.showSnackbar(response, 'success');
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
        },

    },
};

/// TRANSFORM NOTE ENGINE

class Note {
    constructor(name, time_start, time_end) {
        this.name = name;
        this.time_start = time_start;
        this.time_end = time_end;
    }

}

let TIME_TO_MOVE_ONE_FRET = 0.1; // seconds

let guitar = [
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],//,"D","D#"],
    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],//,"A","A#"],
    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],//,"F","F#"],
    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],//,"C","C#"],
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"],//,"G","G#"],
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],//,"D","D#"],
]


// take a json object and return a csv string

function transform(json, track_number) {


    json = json['tracks'][track_number]


    let notes = []

    for (let i = 0; i < json['notes'].length; i++) {
        let note = json['notes'][i]
        let time_start = note['time']
        let time_end = time_start + note['duration']
        let name = note['name'].replace(/\d+/g, '');// to do: handle octave
        notes.push(new Note(name, time_start, time_end))
    }

    let result = chooseCord(notes)
    // convert to csv
    let csv = ""
    for (let i = 0; i < result.length; i++) {
        csv += result[i][1] + "," + result[i][0] + "\n"
    }
    return csv



}

function chooseCord(notes) {
    let position = [0, 0, 0, 0, 0, 0]
    let used_until = [0, 0, 0, 0, 0, 0]
    let result = []
    for (let i = 0; i < notes.length; i++) {
        let a = canPlay(notes[i], used_until, position);
        if (a.length > 0) {
            result.push([a[0][0] * 10 + a[0][1], notes[i].time_start, notes[i].time_end]);
            position[a[0][0]] = a[0][1];
            // console.log(position,a[0][0],notes[i].time_start,notes[i].time_end);
            // console.log(used_until.map(x => x>notes[i].time_start));
            used_until[a[0][0]] = notes[i].time_end;
        }
        else {
            console.log("ERROR: can't play note " + notes[i].name + " at time " + notes[i].time_start);
            // console.log(position);
            // console.log(used_until.map(x => x>notes[i].time_start));
        }
    }
    return result
}


function canPlay(note, used_until, position) {
    let temp = []
    for (let i = 0; i < 6; i++) {
        // check if the cord is free
        if (note.time_start >= used_until[i]) {
            // check if the note is in the cord
            if (guitar[i].includes(note.name)) {
                let move = guitar[i].indexOf(note.name) - position[i];
                // check if the move is possible
                if (used_until[i] + move * TIME_TO_MOVE_ONE_FRET <= note.time_start) {
                    temp.push([i, guitar[i].indexOf(note.name), move]);
                }
            }
        }
    }
    let a = temp.sort(function (a, b) { return a[2] - b[2] }).map(x => [x[0], x[1]]);
    return a
}
</script>
