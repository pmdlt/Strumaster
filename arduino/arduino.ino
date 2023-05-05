#define uint unsigned int

#include "stepper_librairy.h"

typedef struct {
  uint8_t string; // stepper id
  uint16_t position; // position where the stepper must go
} Note;
uint8_t currNote = -1;

Note translater[60];
StepperDriver steppers[3] = {StepperDriverConstructor(2, 5, 0), StepperDriverConstructor(3, 6, 0), StepperDriverConstructor(4, 7, 0)}; // Contains the stepper drivers
//-------------

void setup() {
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
uint8_t listenToESP(uint8_t lastNote){
  return -1;
}
