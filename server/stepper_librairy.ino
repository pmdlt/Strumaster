uint NUM_STEPPERS = 0;
uint STEP_MICRODELAY = 0;

void steppersLibrairySetup(uint nb, uint stepDelay){
  NUM_STEPPERS = nb;
  STEP_MICRODELAY =  stepDelay;
}

// do a step for each stepper motor needing one.
void updateSteppers(StepperDriver* steppers[]){
  assert(NUM_STEPPERS != 0 && STEP_MICRODELAY != 0);

  for (uint i = 0; i < NUM_STEPPERS; ++i){
    StepperDriver stepper = *steppers[i];
    
    uint8_t should_incr = stepper.goal > stepper.position;
    if (stepper.reversedDir) should_incr = !should_incr;
  
    // Do the step in the right direction
    if (should_incr) setPWMHigh(stepper.dir); else setPWMLow(stepper.dir);
    setPWMHigh(stepper.step);
    delayMicroseconds(STEP_MICRODELAY);
    setPWMLow(stepper.step);
    stepper.position += should_incr ? 1 : -1;
  }
}

StepperDriver* StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise){
  StepperDriver stepper = {stepPin, dirPin, 0, 0, isClockwise};
  return &stepper;
}

void setGoal(StepperDriver* stepper, uint goal){
  stepper->goal = goal;
}

void stopSteppers(StepperDriver* steppers[]){
  for (uint i = 0; i < NUM_STEPPERS; ++i){
    steppers[i]->goal = steppers[i]->position;
  }
}

// -------------------------------------------------------  utils functions

void setPWMHigh(uint8_t pin){
  pwm.setPWM(pin, 0, 4096);
}
void setPWMLow(uint8_t pin){
  pwm.setPWM(pin, 4096, 0);
}