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




let a = transform({
  "header": {
    "keySignatures": [],
    "meta": [],
    "name": "",
    "ppq": 256,
    "tempos": [
      {
        "bpm": 100,
        "ticks": 0
      },
      {
        "bpm": 100,
        "ticks": 3072
      },
      {
        "bpm": 100,
        "ticks": 3072
      }
    ],
    "timeSignatures": []
  },
  "tracks": [
    {
      "channel": 0,
      "controlChanges": {},
      "pitchBends": [],
      "instrument": {
        "family": "piano",
        "number": 0,
        "name": "acoustic grand piano"
      },
      "name": "",
      "notes": [],
      "endOfTrackTicks": 30593
    },
    {
      "channel": 0,
      "controlChanges": {
        "7": [
          {
            "number": 7,
            "ticks": 0,
            "time": 0,
            "value": 0.7874015748031497
          }
        ],
        "10": [
          {
            "number": 10,
            "ticks": 0,
            "time": 0,
            "value": 0.5039370078740157
          }
        ],
        "64": [
          {
            "number": 64,
            "ticks": 0,
            "time": 0,
            "value": 0
          }
        ],
        "91": [
          {
            "number": 91,
            "ticks": 0,
            "time": 0,
            "value": 0.3779527559055118
          }
        ],
        "121": [
          {
            "number": 121,
            "ticks": 0,
            "time": 0,
            "value": 0
          }
        ]
      },
      "pitchBends": [],
      "instrument": {
        "family": "guitar",
        "number": 24,
        "name": "acoustic guitar (nylon)"
      },
      "name": "",
      "notes": [
        {
          "duration": 0.22499999999999998,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 0,
          "time": 0,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.8999999999999999,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 0,
          "time": 0,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.07500000000000001,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 96,
          "time": 0.22499999999999998,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.3,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 128,
          "time": 0.3,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.29999999999999993,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 256,
          "time": 0.6,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.2250000000000001,
          "durationTicks": 96,
          "midi": 73,
          "name": "C#5",
          "ticks": 384,
          "time": 0.8999999999999999,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.8999999999999999,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 384,
          "time": 0.8999999999999999,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.07499999999999996,
          "durationTicks": 32,
          "midi": 69,
          "name": "A4",
          "ticks": 480,
          "time": 1.125,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.30000000000000004,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 512,
          "time": 1.2,
          "velocity": 0.49606299212598426
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 640,
          "time": 1.5,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.2250000000000001,
          "durationTicks": 96,
          "midi": 64,
          "name": "E4",
          "ticks": 768,
          "time": 1.7999999999999998,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.8999999999999999,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 768,
          "time": 1.7999999999999998,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 864,
          "time": 2.025,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 896,
          "time": 2.1,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 1024,
          "time": 2.4,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.2250000000000001,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 1152,
          "time": 2.6999999999999997,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.6000000000000001,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 1152,
          "time": 2.6999999999999997,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 1248,
          "time": 2.925,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 1280,
          "time": 3,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 1408,
          "time": 3.3,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.2250000000000001,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 1536,
          "time": 3.5999999999999996,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 1536,
          "time": 3.5999999999999996,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 1632,
          "time": 3.8249999999999997,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.30000000000000027,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 1664,
          "time": 3.9,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 1792,
          "time": 4.2,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 68,
          "name": "G#4",
          "ticks": 1920,
          "time": 4.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.8999999999999995,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 1920,
          "time": 4.5,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 71,
          "name": "B4",
          "ticks": 2016,
          "time": 4.725,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 76,
          "name": "E5",
          "ticks": 2048,
          "time": 4.8,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 2176,
          "time": 5.1,
          "velocity": 0.4645669291338583
        },
        {
          "duration": 0.22500000000000053,
          "durationTicks": 96,
          "midi": 63,
          "name": "D#4",
          "ticks": 2304,
          "time": 5.3999999999999995,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 2304,
          "time": 5.3999999999999995,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 2304,
          "time": 5.3999999999999995,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 2400,
          "time": 5.625,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 71,
          "name": "B4",
          "ticks": 2432,
          "time": 5.7,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 63,
          "name": "D#4",
          "ticks": 2560,
          "time": 6,
          "velocity": 0.4881889763779528
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 2560,
          "time": 6,
          "velocity": 0.5118110236220472
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 2688,
          "time": 6.3,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 2688,
          "time": 6.3,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 256,
          "midi": 56,
          "name": "G#3",
          "ticks": 2688,
          "time": 6.3,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 3072,
          "time": 7.199999999999999,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 3072,
          "time": 7.199999999999999,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.07500000000000018,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 3168,
          "time": 7.424999999999999,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.2999999999999998,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 3200,
          "time": 7.499999999999999,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 3328,
          "time": 7.799999999999999,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 73,
          "name": "C#5",
          "ticks": 3456,
          "time": 8.1,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 3456,
          "time": 8.1,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 69,
          "name": "A4",
          "ticks": 3552,
          "time": 8.325,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 3584,
          "time": 8.399999999999999,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 3712,
          "time": 8.7,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 64,
          "name": "E4",
          "ticks": 3840,
          "time": 9,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 3840,
          "time": 9,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 3936,
          "time": 9.225,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 3968,
          "time": 9.299999999999999,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 4096,
          "time": 9.6,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 4224,
          "time": 9.899999999999999,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 4224,
          "time": 9.899999999999999,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 4320,
          "time": 10.125,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.5999999999999996,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 4352,
          "time": 10.2,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 4480,
          "time": 10.5,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 4608,
          "time": 10.799999999999999,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 4608,
          "time": 10.799999999999999,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.07500000000000107,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 4704,
          "time": 11.024999999999999,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 4736,
          "time": 11.1,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 4864,
          "time": 11.399999999999999,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 68,
          "name": "G#4",
          "ticks": 4992,
          "time": 11.7,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 4992,
          "time": 11.7,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.07500000000000107,
          "durationTicks": 32,
          "midi": 71,
          "name": "B4",
          "ticks": 5088,
          "time": 11.924999999999999,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 76,
          "name": "E5",
          "ticks": 5120,
          "time": 12,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 5248,
          "time": 12.299999999999999,
          "velocity": 0.44881889763779526
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 63,
          "name": "D#4",
          "ticks": 5376,
          "time": 12.599999999999998,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 5376,
          "time": 12.599999999999998,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 5376,
          "time": 12.599999999999998,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 5472,
          "time": 12.825,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 71,
          "name": "B4",
          "ticks": 5504,
          "time": 12.899999999999999,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 63,
          "name": "D#4",
          "ticks": 5632,
          "time": 13.2,
          "velocity": 0.4881889763779528
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 5632,
          "time": 13.2,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 5760,
          "time": 13.5,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 5760,
          "time": 13.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 56,
          "name": "G#3",
          "ticks": 5760,
          "time": 13.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 56,
          "name": "G#3",
          "ticks": 6144,
          "time": 14.399999999999999,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 50,
          "name": "D3",
          "ticks": 6144,
          "time": 14.399999999999999,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 59,
          "name": "B3",
          "ticks": 6240,
          "time": 14.625,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 6272,
          "time": 14.7,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 6400,
          "time": 15,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.22499999999999964,
          "durationTicks": 96,
          "midi": 56,
          "name": "G#3",
          "ticks": 6528,
          "time": 15.299999999999999,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.9000000000000004,
          "durationTicks": 384,
          "midi": 49,
          "name": "C#3",
          "ticks": 6528,
          "time": 15.299999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.07500000000000107,
          "durationTicks": 32,
          "midi": 59,
          "name": "B3",
          "ticks": 6624,
          "time": 15.524999999999999,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999893,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 6656,
          "time": 15.6,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 6784,
          "time": 15.899999999999999,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.22499999999999787,
          "durationTicks": 96,
          "midi": 59,
          "name": "B3",
          "ticks": 6912,
          "time": 16.2,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.9000000000000021,
          "durationTicks": 384,
          "midi": 52,
          "name": "E3",
          "ticks": 6912,
          "time": 16.2,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 7008,
          "time": 16.424999999999997,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 7040,
          "time": 16.5,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 7168,
          "time": 16.799999999999997,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.22499999999999787,
          "durationTicks": 96,
          "midi": 69,
          "name": "A4",
          "ticks": 7296,
          "time": 17.1,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 7296,
          "time": 17.1,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 64,
          "name": "E4",
          "ticks": 7392,
          "time": 17.325,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 7424,
          "time": 17.4,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 7552,
          "time": 17.7,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 61,
          "name": "C#4",
          "ticks": 7680,
          "time": 18,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 54,
          "name": "F#3",
          "ticks": 7680,
          "time": 18,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.07499999999999574,
          "durationTicks": 32,
          "midi": 64,
          "name": "E4",
          "ticks": 7776,
          "time": 18.225,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 70,
          "name": "A#4",
          "ticks": 7808,
          "time": 18.299999999999997,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 70,
          "name": "A#4",
          "ticks": 7936,
          "time": 18.6,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 71,
          "name": "B4",
          "ticks": 8064,
          "time": 18.9,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 50,
          "name": "D3",
          "ticks": 8064,
          "time": 18.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 8160,
          "time": 19.125,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 8192,
          "time": 19.2,
          "velocity": 0.49606299212598426
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 8320,
          "time": 19.5,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 8320,
          "time": 19.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 8448,
          "time": 19.799999999999997,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 8448,
          "time": 19.799999999999997,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 8544,
          "time": 20.025,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 8576,
          "time": 20.1,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 8704,
          "time": 20.4,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 8704,
          "time": 20.4,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 8704,
          "time": 20.4,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 49,
          "name": "C#3",
          "ticks": 8832,
          "time": 20.7,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 8832,
          "time": 20.7,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 8832,
          "time": 20.7,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 56,
          "name": "G#3",
          "ticks": 9216,
          "time": 21.599999999999998,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.9000000000000021,
          "durationTicks": 384,
          "midi": 50,
          "name": "D3",
          "ticks": 9216,
          "time": 21.599999999999998,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 59,
          "name": "B3",
          "ticks": 9312,
          "time": 21.825,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 9344,
          "time": 21.9,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 9472,
          "time": 22.2,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.22499999999999787,
          "durationTicks": 96,
          "midi": 56,
          "name": "G#3",
          "ticks": 9600,
          "time": 22.5,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 49,
          "name": "C#3",
          "ticks": 9600,
          "time": 22.5,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 59,
          "name": "B3",
          "ticks": 9696,
          "time": 22.724999999999998,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 9728,
          "time": 22.799999999999997,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 9856,
          "time": 23.099999999999998,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 59,
          "name": "B3",
          "ticks": 9984,
          "time": 23.4,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 52,
          "name": "E3",
          "ticks": 9984,
          "time": 23.4,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 10080,
          "time": 23.625,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 10112,
          "time": 23.7,
          "velocity": 0.7244094488188977
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 10240,
          "time": 24,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 69,
          "name": "A4",
          "ticks": 10368,
          "time": 24.299999999999997,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.9000000000000021,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 10368,
          "time": 24.299999999999997,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 64,
          "name": "E4",
          "ticks": 10464,
          "time": 24.525,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 10496,
          "time": 24.599999999999998,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 10624,
          "time": 24.9,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.22499999999999787,
          "durationTicks": 96,
          "midi": 61,
          "name": "C#4",
          "ticks": 10752,
          "time": 25.2,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.8999999999999986,
          "durationTicks": 384,
          "midi": 54,
          "name": "F#3",
          "ticks": 10752,
          "time": 25.2,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 64,
          "name": "E4",
          "ticks": 10848,
          "time": 25.424999999999997,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 70,
          "name": "A#4",
          "ticks": 10880,
          "time": 25.5,
          "velocity": 0.7322834645669292
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 70,
          "name": "A#4",
          "ticks": 11008,
          "time": 25.799999999999997,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.22500000000000142,
          "durationTicks": 96,
          "midi": 71,
          "name": "B4",
          "ticks": 11136,
          "time": 26.099999999999998,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 50,
          "name": "D3",
          "ticks": 11136,
          "time": 26.099999999999998,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 11232,
          "time": 26.325,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 11264,
          "time": 26.4,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 11392,
          "time": 26.7,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 11392,
          "time": 26.7,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.22499999999999787,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 11520,
          "time": 27,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 11520,
          "time": 27,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.07499999999999929,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 11616,
          "time": 27.224999999999998,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 11648,
          "time": 27.299999999999997,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 11776,
          "time": 27.599999999999998,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 11776,
          "time": 27.599999999999998,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 11776,
          "time": 27.599999999999998,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 49,
          "name": "C#3",
          "ticks": 11904,
          "time": 27.9,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 11904,
          "time": 27.9,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 11904,
          "time": 27.9,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 12288,
          "time": 28.799999999999997,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 12288,
          "time": 28.799999999999997,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12288,
          "time": 28.799999999999997,
          "velocity": 0.5118110236220472
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12416,
          "time": 29.099999999999998,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 12544,
          "time": 29.4,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 12544,
          "time": 29.4,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12544,
          "time": 29.4,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 12672,
          "time": 29.7,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.5999999999999979,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 12672,
          "time": 29.7,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12672,
          "time": 29.7,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12800,
          "time": 30,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 57,
          "name": "A3",
          "ticks": 12928,
          "time": 30.299999999999997,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 61,
          "name": "C#4",
          "ticks": 12928,
          "time": 30.299999999999997,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 12928,
          "time": 30.299999999999997,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.04921874999999787,
          "durationTicks": 21,
          "midi": 64,
          "name": "E4",
          "ticks": 13035,
          "time": 30.55078125,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 13056,
          "time": 30.599999999999998,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 13056,
          "time": 30.599999999999998,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13056,
          "time": 30.599999999999998,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 13184,
          "time": 30.9,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 13184,
          "time": 30.9,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13184,
          "time": 30.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 13312,
          "time": 31.2,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 13312,
          "time": 31.2,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.3000000000000007,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13312,
          "time": 31.2,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 62,
          "name": "D4",
          "ticks": 13440,
          "time": 31.5,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 13440,
          "time": 31.5,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13440,
          "time": 31.5,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13568,
          "time": 31.799999999999997,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 13696,
          "time": 32.099999999999994,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 13696,
          "time": 32.099999999999994,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13696,
          "time": 32.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 13824,
          "time": 32.4,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 69,
          "name": "A4",
          "ticks": 13824,
          "time": 32.4,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13824,
          "time": 32.4,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 13952,
          "time": 32.7,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 14080,
          "time": 33,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 14080,
          "time": 33,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 14080,
          "time": 33,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 14208,
          "time": 33.3,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 68,
          "name": "G#4",
          "ticks": 14208,
          "time": 33.3,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 14208,
          "time": 33.3,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 14336,
          "time": 33.599999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 14464,
          "time": 33.9,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 66,
          "name": "F#4",
          "ticks": 14464,
          "time": 33.9,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 14464,
          "time": 33.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 14592,
          "time": 34.2,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 14592,
          "time": 34.2,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 14592,
          "time": 34.2,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 14720,
          "time": 34.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 14720,
          "time": 34.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 14720,
          "time": 34.5,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 14848,
          "time": 34.8,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 14848,
          "time": 34.8,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 51,
          "name": "D#3",
          "ticks": 14848,
          "time": 34.8,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 14976,
          "time": 35.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 14976,
          "time": 35.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 52,
          "name": "E3",
          "ticks": 14976,
          "time": 35.099999999999994,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 15232,
          "time": 35.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 15232,
          "time": 35.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 15360,
          "time": 36,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 15360,
          "time": 36,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 15360,
          "time": 36,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 15488,
          "time": 36.3,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 15616,
          "time": 36.599999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 15616,
          "time": 36.599999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 15616,
          "time": 36.599999999999994,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 15744,
          "time": 36.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.6000000000000014,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 15744,
          "time": 36.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 15744,
          "time": 36.9,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 15872,
          "time": 37.2,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 57,
          "name": "A3",
          "ticks": 16000,
          "time": 37.5,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 61,
          "name": "C#4",
          "ticks": 16000,
          "time": 37.5,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16000,
          "time": 37.5,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.049218749999994316,
          "durationTicks": 21,
          "midi": 64,
          "name": "E4",
          "ticks": 16107,
          "time": 37.75078125,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 16128,
          "time": 37.8,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 16128,
          "time": 37.8,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16128,
          "time": 37.8,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 16256,
          "time": 38.099999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 16256,
          "time": 38.099999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16256,
          "time": 38.099999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 16384,
          "time": 38.4,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 16384,
          "time": 38.4,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.30000000000000426,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16384,
          "time": 38.4,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 62,
          "name": "D4",
          "ticks": 16512,
          "time": 38.7,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 16512,
          "time": 38.7,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16512,
          "time": 38.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16640,
          "time": 39,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 16768,
          "time": 39.3,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 16768,
          "time": 39.3,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 16768,
          "time": 39.3,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 16896,
          "time": 39.599999999999994,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 69,
          "name": "A4",
          "ticks": 16896,
          "time": 39.599999999999994,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 16896,
          "time": 39.599999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 17152,
          "time": 40.2,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 65,
          "name": "F4",
          "ticks": 17152,
          "time": 40.2,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 17280,
          "time": 40.5,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 17280,
          "time": 40.5,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 50,
          "name": "D3",
          "ticks": 17280,
          "time": 40.5,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 17408,
          "time": 40.8,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 66,
          "name": "F#4",
          "ticks": 17408,
          "time": 40.8,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 17536,
          "time": 41.099999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 17536,
          "time": 41.099999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 17664,
          "time": 41.39999999999999,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 17664,
          "time": 41.39999999999999,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 17664,
          "time": 41.39999999999999,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 17920,
          "time": 42,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 17920,
          "time": 42,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 17920,
          "time": 42,
          "velocity": 0.49606299212598426
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 49,
          "name": "C#3",
          "ticks": 18048,
          "time": 42.3,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 18048,
          "time": 42.3,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 18048,
          "time": 42.3,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 18432,
          "time": 43.2,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 18432,
          "time": 43.2,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 18528,
          "time": 43.425,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 18560,
          "time": 43.5,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 18688,
          "time": 43.8,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.22500000000000853,
          "durationTicks": 96,
          "midi": 73,
          "name": "C#5",
          "ticks": 18816,
          "time": 44.099999999999994,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 18816,
          "time": 44.099999999999994,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.07499999999998863,
          "durationTicks": 32,
          "midi": 69,
          "name": "A4",
          "ticks": 18912,
          "time": 44.325,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 18944,
          "time": 44.39999999999999,
          "velocity": 0.5039370078740157
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 19072,
          "time": 44.7,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 64,
          "name": "E4",
          "ticks": 19200,
          "time": 45,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 19200,
          "time": 45,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 19296,
          "time": 45.224999999999994,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 19328,
          "time": 45.3,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 19456,
          "time": 45.599999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.22500000000000853,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 19584,
          "time": 45.89999999999999,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 19584,
          "time": 45.89999999999999,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 19680,
          "time": 46.125,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 19712,
          "time": 46.2,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 19840,
          "time": 46.5,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 19968,
          "time": 46.8,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 19968,
          "time": 46.8,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 20064,
          "time": 47.02499999999999,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 20096,
          "time": 47.099999999999994,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 20224,
          "time": 47.39999999999999,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 68,
          "name": "G#4",
          "ticks": 20352,
          "time": 47.7,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 20352,
          "time": 47.7,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 71,
          "name": "B4",
          "ticks": 20448,
          "time": 47.925,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 76,
          "name": "E5",
          "ticks": 20480,
          "time": 48,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 20608,
          "time": 48.3,
          "velocity": 0.4566929133858268
        },
        {
          "duration": 0.22500000000000853,
          "durationTicks": 96,
          "midi": 63,
          "name": "D#4",
          "ticks": 20736,
          "time": 48.599999999999994,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 20736,
          "time": 48.599999999999994,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 20736,
          "time": 48.599999999999994,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.07499999999998863,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 20832,
          "time": 48.825,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 71,
          "name": "B4",
          "ticks": 20864,
          "time": 48.89999999999999,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 63,
          "name": "D#4",
          "ticks": 20992,
          "time": 49.2,
          "velocity": 0.49606299212598426
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 20992,
          "time": 49.2,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 21120,
          "time": 49.5,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 21120,
          "time": 49.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 56,
          "name": "G#3",
          "ticks": 21120,
          "time": 49.5,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 21504,
          "time": 50.39999999999999,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 21504,
          "time": 50.39999999999999,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 21504,
          "time": 50.39999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 21632,
          "time": 50.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 21760,
          "time": 51,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 21760,
          "time": 51,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 21760,
          "time": 51,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 21888,
          "time": 51.3,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 21888,
          "time": 51.3,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 21888,
          "time": 51.3,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22016,
          "time": 51.599999999999994,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 57,
          "name": "A3",
          "ticks": 22144,
          "time": 51.89999999999999,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 61,
          "name": "C#4",
          "ticks": 22144,
          "time": 51.89999999999999,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22144,
          "time": 51.89999999999999,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.049218750000008527,
          "durationTicks": 21,
          "midi": 64,
          "name": "E4",
          "ticks": 22251,
          "time": 52.150781249999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 22272,
          "time": 52.2,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 22272,
          "time": 52.2,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22272,
          "time": 52.2,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 22400,
          "time": 52.5,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 22400,
          "time": 52.5,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22400,
          "time": 52.5,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 22528,
          "time": 52.8,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 22528,
          "time": 52.8,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22528,
          "time": 52.8,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 62,
          "name": "D4",
          "ticks": 22656,
          "time": 53.099999999999994,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 22656,
          "time": 53.099999999999994,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22656,
          "time": 53.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22784,
          "time": 53.39999999999999,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 22912,
          "time": 53.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 22912,
          "time": 53.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 22912,
          "time": 53.7,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 23040,
          "time": 54,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 69,
          "name": "A4",
          "ticks": 23040,
          "time": 54,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23040,
          "time": 54,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23168,
          "time": 54.3,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 23296,
          "time": 54.599999999999994,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 23296,
          "time": 54.599999999999994,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23296,
          "time": 54.599999999999994,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 23424,
          "time": 54.89999999999999,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 68,
          "name": "G#4",
          "ticks": 23424,
          "time": 54.89999999999999,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23424,
          "time": 54.89999999999999,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23552,
          "time": 55.2,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 23680,
          "time": 55.5,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 66,
          "name": "F#4",
          "ticks": 23680,
          "time": 55.5,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23680,
          "time": 55.5,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 23808,
          "time": 55.8,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 23808,
          "time": 55.8,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 23808,
          "time": 55.8,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 23936,
          "time": 56.099999999999994,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 23936,
          "time": 56.099999999999994,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 23936,
          "time": 56.099999999999994,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 24064,
          "time": 56.39999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 24064,
          "time": 56.39999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 51,
          "name": "D#3",
          "ticks": 24064,
          "time": 56.39999999999999,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 24192,
          "time": 56.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 24192,
          "time": 56.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 52,
          "name": "E3",
          "ticks": 24192,
          "time": 56.7,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 24448,
          "time": 57.3,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 24448,
          "time": 57.3,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 24576,
          "time": 57.599999999999994,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 24576,
          "time": 57.599999999999994,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 24576,
          "time": 57.599999999999994,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 24704,
          "time": 57.89999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 24832,
          "time": 58.2,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 24832,
          "time": 58.2,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 24832,
          "time": 58.2,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 24960,
          "time": 58.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 24960,
          "time": 58.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 24960,
          "time": 58.5,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25088,
          "time": 58.8,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 57,
          "name": "A3",
          "ticks": 25216,
          "time": 59.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.25078125000000284,
          "durationTicks": 107,
          "midi": 61,
          "name": "C#4",
          "ticks": 25216,
          "time": 59.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25216,
          "time": 59.099999999999994,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.049218749999994316,
          "durationTicks": 21,
          "midi": 64,
          "name": "E4",
          "ticks": 25323,
          "time": 59.35078125,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 25344,
          "time": 59.39999999999999,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 25344,
          "time": 59.39999999999999,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25344,
          "time": 59.39999999999999,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 25472,
          "time": 59.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 25472,
          "time": 59.7,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25472,
          "time": 59.7,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 25600,
          "time": 60,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 25600,
          "time": 60,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25600,
          "time": 60,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 62,
          "name": "D4",
          "ticks": 25728,
          "time": 60.3,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 25728,
          "time": 60.3,
          "velocity": 0.6692913385826772
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25728,
          "time": 60.3,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25856,
          "time": 60.599999999999994,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 25984,
          "time": 60.89999999999999,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 25984,
          "time": 60.89999999999999,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 45,
          "name": "A2",
          "ticks": 25984,
          "time": 60.89999999999999,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 66,
          "name": "F#4",
          "ticks": 26112,
          "time": 61.2,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 69,
          "name": "A4",
          "ticks": 26112,
          "time": 61.2,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 26112,
          "time": 61.2,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 26368,
          "time": 61.8,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 65,
          "name": "F4",
          "ticks": 26368,
          "time": 61.8,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 26496,
          "time": 62.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 68,
          "name": "G#4",
          "ticks": 26496,
          "time": 62.099999999999994,
          "velocity": 0.6141732283464567
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 50,
          "name": "D3",
          "ticks": 26496,
          "time": 62.099999999999994,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 26624,
          "time": 62.39999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 66,
          "name": "F#4",
          "ticks": 26624,
          "time": 62.39999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 26752,
          "time": 62.7,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 62,
          "name": "D4",
          "ticks": 26752,
          "time": 62.7,
          "velocity": 0.5433070866141733
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 26880,
          "time": 63,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 61,
          "name": "C#4",
          "ticks": 26880,
          "time": 63,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 26880,
          "time": 63,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 50,
          "name": "D3",
          "ticks": 27136,
          "time": 63.599999999999994,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 27136,
          "time": 63.599999999999994,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 27136,
          "time": 63.599999999999994,
          "velocity": 0.5039370078740157
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 49,
          "name": "C#3",
          "ticks": 27264,
          "time": 63.89999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 57,
          "name": "A3",
          "ticks": 27264,
          "time": 63.89999999999999,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 27264,
          "time": 63.89999999999999,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 27648,
          "time": 64.8,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 27648,
          "time": 64.8,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 27744,
          "time": 65.02499999999999,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 27776,
          "time": 65.1,
          "velocity": 0.6614173228346457
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 27904,
          "time": 65.39999999999999,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 73,
          "name": "C#5",
          "ticks": 28032,
          "time": 65.7,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.8999999999999915,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 28032,
          "time": 65.7,
          "velocity": 0.5905511811023622
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 69,
          "name": "A4",
          "ticks": 28128,
          "time": 65.925,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 28160,
          "time": 66,
          "velocity": 0.5118110236220472
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 61,
          "name": "C#4",
          "ticks": 28288,
          "time": 66.3,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.22500000000000853,
          "durationTicks": 96,
          "midi": 64,
          "name": "E4",
          "ticks": 28416,
          "time": 66.6,
          "velocity": 0.6456692913385826
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 28416,
          "time": 66.6,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.07499999999998863,
          "durationTicks": 32,
          "midi": 62,
          "name": "D4",
          "ticks": 28512,
          "time": 66.825,
          "velocity": 0.5511811023622047
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 59,
          "name": "B3",
          "ticks": 28544,
          "time": 66.89999999999999,
          "velocity": 0.5669291338582677
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 56,
          "name": "G#3",
          "ticks": 28672,
          "time": 67.2,
          "velocity": 0.5984251968503937
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 28800,
          "time": 67.5,
          "velocity": 0.6299212598425197
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 45,
          "name": "A2",
          "ticks": 28800,
          "time": 67.5,
          "velocity": 0.6535433070866141
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 28896,
          "time": 67.725,
          "velocity": 0.6771653543307087
        },
        {
          "duration": 0.5999999999999943,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 28928,
          "time": 67.8,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 40,
          "name": "E2",
          "ticks": 29056,
          "time": 68.1,
          "velocity": 0.5590551181102362
        },
        {
          "duration": 0.22500000000000853,
          "durationTicks": 96,
          "midi": 57,
          "name": "A3",
          "ticks": 29184,
          "time": 68.39999999999999,
          "velocity": 0.6220472440944882
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 45,
          "name": "A2",
          "ticks": 29184,
          "time": 68.39999999999999,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 61,
          "name": "C#4",
          "ticks": 29280,
          "time": 68.625,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 29312,
          "time": 68.7,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 69,
          "name": "A4",
          "ticks": 29440,
          "time": 69,
          "velocity": 0.6929133858267716
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 68,
          "name": "G#4",
          "ticks": 29568,
          "time": 69.3,
          "velocity": 0.5748031496062992
        },
        {
          "duration": 0.9000000000000057,
          "durationTicks": 384,
          "midi": 40,
          "name": "E2",
          "ticks": 29568,
          "time": 69.3,
          "velocity": 0.5275590551181102
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 71,
          "name": "B4",
          "ticks": 29664,
          "time": 69.52499999999999,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 76,
          "name": "E5",
          "ticks": 29696,
          "time": 69.6,
          "velocity": 0.6850393700787402
        },
        {
          "duration": 0.30000000000001137,
          "durationTicks": 128,
          "midi": 64,
          "name": "E4",
          "ticks": 29824,
          "time": 69.89999999999999,
          "velocity": 0.44881889763779526
        },
        {
          "duration": 0.22499999999999432,
          "durationTicks": 96,
          "midi": 63,
          "name": "D#4",
          "ticks": 29952,
          "time": 70.2,
          "velocity": 0.5196850393700787
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 47,
          "name": "B2",
          "ticks": 29952,
          "time": 70.2,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 29952,
          "time": 70.2,
          "velocity": 0.7007874015748031
        },
        {
          "duration": 0.07500000000000284,
          "durationTicks": 32,
          "midi": 66,
          "name": "F#4",
          "ticks": 30048,
          "time": 70.425,
          "velocity": 0.6377952755905512
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 71,
          "name": "B4",
          "ticks": 30080,
          "time": 70.5,
          "velocity": 0.7086614173228346
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 63,
          "name": "D#4",
          "ticks": 30208,
          "time": 70.8,
          "velocity": 0.5039370078740157
        },
        {
          "duration": 0.29999999999999716,
          "durationTicks": 128,
          "midi": 57,
          "name": "A3",
          "ticks": 30208,
          "time": 70.8,
          "velocity": 0.5354330708661418
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 64,
          "name": "E4",
          "ticks": 30336,
          "time": 71.1,
          "velocity": 0.6062992125984252
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 52,
          "name": "E3",
          "ticks": 30336,
          "time": 71.1,
          "velocity": 0.5826771653543307
        },
        {
          "duration": 0.6000000000000085,
          "durationTicks": 256,
          "midi": 56,
          "name": "G#3",
          "ticks": 30336,
          "time": 71.1,
          "velocity": 0.5826771653543307
        }
      ]
    }
  ]
}
  , 1)
console.log(a);
