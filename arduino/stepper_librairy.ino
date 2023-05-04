uint NUM_STEPPERS = 0;
uint STEP_MICRODELAY = 0;

void steppersLibrairySetup(uint nb, uint stepDelay){
  NUM_STEPPERS = nb;
  STEP_MICRODELAY =  stepDelay;
}

// do a step for each stepper motor needing one.
void updateSteppers(StepperDriver steppers[]){
  if(NUM_STEPPERS != 0 && STEP_MICRODELAY != 0); else return;

  for (uint i = 0; i < NUM_STEPPERS; ++i){
    StepperDriver stepper = steppers[i];
    
    uint8_t should_incr = stepper.goal > stepper.position; // todo fixme, ça prend pas si ça doit aller en arrière
    uint diff = stepper.goal - stepper.position;
    if (!diff) continue;

    // Do the step in the right direction
    if (!((diff > 0) ^ stepper.reversedDir)) digitalWrite(stepper.dir, HIGH); else digitalWrite(stepper.dir, LOW); 
    digitalWrite(stepper.step, HIGH);
    delayMicroseconds(STEP_MICRODELAY);
    digitalWrite(stepper.step, LOW);
    stepper.position += should_incr ? 1 : -1;
    steppers[i] = stepper; // todo use a pointer, will be easier
  }
}

StepperDriver StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise){
  StepperDriver stepper = {stepPin, dirPin, isClockwise, 0, 0};
  return stepper;
}

void setGoal(StepperDriver* stepper, uint goal){
  stepper->goal = goal;
}

void stopSteppers(StepperDriver steppers[]){
  for (uint i = 0; i < NUM_STEPPERS; ++i){
    steppers[i].goal = steppers[i].position;
  }
}

bool isRunning(StepperDriver* stepper, uint currTime){
  return currTime > stepper->blockedUntil;
}