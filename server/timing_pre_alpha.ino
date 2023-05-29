#include <CSV_Parser.h>
#include <ArduinoQueue.h>

typedef struct {
  float start;
  float end;
  int   id;
} Note;

unsigned long startTime = 0;

ArduinoQueue<Note> queues[6]; // Queues of the notes
Note notes[6];


void setupTimings(const char* csvData) {
  CSV_Parser csvParser(csvData, "uLuLL");

  // Retrieving parsed values
  uint32_t* time_start  = (uint32_t*) csvParser["time_start"];
  uint32_t* time_end    = (uint32_t*) csvParser["time_end"];
  int*      id          = (int*) csvParser["id"];

  // building the queues
  uint32_t nbNotes = csvParser.getRowsCount();
  for(int i = 0; i < 6; ++i){
    queues[i] = ArduinoQueue<Note>(nbNotes);
  }
  for (int i = 0; i < nbNotes; i++) {
    queues[id[i]/nbFrets].enqueue((Note) {time_start[i], time_end[i], id[i]});
  }

  // setup to begin to play
  startTime = millis();
  for (int i = 0; i < 6; i++){
    if (queues[i].isEmpty()) {
      notes[i].id = -1; // -1 is to signify that this string has an empty queue and the servo should not activate
      break;
    }
    notes[i] = queues[i].dequeue();
    activate_stepper(notes[i].id);
  }
}

void loopTiming() {
  unsigned long currentTime = millis() - startTime;
  if (startTime == 0) return;

  // We check all the string queues 
  for (int i = 0; i < 6; i++){
    // if a note has reached its play timing, we activate the servo
    if (notes[i].id != -1 && notes[i].id != 2 && currentTime >= notes[i].start){ // we set id = -2 in order to not activate the servo several times
      activate_servo(notes[i].id/nbFrets);
      notes[i].id = -2;
    }
    // if a note has ended, we move to the next one
    if (notes[i].id != -1 && currentTime >= notes[i].end){
      if (queues[i].isEmpty()) {
        notes[i].id = -1;
        break;
      }
      notes[i] = queues[i].dequeue();
      activate_stepper(notes[i].id);
    }
  }
}

