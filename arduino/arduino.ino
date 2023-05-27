#define uint unsigned int

#include "stepper_librairy.h"
#include <string.h>
#include <SoftwareSerial.h>


typedef struct {
  uint8_t string; // stepper id
  uint16_t position; // position where the stepper must go
} Note;
uint8_t currNote = -1;

Note translater[60];
StepperDriver steppers[6] = {
  StepperDriverConstructor(2, 5, 0), 
  StepperDriverConstructor(3, 6, 0), 
  StepperDriverConstructor(4, 7, 0),
  StepperDriverConstructor(8, 11, 0),
  StepperDriverConstructor(9, 12, 0),
  StepperDriverConstructor(10, 13, 0)
  }; // Contains the stepper drivers
SoftwareSerial ESP(0, 1); 
//-------------

void setup() {
  //setup ESP communication
  ESP.begin(9600);
  Serial.begin(9600);

  // Steppers initialisation
  for (int i = 2; i < 14; i++){
    pinMode(i, OUTPUT);
  }
  steppersLibrairySetup(6, 1000);

  // translater initialisation
  for (int id = 0; id < 6; id++){
    for (int fret = 0; fret < 10; fret++){
      translater[id*10 + fret] = {id, fret*100}; //tbd, 1er fret = position 0, 2e = 170 , 3e = 170 + 160, 4e = 170 + 160 + 150
    }
  }
  translater[2*10 + 1].position = 170;
  translater[2*10 + 2].position = 170 + 160;
  translater[2*10 + 3].position = 170 + 160 + 150; 
}

void loop() {
  // we get a note
  uint8_t tmp = listenToESP();
  if (tmp != -1) {
    currNote = tmp;
    Note translation = translater[currNote];
    setGoal(&steppers[translation.string], translation.position);
  }

  // Do a step for all steppers needing one
  updateSteppers(steppers);
}

void resetStepper(uint8_t id){
  steppers[id].position = 0;
}

void reverseStepper(uint8_t id){
  steppers[id].reversedDir = !steppers[id].reversedDir;
}

/**
  Non-blocking function, which listen to the esp
  @return A note id (0-59) if the ESP has sent a new one, -1 otherwise. Call "doSteps" if ESP require a stepper to do a certain # of steps
*/
uint8_t listenToESP(){
  if (ESP.available()) { // Check if there's data available from the ESP8266
    String rawData = ESP.readStringUntil('\n');
                                                        Serial.println(rawData);
    int splittedData[3] = {0, 0, 0};
    size_t nbData = 0;
    uint index = 0;
    uint8_t tokenIndexes[2] = {0, 0};
    while(index < rawData.length()) {
      if (rawData.charAt(index) == ','){
        tokenIndexes[1] = index;
        splittedData[nbData] = rawData.substring(tokenIndexes[0], tokenIndexes[1]).toInt();
        tokenIndexes[0] = index + 1;
        nbData += 1;
      }
      index +=1;
    }
    if (nbData == 2) {
      // case where we have to move the stepper 
      doSteps(&steppers[splittedData[0]], splittedData[1]); 
      return -1; 
    } else if (nbData == 1) {
      // case where we have to change the current note
      uint8_t note = splittedData[0];
      
      if (note>=0 && note<60) return note; // return the note

      Serial.println("Invalid note received from ESP");
    } else {
      Serial.println("Invalid data received from ESP");
    }  
  }
  return -1;
}
