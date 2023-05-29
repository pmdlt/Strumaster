#include <CSV_Parser.h>
#include <ArduinoQueue.h>

// ms
// As sometimes one note finish at the same time than another note should begin, we decided to fix the duration of 
// each note, so that the note is played, but the stepper isn't blocked by it for too long
#define NOTE_DURATION 300

typedef struct {
  float start;
  float end;
  int   id;
} Note;

unsigned long startTime = 0;

ArduinoQueue<Note> queues[6]; // Queues of the notes
Note notes[6];


void setupTimings(char* csvData) {
  csvData = "time_start,time_end,id\n"
            "967,3870,12\n"
            "1451,1935,42\n"
            "1935,2419,31\n"
            "2419,2903,0\n"
            "2903,3387,31\n"
            "3387,3870,42\n"
            "3870,6774,10\n"
            "4354,4838,40\n"
            "4838,5322,26\n"
            "5322,5806,0\n";
    csvData = "time_start,time_end,id\n";

  CSV_Parser csvParser(csvData, "uLuLL");

  // Retrieving parsed values
  uint32_t* time_start  = (uint32_t*) csvParser["time_start"];
//  uint32_t* time_end    = (uint32_t*) csvParser["time_end"];
  int*      id          = (int*) csvParser["id"];

  // building the queues
  uint32_t nbNotes = csvParser.getRowsCount();
  for(int i = 0; i < 6; ++i){
    queues[i] = ArduinoQueue<Note>(nbNotes);
  }
  for (int i = 0; i < nbNotes; i++) {
    queues[id[i]/nbFrets].enqueue((Note) {time_start[i], time_start[i] + NOTE_DURATION, id[i]});
  }

  // setup to begin to play
  startTime = millis();
  for (int i = 0; i < 6; i++){
    notes[i] = {0, 0, 0};
  }
}

void loopTiming() {
  unsigned long currentTime = millis() - startTime;
  if (startTime = 0) return;

// We check all the string queues 
  for (int i = 0; i < 6; i++){
    // if a note has reached its play timing, we activate the servo
    if (node[i] != nullptr && currentTime >= notes[i].start){
      activate_servo(notes[i].id/nbFrets);
    }
    // if a note has ended, we move to the next one
    if (node[i] != nullptr && currentTime >= notes[i].end){
      notes[i] = queues[i].dequeue();
      if (node[i] == nullptr) break;
      activate_stepper(notes[i].id);
    }
  }
}

