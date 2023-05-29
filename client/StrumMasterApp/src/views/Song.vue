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

                                    <v-btn @click="loadSong" block prepend-icon="mdi-send" class="mt-2">Send and load the
                                        song into the
                                        guitar</v-btn>
                                    <v-btn @click="playSong" block prepend-icon="mdi-play" variant="tonal" color="green"
                                        class="mt-2">Play song</v-btn>
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
        speed: 45,
        channel: 0,
        notes: null,
        snackbarVisible: false,
        snackbarText: '',
        snackbarColor: '',
        snackbarTimeout: 2000,
    }),
    methods: {
        loadFile(e) {
            console.log("1. File provided, loading...");
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log("2. File loaded");
                    console.log("3. File transforming to MIDI...");
                    const MIDIfile = new Midi(e.target.result);
                    const MIDIjson = MIDIfile.toJSON();
                    console.log("MIDI File:", MIDIjson);

                    console.log("4. File transforming to notes...");
                    const transformed = transform(MIDIjson, this.channel);
                    console.log("Notes:", '\n', transformed);

                    this.notes = transformed;
                    console.log("5. File transformed and ready to be sent");
                }
                reader.readAsArrayBuffer(file);
            }

        },

        loadSong() {
            console.log("Load song button clicked");
            if (this.notes == null) {
                this.showSnackbar('The file provided cannot be transformed and played', 'error')
                return;
            }

            const url = `http://192.168.174.140/load_song`;
            console.log("Sending POST request to: " + url);

            fetch(url, {
                method: "POST",
                body: this.notes
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        console.error(response)
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
        playSong() {
            const url = `http://192.168.174.140/play_song`
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

let TIME_TO_MOVE_ONE_FRET = 240;

let TIME_NOTE = 500;

let guitar = [
    ["F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],//,"D","D#"],
    ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],//,"A","A#"],
    ["G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],//,"F","F#"],
    ["D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],//,"C","C#"],
    ["A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"],//,"G","G#"],
    ["F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],//,"D","D#"],
]


// take a json object and return a csv string

function transform(json, track_number) {


    json = json['tracks'][track_number]


    let notes = []
    let GLOBAL_START_TIME = json['notes'][0]['time']

    for (let i = 0; i < json['notes'].length; i++) {
        let note = json['notes'][i]
        let time_start = Math.floor(note['time'] * 1000 - GLOBAL_START_TIME)
        let time_end = Math.floor(time_start + Math.min(note['duration'] * 1000, TIME_NOTE) - GLOBAL_START_TIME)
        let name = note['name'].replace(/\d+/g, '');// to do: handle octave
        notes.push(new Note(name, time_start, time_end))
    }

    let result = chooseCord(notes)
    // convert to csv
    let csv = "time_start,time_end,id\n"
    for (let i = 0; i < result.length; i++) {
        csv += result[i][1] + "," + result[i][2] + "," + result[i][0] + "\n"
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
            console.error("Error during the transformation process : ", '\n',
                "Can't play note ", notes[i].name, " at time ", notes[i].time_start, '\n',
                "Note object: ", notes[i], '\n',
                "Resolution : note was skipped");
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
                // check if the move is possible or if it's the first note
                if (used_until[i] + move * TIME_TO_MOVE_ONE_FRET <= note.time_start || note.time_start == 0) {
                    temp.push([i, guitar[i].indexOf(note.name), move]);
                }
            }
        }
    }
    let a = temp.sort(function (a, b) { return a[2] - b[2] }).map(x => [x[0], x[1]]);
    return a
}
</script>
