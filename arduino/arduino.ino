#define uint unsigned int

#include "stepper_librairy.h"

StepperDriver steppers[3] = {StepperDriverConstructor(2, 5, 0), StepperDriverConstructor(3, 6, 0), StepperDriverConstructor(4, 7, 0)};

void setup() {
  for (int i = 2; i < 8; i++){
    pinMode(i, OUTPUT);
  }
  steppersLibrairySetup(3, 300);
  for (int i = 0; i < 3; i++) {
    steppers[i].goal = 3000;
  }
}

void loop() {
  updateSteppers(steppers);
}
