
class Note {
  constructor(name, time_start, time_end) {
      this.name = name;
      this.time_start = time_start;
      this.time_end = time_end;
  }
  
}

const TIME_TO_MOVE_ONE_FRET = 160;

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
  "C#5","C5",
  "B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4",
  "B3","A#3","A3","G#3","G3","F#3","F3","E3","D#3","D3","C#3","C3",
  "B2","A#2","A2","G#2","G2","F#2","F2"]

const ALL_EXISITING_NOTES = [
  "B7","A#7","A7","G#7","G7","F#7","F7","E7","D#7","D7","C#7","C7",
  "B6","A#6","A6","G#6","G6","F#6","F6","E6","D#6","D6","C#6","C6",
  "B5","A#5","A5","G#5","G5","F#5","F5","E5","D#5","D5","C#5","C5",
  "B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4",
  "B3","A#3","A3","G#3","G3","F#3","F3","E3","D#3","D3","C#3","C3",
  "B2","A#2","A2","G#2","G2","F#2","F2","E2","D#2","D2","C#2","C2",
  "B1","A#1","A1","G#1","G1","F#1","F1","E1","D#1","D1","C#1","C1",
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
  for(let i = 0; i < possibilities.length; i++){
    //console.log(possibilities[i]);
    let tmp = chooseCord(possibilities[i][1])
    //console.log(tmp.length);
    result.push([possibilities[i][0],tmp])
    
  }
  // keep the best result (the one with the most notes)
  
  result = result.reduce((a, b) => a[1].length > b[1].length ||(a[1].length == b[1].length && Math.abs(a[0])< Math.abs(b[0]))  ? a : b);
  if (result[1].length < notes.length){
    console.log("WARNING: %d notes will not be played", notes.length - result[1].length)
  }
  else {
    console.log("All notes will be played")
  }

  if (result[0] != 0){
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
  for (let i = 0; i < notes.length; i++) {
      let a = canPlay(notes[i], used_until, position);
      if (a.length > 0) {
          result.push([a[0][0] * 10 + a[0][1], notes[i].time_start, notes[i].time_end]);
          position[a[0][0]] = a[0][1];
          // console.log(position,a[0][0],notes[i].time_start,notes[i].time_end);
          // console.log(used_until.map(x => x>notes[i].time_start));
          used_until[a[0][0]] = notes[i].time_end;
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
              if (used_until[i] + move * TIME_TO_MOVE_ONE_FRET <= note.time_start || used_until[i] == 0) {
                  temp.push([i, guitar[i].indexOf(note.name), move]);
              }
          }
      }
  }
  let a = temp.sort(function (a, b) { return a[2] - b[2] }).map(x => [x[0], x[1]]);
  return a
}

/**
 * 
 * @param {[Note]} notes the notes to translate
 * 
 * @returns {[[Note]]} a list of all possible translations of the notes
 */
function translate(notes){
  let highest_note = getHighestNote(notes)
  let highest_idx = ALL_EXISITING_NOTES.indexOf(highest_note.name)
  let result = []
  for(let i = 0; i < ALL_EXISITING_NOTES.length; i++){ // for each possible note
    let shift = i - highest_idx
    //console.log(shift);
    let translated_notes = []
    for(let j = 0; j < notes.length; j++){ // for each note
      let note = notes[j]
      if (POSSIBLE_NOTES.indexOf(note.name) + shift < 0 || POSSIBLE_NOTES.indexOf(note.name) + shift > POSSIBLE_NOTES.length){
        continue
      }
      translated_notes.push(new Note(POSSIBLE_NOTES[POSSIBLE_NOTES.indexOf(note.name) + shift], note.time_start, note.time_end))
    }
    
    result.push([shift,translated_notes])
  }

  return result

    
    

} 


function getHighestNote(notes){
  // get the note in notes with the smallest index in POSSIBLE_NOTES
  return notes.reduce((a, b) => ALL_EXISITING_NOTES.indexOf(a.name) < ALL_EXISITING_NOTES.indexOf(b.name) ? a : b);    
}




