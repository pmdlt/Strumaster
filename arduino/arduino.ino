#define uint unsigned int

#include "stepper_librairy.h"
#include <string.h>
#include <SoftwareSerial.h>

const int frets[9] = {0,220,420,610,790,960,1120,1275,1425};


typedef struct {
  uint8_t string; // stepper id
  uint16_t position; // position where the stepper must go
} Note;
uint8_t currNote = -1;

Note translater[60];
StepperDriver steppers[6] = {
  StepperDriverConstructor(2,   5,    false), 
  StepperDriverConstructor(3,   6,    false), 
  StepperDriverConstructor(4,   7,    true),
  StepperDriverConstructor(8,   11,   false),
  StepperDriverConstructor(9,   12,   true),
  StepperDriverConstructor(10,  13,   false)
  }; // Contains the stepper drivers
SoftwareSerial ESP(0, 1); 

uint8_t nbSteppers = 6;
//-------------

void setup() {
  //setup ESP communication
  ESP.begin(9600);
  Serial.begin(9600);

  // Steppers initialisation
  for (int i = 2; i < 14; i++){
    pinMode(i, OUTPUT);
  }
  steppersLibrairySetup(nbSteppers, 1000);

  // translater initialisation
  for (int id = 0; id < nbSteppers; id++){
    for (int fret = 0; fret < 10; fret++){
      translater[id*10 + fret] = {id, frets[fret]};
    }
  }
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

//----------------- stepper debug function

void reverseStepper(uint8_t id){
  steppers[id].reversedDir = !steppers[id].reversedDir;
}

void calibrateStepper(uint8_t id){
  steppers[id].position = 0;
  steppers[id].goal = 0;
}

void calibrateAllSteppers(){
  for (int id = 0; id < nbSteppers; id++){
    calibrateStepper(id);
  }
}

void resetStepper(uint8_t id){
  steppers[id].goal = 0;
}

void resetAllSteppers(){
  for (int id = 0; id < nbSteppers; id++){
    resetStepper(id);
  }
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
      //case reverse
      if (splittedData[0] == -1) {
        reverseStepper(splittedData[1]);
        return -1;
      } 
      
      // case calibrate
      if (splittedData[0] == -2) {
        calibrateStepper(splittedData[1]); 
        return -1;
      } 

      //case reset
      if (splittedData[0] == -4) {
        resetStepper(splittedData[1]); 
        return -1;
      }
      
      // case where we have to move the stepper 
      doSteps(&steppers[splittedData[0]], splittedData[1]); 
      return -1; 
    } else if (nbData == 1) {
      if (splittedData[0] == -3) {
        calibrateAllSteppers(); 
        return -1;
      }

      if (splittedData[0] == -5) {
        resetAllSteppers(); 
        return -1;
      }

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
