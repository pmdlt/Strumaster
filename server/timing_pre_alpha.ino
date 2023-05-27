#include <CSV_Parser.h>
#include <ArduinoQueue.h>

uint32_t* time_start;
uint32_t* time_end;
int* id;

typedef struct {
  float start;
  float end;
  int id;
} Note;

int nbNotes;
unsigned long startTime;

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

  CSV_Parser csvParser(csvData, "uLuLL");

  // Retrieving parsed values
  time_start = (uint32_t*) csvParser["time_start"];
  id = (int*) csvParser["id"];
  time_end = (uint32_t*) csvParser["time_end"];

  nbNotes = csvParser.getRowsCount();
  for(int i = 0; i < 6; ++i){
    queues[i] = ArduinoQueue<Note>(nbNotes);
  }

  for (int i = 0; i < nbNotes; i++) {
    queues[id[i]/nbFrets].enqueue((Note) {time_start[i], time_end[i], id[i]});
  }
}

void loopTiming() {
  unsigned long currentTime = millis() - startTime;

  for (int i = 0; i < 6; i++){
    if (currentTime >= notes[i].end){
      notes[i] = queues[i].dequeue();
      activate_stepper(notes[i].id);
    }
    if (currentTime >= notes[i].start){
      activate_servo(notes[i].id/nbFrets);
    }
  }
}

void startPlaying(){
  startTime = millis();
  for (int i = 0; i < 6; i++){
    notes[i] = (Note) {0, 0, 0};
  }
}