let a = transform({
  "header": {
    "PPQ": 384,
    "timeSignature": [
      1,
      4
    ],
    "bpm": 110.00011000011,
    "name": ""
  },
  "tempo": [
    {
      "absoluteTime": 0,
      "seconds": 0,
      "bpm": 110.00011000011
    }
  ],
  "timeSignature": [
    {
      "absoluteTime": 0,
      "seconds": 0,
      "numerator": 1,
      "denominator": 2,
      "click": 24,
      "notesQ": 8
    }
  ],
  "startTime": 0,
  "duration": 71.99992799999997,
  "tracks": [
    {
      "startTime": 0,
      "duration": 0,
      "length": 0,
      "notes": [],
      "controlChanges": {},
      "id": 0
    },
    {
      "startTime": 0,
      "duration": 71.99992799999997,
      "length": 33,
      "notes": [
        {
          "name": "C5",
          "midi": 73,
          "time": 0,
          "velocity": 0.3937007874015748,
          "duration": 2.181816
        },
        {
          "name": "C5",
          "midi": 72,
          "time": 2.181816,
          "velocity": 0.3937007874015748,
          "duration": 2.181816
        },
        {
          "name": "B4",
          "midi": 71,
          "time": 4.363632,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000004
        },
        {
          "name": "A#4",
          "midi": 70,
          "time": 6.545448,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999995
        },
        {
          "name": "A4",
          "midi": 69,
          "time": 8.727264,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999995
        },
        {
          "name": "G#4",
          "midi": 68,
          "time": 10.90908,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999995
        },
        {
          "name": "G4",
          "midi": 67,
          "time": 13.090895999999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999995
        },
        {
          "name": "F#4",
          "midi": 66,
          "time": 15.272711999999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "F4",
          "midi": 65,
          "time": 17.454528,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "E4",
          "midi": 64,
          "time": 19.636344,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "D#4",
          "midi": 63,
          "time": 21.818160000000002,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "D4",
          "midi": 62,
          "time": 23.999976000000004,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "C#4",
          "midi": 61,
          "time": 26.181792000000005,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "C4",
          "midi": 60,
          "time": 28.363608000000006,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "B3",
          "midi": 59,
          "time": 30.545424000000008,
          "velocity": 0.3937007874015748,
          "duration": 2.1818160000000013
        },
        {
          "name": "A#3",
          "midi": 58,
          "time": 32.72724000000001,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "A3",
          "midi": 57,
          "time": 34.90905600000001,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "G#3",
          "midi": 56,
          "time": 37.090872000000005,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "G3",
          "midi": 55,
          "time": 39.272688,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "F#3",
          "midi": 54,
          "time": 41.454504,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "F3",
          "midi": 53,
          "time": 43.63632,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "E3",
          "midi": 52,
          "time": 45.818135999999996,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "D#3",
          "midi": 51,
          "time": 47.99995199999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "D3",
          "midi": 50,
          "time": 50.18176799999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "C#3",
          "midi": 49,
          "time": 52.36358399999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "C3",
          "midi": 48,
          "time": 54.54539999999999,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "B2",
          "midi": 47,
          "time": 56.727215999999984,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "A#2",
          "midi": 46,
          "time": 58.90903199999998,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "A2",
          "midi": 45,
          "time": 61.09084799999998,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "G#2",
          "midi": 44,
          "time": 63.27266399999998,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "G2",
          "midi": 43,
          "time": 65.45447999999998,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "F#2",
          "midi": 42,
          "time": 67.63629599999997,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        },
        {
          "name": "F#2",
          "midi": 41,
          "time": 69.81811199999997,
          "velocity": 0.3937007874015748,
          "duration": 2.1818159999999978
        }
      ],
      "controlChanges": {},
      "id": 1,
      "name": "Electric Piano",
      "instrumentNumber": 0,
      "instrument": "acoustic grand piano",
      "instrumentFamily": "piano",
      "channelNumber": 0,
      "isPercussion": false
    }
  ]
}
  , 1)
console.log(a);
