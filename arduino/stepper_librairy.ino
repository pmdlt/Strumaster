uint NUM_STEPPERS = 0;
uint STEP_MICRODELAY = 0; //todo faire en sorte que l'interpas soit toujours le même, pour l'instant si y'en a 1 qui tourne il va super vite, si le 3 vont en même temps c'est plus lent 

void steppersLibrairySetup(uint nb, uint stepDelay){
  NUM_STEPPERS = nb;
  STEP_MICRODELAY = stepDelay;
}

// do a step for each stepper motor needing one.
void updateSteppers(StepperDriver steppers[]){
  // check that the librairy has been initialized
  if(NUM_STEPPERS != 0 && STEP_MICRODELAY != 0); else return;
  
  // Allow constant speed
  uint8_t nbActiveSteppers = 0;
  for (uint8_t i = 0; i < NUM_STEPPERS; ++i){
    if (steppers[i].goal - steppers[i].position) nbActiveSteppers += 1;
  }
  uint stepDelay = STEP_MICRODELAY / nbActiveSteppers;
  
  // Stepping
  for (uint8_t i = 0; i < NUM_STEPPERS; ++i){
    StepperDriver* stepper = &steppers[i];
    
    int diff = stepper->goal - stepper->position;
    if (diff == 0) continue;

    // Do the step in the right direction
    if (!((diff > 0) == stepper->reversedDir)) digitalWrite(stepper->dir, HIGH); else digitalWrite(stepper->dir, LOW); 
    digitalWrite(stepper->step, HIGH);
    delayMicroseconds(stepDelay);
    digitalWrite(stepper->step, LOW);
    stepper->position += diff > 0 ? 1 : -1;

    // small fix for heating
    digitalWrite(stepper->dir, LOW);
  }
}

StepperDriver StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise){
  StepperDriver stepper = {stepPin, dirPin, isClockwise, 0, 0};
  return stepper;
}

void setGoal(StepperDriver* stepper, int goal){
  stepper->goal = goal;
}

void doSteps(StepperDriver* stepper, int steps){
  stepper->goal = stepper->position + steps; 
}

void stopSteppers(StepperDriver steppers[]){
  for (uint i = 0; i < NUM_STEPPERS; ++i){
    steppers[i].goal = steppers[i].position;
  }
}

bool isRunning(StepperDriver* stepper, uint currTime){
  return currTime > stepper->blockedUntil;
}