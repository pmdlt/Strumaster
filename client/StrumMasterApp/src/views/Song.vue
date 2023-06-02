<template>
    <v-app id="inspire">
        <v-main class="bg-grey-lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="3">
                        <v-sheet rounded="lg" :elevation="10">
                            <the-menu-bar />
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" sm="9">
                        <v-sheet rounded="lg" :elevation="10">
                            <v-container>
                                <v-form ref="form">
                                    <p class="text-center">Insert a midi file to be played by the guitar:<br><br></p>
                                    <v-file-input label="MIDI File" variant="outlined" @change="loadFile"></v-file-input>

                                    <p class="text-center">or select it from the list:<br><br></p>

                                    <v-autocomplete label="Pre-selection of songs" v-model="midi_selection"
                                        :items="['gamme_debug_10bpm', 'gamme_debug_20bpm']"
                                        variant="outlined"></v-autocomplete>

                                    <p class="text-center">Parameters:</p>

                                    <v-slider v-model="channel" :min="0" :max="16" :step="1" thumb-label
                                        label="MIDI Channel"></v-slider>
                                    <v-text-field v-model="timeToMove" label="Time to move one fret"
                                        variant="outlined"></v-text-field>

                                    <v-slider v-model="speed" :min="0" :max="100" thumb-label label="Speed"></v-slider>

                                    <v-btn @click="loadSong" block prepend-icon="mdi-upload" class="mt-2"
                                        :loading="loading">Upload the
                                        song into the
                                        guitar</v-btn>
                                    <v-btn @click="playSong" block prepend-icon="mdi-play" size="large" class="mt-2">Play
                                        song</v-btn>
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
        loading: false,
        timeToMove: 180,
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
            const url = "https://strumaster.netlify.app/midi/" + this.midi_selection + ".mid";
            console.log("1. Loading MIDI from: " + url);
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
            this.loading = true;
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
                body: this.notes,
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
                .finally(() => {
                    this.loading = false;
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

// const TIME_TO_MOVE_ONE_FRET = 120;

const TIME_NOTE = 500;

const guitar = [
    ["F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3"],
    ["A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3"],
    ["D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"],
    ["G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4"],
    ["C3", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4"],
    ["F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5"],
]

const POSSIBLE_NOTES = [
    "C#5", "C5",
    "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4",
    "B3", "A#3", "A3", "G#3", "G3", "F#3", "F3", "E3", "D#3", "D3", "C#3", "C3",
    "B2", "A#2", "A2", "G#2", "G2", "F#2", "F2"]

const ALL_EXISITING_NOTES = [
    "B7", "A#7", "A7", "G#7", "G7", "F#7", "F7", "E7", "D#7", "D7", "C#7", "C7",
    "B6", "A#6", "A6", "G#6", "G6", "F#6", "F6", "E6", "D#6", "D6", "C#6", "C6",
    "B5", "A#5", "A5", "G#5", "G5", "F#5", "F5", "E5", "D#5", "D5", "C#5", "C5",
    "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C#4", "C4",
    "B3", "A#3", "A3", "G#3", "G3", "F#3", "F3", "E3", "D#3", "D3", "C#3", "C3",
    "B2", "A#2", "A2", "G#2", "G2", "F#2", "F2", "E2", "D#2", "D2", "C#2", "C2",
    "B1", "A#1", "A1", "G#1", "G1", "F#1", "F1", "E1", "D#1", "D1", "C#1", "C1",
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
        let name = note['name']//.replace(/\d+/g, '');// to do: handle octave
        notes.push(new Note(name, time_start, time_end))
    }

    let possibilities = translate(notes)
    let result = []
    for (let i = 0; i < possibilities.length; i++) {
        //console.log(possibilities[i]);
        let shift = possibilities[i][0]
        let tmp = chooseCord(possibilities[i][1])
        let miss_exist = tmp[1]
        let miss_speed = tmp[2]
        let instructions = tmp[0]
        //console.log(instructions.length);
        result.push([shift, instructions, miss_exist, miss_speed])

    }
    // keep the best result (the one with the most notes)

    result = result.reduce((a, b) => a[1].length > b[1].length || (a[1].length == b[1].length && Math.abs(a[0]) < Math.abs(b[0])) ? a : b);

    console.log("%d notes will be played", result[1].length)
    if (result[1].length < notes.length) {
        console.log("WARNING: %d notes will not be played : \n - %d because the rails cannot be moved fast enough \n - %d because they are not available for the guitar", notes.length - result[1].length, result[3], result[2])

    }
    else {
        console.log("All notes will be played")
    }


    if (result[0] != 0) {
        console.log("Note: the guitar will be shifted by %d frets", result[0])

    }
    else {
        console.log("The guitar will not be shifted")
    }


    // convert to csv
    let csv = "time_start,time_end,id\n"
    for (let i = 0; i < result[1].length; i++) {
        csv += result[1][i][1] + "," + result[1][i][2] + "," + result[1][i][0] + "\n"
    }
    return csv

}

function chooseCord(notes) {
    let position = [0, 0, 0, 0, 0, 0]
    let used_until = [0, 0, 0, 0, 0, 0]
    let result = []
    let miss_speed = 0
    let miss_exist = 0
    for (let i = 0; i < notes.length; i++) {
        let tmp = canPlay(notes[i], used_until, position);
        let a = tmp[0];
        let exist = tmp[1];

        if (a.length > 0) {
            result.push([a[0][0] * 10 + a[0][1], notes[i].time_start, notes[i].time_end]);
            position[a[0][0]] = a[0][1];
            // console.log(position,a[0][0],notes[i].time_start,notes[i].time_end);
            // console.log(used_until.map(x => x>notes[i].time_start));
            used_until[a[0][0]] = notes[i].time_end;
        }
        else {
            //console.log("WARNING: note %s from %dms (to %dms) will not be played",notes[i].name,notes[i].time_start);
            if (!exist) {
                miss_exist++;
            }
            else {
                miss_speed++;
            }
        }
    }
    return [result, miss_exist, miss_speed]
}


function canPlay(note, used_until, position) {
    let temp = []
    // check if the note is in any cord to differencialte between:
    // - a note that is not in the guitar
    // - a note that cannot be played because it's too speed
    let exist = false;
    for (let i = 0; i < 6; i++) {
        // check if the note is in the cord
        if (guitar[i].includes(note.name)) {
            exist = true;
            // check if the cord is free
            if (note.time_start >= used_until[i]) {

                let move = guitar[i].indexOf(note.name) - position[i];
                // check if the move is possible or if it's the first note
                if (used_until[i] + move * this.timeToMove <= note.time_start || used_until[i] == 0) {
                    temp.push([i, guitar[i].indexOf(note.name), move]);
                }
            }
        }
    }
    let a = temp.sort(function (a, b) { return a[2] - b[2] }).map(x => [x[0], x[1]]);
    return [a, exist];
}

/**
 * 
 * @param {[Note]} notes the notes to translate
 * 
 * @returns {[[Note]]} a list of all possible translations of the notes
 */
function translate(notes) {
    let highest_note = getHighestNote(notes)
    let highest_idx = ALL_EXISITING_NOTES.indexOf(highest_note.name)
    let result = []
    for (let i = 0; i < ALL_EXISITING_NOTES.length; i++) { // for each possible note
        let shift = i - highest_idx
        //console.log(shift);
        let translated_notes = []
        for (let j = 0; j < notes.length; j++) { // for each note
            let note = notes[j]
            if (POSSIBLE_NOTES.indexOf(note.name) + shift < 0 || POSSIBLE_NOTES.indexOf(note.name) + shift > POSSIBLE_NOTES.length) {
                continue
            }
            translated_notes.push(new Note(POSSIBLE_NOTES[POSSIBLE_NOTES.indexOf(note.name) + shift], note.time_start, note.time_end))
        }

        result.push([shift, translated_notes])
    }

    return result




}


function getHighestNote(notes) {
    // get the note in notes with the smallest index in POSSIBLE_NOTES
    return notes.reduce((a, b) => ALL_EXISITING_NOTES.indexOf(a.name) < ALL_EXISITING_NOTES.indexOf(b.name) ? a : b);
}

</script>
