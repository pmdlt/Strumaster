
class Note {
  constructor(name, time_start, time_end) {
      this.name = name;
      this.time_start = time_start;
      this.time_end = time_end;
  }
  
}

const TIME_TO_MOVE_ONE_FRET = 120;

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
    let shift = possibilities[i][0]
    let tmp = chooseCord(possibilities[i][1])
    let miss_exist = tmp[1]
    let miss_speed = tmp[2]
    let instructions = tmp[0]
    //console.log(instructions.length);
    result.push([shift,instructions,miss_exist,miss_speed])
    
  }
  // keep the best result (the one with the most notes)
  
  result = result.reduce((a, b) => a[1].length > b[1].length ||(a[1].length == b[1].length && Math.abs(a[0])< Math.abs(b[0]))  ? a : b);
  
  console.log("%d notes will be played",result[1].length)
  if (result[1].length < notes.length){
    console.log("WARNING: %d notes will not be played : \n - %d because the rails cannot be moved fast enough \n - %d because they are not available for the guitar",notes.length-result[1].length,result[3],result[2])

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
          if (!exist){
            miss_exist++;
          }
          else {
            miss_speed++;
          }
      }
  }
  return [result, miss_exist,miss_speed]
}


function canPlay(note, used_until, position) {
  let temp = []
  // check if the note is in any cord to differencialte between:
  // - a note that is not in the guitar
  // - a note that cannot be played because it's too speed
  let exist=false;
  for (let i = 0; i < 6; i++) {
    // check if the note is in the cord
    if (guitar[i].includes(note.name)) {
      exist=true;
      // check if the cord is free
      if (note.time_start >= used_until[i]) {
          
              let move = guitar[i].indexOf(note.name) - position[i];
              // check if the move is possible or if it's the first note
              if (used_until[i] + move * TIME_TO_MOVE_ONE_FRET <= note.time_start || used_until[i] == 0) {
                  temp.push([i, guitar[i].indexOf(note.name), move]);
              }
          }
      }
  }
  let a = temp.sort(function (a, b) { return a[2] - b[2] }).map(x => [x[0], x[1]]);
  return [a,exist];
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
    "keySignatures": [],
    "meta": [],
    "name": "",
    "ppq": 384,
    "tempos": [
      {
        "bpm": 50,
        "ticks": 0
      }
    ],
    "timeSignatures": [
      {
        "ticks": 0,
        "timeSignature": [
          1,
          4
        ],
        "measures": 0
      }
    ]
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {},
      "pitchBends": [],
      "instrument": {
        "family": "guitar",
        "number": 24,
        "name": "acoustic guitar (nylon)"
      },
      "name": "Acoustic Guitar",
      "notes": [
        {
          "duration": 0.6,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 0,
          "time": 0,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 0,
          "time": 0,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 0,
          "time": 0,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999999,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 384,
          "time": 1.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999999,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 384,
          "time": 1.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999999,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 384,
          "time": 1.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999997,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 768,
          "time": 2.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999997,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 768,
          "time": 2.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999997,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 768,
          "time": 2.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 1344,
          "time": 4.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 1344,
          "time": 4.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 1344,
          "time": 4.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000005,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 1728,
          "time": 5.3999999999999995,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000005,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 1728,
          "time": 5.3999999999999995,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000005,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 1728,
          "time": 5.3999999999999995,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 2112,
          "time": 6.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 2112,
          "time": 6.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 2112,
          "time": 6.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.200000000000001,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 2304,
          "time": 7.199999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.200000000000001,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 2304,
          "time": 7.199999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.200000000000001,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 2304,
          "time": 7.199999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 3072,
          "time": 9.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 3072,
          "time": 9.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 3072,
          "time": 9.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 3456,
          "time": 10.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 3456,
          "time": 10.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 3456,
          "time": 10.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 3840,
          "time": 12,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 3840,
          "time": 12,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 3840,
          "time": 12,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 4416,
          "time": 13.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 4416,
          "time": 13.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 4416,
          "time": 13.799999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 4800,
          "time": 15,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 4800,
          "time": 15,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 4800,
          "time": 15,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 6144,
          "time": 19.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 6144,
          "time": 19.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 6144,
          "time": 19.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 6528,
          "time": 20.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 6528,
          "time": 20.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 6528,
          "time": 20.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 6912,
          "time": 21.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 6912,
          "time": 21.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 6912,
          "time": 21.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 7488,
          "time": 23.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 7488,
          "time": 23.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 7488,
          "time": 23.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 7872,
          "time": 24.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 7872,
          "time": 24.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 7872,
          "time": 24.599999999999998,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 8256,
          "time": 25.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 8256,
          "time": 25.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 8256,
          "time": 25.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 8448,
          "time": 26.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 8448,
          "time": 26.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 8448,
          "time": 26.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 9216,
          "time": 28.799999999999997,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 9216,
          "time": 28.799999999999997,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 9216,
          "time": 28.799999999999997,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 9600,
          "time": 30,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 9600,
          "time": 30,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 9600,
          "time": 30,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 9984,
          "time": 31.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 9984,
          "time": 31.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999993,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 9984,
          "time": 31.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 10560,
          "time": 33,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 10560,
          "time": 33,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 10560,
          "time": 33,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 10944,
          "time": 34.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 10944,
          "time": 34.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 10944,
          "time": 34.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 12288,
          "time": 38.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 12288,
          "time": 38.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 12288,
          "time": 38.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 12672,
          "time": 39.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 12672,
          "time": 39.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 12672,
          "time": 39.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 13056,
          "time": 40.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 13056,
          "time": 40.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 13056,
          "time": 40.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 13632,
          "time": 42.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 13632,
          "time": 42.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 13632,
          "time": 42.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 14016,
          "time": 43.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 14016,
          "time": 43.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 14016,
          "time": 43.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 14400,
          "time": 45,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 14400,
          "time": 45,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 14400,
          "time": 45,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 14592,
          "time": 45.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 14592,
          "time": 45.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 14592,
          "time": 45.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 15360,
          "time": 48,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 15360,
          "time": 48,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 15360,
          "time": 48,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 15744,
          "time": 49.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 15744,
          "time": 49.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 15744,
          "time": 49.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 16128,
          "time": 50.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 16128,
          "time": 50.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 16128,
          "time": 50.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 16704,
          "time": 52.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 16704,
          "time": 52.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 16704,
          "time": 52.199999999999996,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 17088,
          "time": 53.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 17088,
          "time": 53.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 17088,
          "time": 53.4,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 18432,
          "time": 57.599999999999994,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 18432,
          "time": 57.599999999999994,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 18432,
          "time": 57.599999999999994,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 18816,
          "time": 58.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 18816,
          "time": 58.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 18816,
          "time": 58.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 19200,
          "time": 60,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 19200,
          "time": 60,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999957,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 19200,
          "time": 60,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 19776,
          "time": 61.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 19776,
          "time": 61.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 19776,
          "time": 61.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 20160,
          "time": 63,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 20160,
          "time": 63,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 20160,
          "time": 63,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 20544,
          "time": 64.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 20544,
          "time": 64.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 20544,
          "time": 64.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 20736,
          "time": 64.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 20736,
          "time": 64.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 20736,
          "time": 64.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 21504,
          "time": 67.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 21504,
          "time": 67.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 21504,
          "time": 67.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 21888,
          "time": 68.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 21888,
          "time": 68.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 21888,
          "time": 68.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 22272,
          "time": 69.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 22272,
          "time": 69.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 22272,
          "time": 69.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 22848,
          "time": 71.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 22848,
          "time": 71.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 22848,
          "time": 71.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 23232,
          "time": 72.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 23232,
          "time": 72.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 23232,
          "time": 72.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 24576,
          "time": 76.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 24576,
          "time": 76.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 24576,
          "time": 76.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 24960,
          "time": 78,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 24960,
          "time": 78,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 24960,
          "time": 78,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 25344,
          "time": 79.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 25344,
          "time": 79.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 25344,
          "time": 79.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 25920,
          "time": 81,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 25920,
          "time": 81,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 25920,
          "time": 81,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 26304,
          "time": 82.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 26304,
          "time": 82.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 26304,
          "time": 82.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 26688,
          "time": 83.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 26688,
          "time": 83.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 26688,
          "time": 83.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 26880,
          "time": 84,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 26880,
          "time": 84,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 26880,
          "time": 84,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 27648,
          "time": 86.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 27648,
          "time": 86.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 27648,
          "time": 86.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 28032,
          "time": 87.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 28032,
          "time": 87.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 28032,
          "time": 87.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 28416,
          "time": 88.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 28416,
          "time": 88.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 28416,
          "time": 88.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 28992,
          "time": 90.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 28992,
          "time": 90.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 28992,
          "time": 90.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 29376,
          "time": 91.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 29376,
          "time": 91.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 29376,
          "time": 91.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 30720,
          "time": 96,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 30720,
          "time": 96,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 30720,
          "time": 96,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 31104,
          "time": 97.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 31104,
          "time": 97.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 31104,
          "time": 97.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 31488,
          "time": 98.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 31488,
          "time": 98.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 31488,
          "time": 98.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 32064,
          "time": 100.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 32064,
          "time": 100.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 32064,
          "time": 100.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 32448,
          "time": 101.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 32448,
          "time": 101.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 46,
          "name": "A#2",
          "ticks": 32448,
          "time": 101.39999999999999,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 49,
          "name": "C#3",
          "ticks": 32832,
          "time": 102.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 56,
          "name": "G#3",
          "ticks": 32832,
          "time": 102.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 61,
          "name": "C#4",
          "ticks": 32832,
          "time": 102.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 33024,
          "time": 103.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 33024,
          "time": 103.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.1999999999999886,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 33024,
          "time": 103.2,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 33792,
          "time": 105.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 33792,
          "time": 105.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 33792,
          "time": 105.6,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 58,
          "name": "A#3",
          "ticks": 34176,
          "time": 106.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 53,
          "name": "F3",
          "ticks": 34176,
          "time": 106.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 34176,
          "time": 106.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 55,
          "name": "G3",
          "ticks": 34560,
          "time": 108,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 48,
          "name": "C3",
          "ticks": 34560,
          "time": 108,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 1.2000000000000028,
          "durationTicks": 384,
          "midi": 60,
          "name": "C4",
          "ticks": 34560,
          "time": 108,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 50,
          "name": "D3",
          "ticks": 35136,
          "time": 109.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 55,
          "name": "G3",
          "ticks": 35136,
          "time": 109.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 192,
          "midi": 43,
          "name": "G2",
          "ticks": 35136,
          "time": 109.8,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 55,
          "name": "G3",
          "ticks": 35520,
          "time": 111,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 50,
          "name": "D3",
          "ticks": 35520,
          "time": 111,
          "velocity": 0.3937007874015748
        },
        {
          "duration": 3,
          "durationTicks": 960,
          "midi": 43,
          "name": "G2",
          "ticks": 35520,
          "time": 111,
          "velocity": 0.3937007874015748
        }
      ],
      "endOfTrackTicks": 36480
    }
  ]
} , 0)
//console.log(a);
