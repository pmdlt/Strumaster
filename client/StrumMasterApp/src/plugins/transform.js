

class Note {
    constructor(name, time_start, time_end) {
        this.name = name;
        this.time_start = time_start;
        this.time_end = time_end;
    }

}
    

let guitar = [
    ["E","F","F#","G","G#","A","A#","B","C","C#"],//,"D","D#"],
    ["B","C","C#","D","D#","E","F","F#","G","G#"],//,"A","A#"],
    ["G","G#","A","A#","B","C","C#","D","D#","E"],//,"F","F#"],
    ["D","D#","E","F","F#","G","G#","A","A#","B"],//,"C","C#"],
    ["A","A#","B","C","C#","D","D#","E","F","F#"],//,"G","G#"],
    ["E","F","F#","G","G#","A","A#","B","C","C#"],//,"D","D#"],
    ]


// take a json object and return a csv string

function transform (json) {

    

  console.log(json['notes'])
  notes = []

  for (let i = 0; i < json['notes'].length; i++) {
    let note = json['notes'][i]
    let time_start = note['time']
    let time_end = time_start + note['duration']
    let name = note['name'].replace(/\d+/g, '');// to do: handle octave
    notes.push(new Note (name, time_start, time_end))
  }

  result= chooseCord(notes)
  // convert to csv
    csv = ""
    for (let i = 0; i < result.length; i++) {
        csv += result[i][1] + "," + result[i][0] + "\n"
    }
    return csv



}

// the choose cord function should take a list of note(name, time_start, time_end) and using the list guitar, 
//return for each note the indexes i in the list guitar and the position j in the list guitar[i] of the note 
// so that guitar[i][j] == note.name and 

function chooseCord(notes) {
    let position = [0,0,0,0,0,0]
    let used_until = [0,0,0,0,0,0]
    time = 0
    result = []
    for (let i = 0; i < notes.length; i++) {
        a = canPlay(notes[i], used_until, position);
        if (a.length > 0) {
            result.push([a[0][0]*10 + a[0][1], notes[i].time_start]);
            position[a[0][0]] = a[0][1];
            used_until[a[0][0]] = notes[i].time_end;
        }
        else {
            console.log("ERROR: can't play note " + notes[i].name + " at time " + notes[i].time_start);
        }
    }
    return result
  }


function canPlay(note, used_until,position) {
    temp= []
    for (let i = 0; i < 6; i++) {
        if (note.time_start >= used_until[i]) {
            if (guitar[i].includes(note.name)) {
                let move = guitar[i].indexOf(note.name) - position[i];
                temp.push([i, guitar[i].indexOf(note.name), move]);
            
            }
        }
    }
    a=temp.sort(function(a, b){return a[2] - b[2]}).map(x => [x[0], x[1]]);
    return a
}
  



a= transform({
    "key": "C",
    "scale": "major",
    "notes": [
          {
            "duration": 0.75,
            "name": "A3",
            "time": 5.25,
            "velocity": 0.6929133858267716
          },
               {
            "duration": 0.394874057291668,
            "name": "E4",
            "time": 13.056699765625002,
            "velocity": 0.7165354330708661
          },
          ]
    
  })
  console.log(a);
