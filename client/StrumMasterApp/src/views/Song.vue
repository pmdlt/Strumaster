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
                                    <p class="text-center">Insert a midi file to be played by the guitar:<br><br></p>
                                    <v-file-input label="MIDI File" variant="solo" @change="loadFile"></v-file-input>

                                    <p class="text-center">or select it from the list:<br><br></p>

                                    <v-autocomplete label="Pre-selection of songs" v-model="midi_selection"
                                        :items="['note_scale_for_debug_10bpm', 'note_scale_for_debug_20bpm']"
                                        variant="solo"></v-autocomplete>

                                    <p class="text-center">Parameters:</p>

                                    <v-slider v-model="channel" :min="0" :max="16" :step="1" thumb-label
                                        label="MIDI Channel"></v-slider>

                                    <v-slider v-model="speed" :min="0" :max="100" thumb-label label="Speed"></v-slider>

                                    <v-btn @click="loadSong" block prepend-icon="mdi-upload" class="mt-2">Upload the
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
        midi_selection: null,
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
                    console.log("2. File transforming to MIDI...");
                    const MIDIfile = new Midi(e.target.result);
                    this.createSong(MIDIfile);
                }
                reader.readAsArrayBuffer(file);
            }

        },
        async loadSelection() {
            console.log("1. Selection provided, loading...");
            const url = "https://strumaster.netlify.app/midi/" + this.midi_selection + ".mid";
            const MIDIfile = await Midi.fromUrl(url)
            console.log("2. File transforming to MIDI...");
            this.createSong(MIDIfile);
        },
        createSong(MIDIfile) {
            const MIDIjson = MIDIfile.toJSON();
            console.log("MIDI File:", MIDIjson);

            console.log("3. File transforming to notes...");
            const transformed = transform(MIDIjson, this.channel);
            console.log("Notes:", '\n', transformed);

            this.notes = transformed;
            console.log("4. File transformed and ready to be sent");
        },
        async loadSong() {
            console.log("Load song button clicked");

            if (this.midi_selection != null) {
                await this.loadSelection();
            }
            if (this.notes == null) {
                this.showSnackbar('The file provided cannot be transformed and played', 'error')
                return;
            }

            const url = `http://192.168.174.140/load_song`;
            console.log("Sending POST request to: " + url);

            fetch(url, {
                method: "POST",
                body: csvForDebug
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
    ["F7", "F#7", "G7", "G#7", "A6", "A#6", "B6", "C6", "C#6"],//,"D","D#"],
    ["A#6", "B6", "C6", "C#6", "D5", "D#5", "E5", "F5", "F#5"],//,"G","G#"],
    ["D#5", "E5", "F5", "F#5", "G4", "G#4", "A4", "A#4", "B3"],//,"C","C#"],
    ["G#4", "A4", "A#4", "B3", "C3", "C#3", "D3", "D#3", "E2"],//,"F","F#"],
    ["C3", "C#3", "D3", "D#3", "E2", "F2", "F#2", "G2", "G#2"],//,"A","A#"],
    ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C2", "C#2"],//,"D","D#"],

]

const csvForDebug = "time_start,time_end,id\n0,1000,40\n1000,2000,40\n0,2000,3000,40\n3000,4000,42\n4000,6000,44\n6000,8000,42\n8000,9000,40\n9000,10000,44\n10000,11000,42\n11000,12000,42\n12000,14000,40\n";


// take a json object and return a csv string

function transform(json, track_number) {


    json = json['tracks'][track_number]


    let notes = []
    let GLOBAL_START_TIME = json['notes'][0]['time'] - 2000

    for (let i = 0; i < json['notes'].length; i++) {
        let note = json['notes'][i]
        let time_start = Math.floor(note['time'] * 1000 - GLOBAL_START_TIME)
        let time_end = Math.floor(time_start + Math.min(note['duration'] * 1000, TIME_NOTE) - GLOBAL_START_TIME)
        let name = note['name']//.replace(/\d+/g, '');// to do: handle octave
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
