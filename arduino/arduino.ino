#define uint unsigned int

#include "stepper_librairy.h"
#include <SoftwareSerial.h>


typedef struct {
  uint8_t string; // stepper id
  uint16_t position; // position where the stepper must go
} Note;
uint8_t currNote = -1;

Note translater[60];
StepperDriver steppers[3] = {StepperDriverConstructor(2, 5, 0), StepperDriverConstructor(3, 6, 0), StepperDriverConstructor(4, 7, 0)}; // Contains the stepper drivers
SoftwareSerial ESP(0, 1); 
//-------------

void setup() {
  //setup ESP communication
  ESP.begin(9600);
  Serial.begin(9600);

  // Steppers initialisation
  for (int i = 2; i < 8; i++){
    pinMode(i, OUTPUT);
  }
  steppersLibrairySetup(3, 600);

  // translater initialisation
  for (int id = 0; id < 6; id++){
    for (int fret = 0; fret < 10; fret++){
      translater[id*10 + fret] = {id, fret*100}; //tbd, 1er fret = position 0
    }
  }
}

void loop() {
  // we get a note
  uint8_t tmp = listenToESP(currNote);
  if (tmp != -1) {
    currNote = tmp;
    Note translation = translater[currNote];
    setGoal(&steppers[translation.string], translation.position);
  }

  // Do a step for all steppers needing one
  updateSteppers(steppers);
}

/**
  Non-blocking function, which listen to the esp
  @return A note id (0-59) if the ESP has sent a new one, -1 otherwise. Call "doSteps" if ESP require a stepper to do a certain # of steps
*/
uint8_t listenToESP(){
  if (ESP.available()) { // Check if there's data available from the ESP8266
    String data = ESP.readStringUntil('\n');
    List<String> splittedData = split(data, ',');
    if (splittedData.size() == 2) {
      // case where we have to move the stepper 
      doSteps(steppers[splittedData[0].toInt()], splittedData[1].toInt()); 
      return -1; 
    }else if (splittedData.size() == 1) {
      // case where we have to change the current note
      uint8_t note = splittedData[0].toInt();
      
      if (note>=0 && note<60) return note; // return the note

      Serial.println("Invalid note received from ESP");
    }else
    {
      Serial.println("Invalid data received from ESP");
    }  
  }
  return -1;
}
