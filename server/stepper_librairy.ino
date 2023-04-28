// TODO make this a setable variable
#define STEPPERS_NUM 6
uint step_microdelay = 2000; // 2ms 

// FIXME Should move to server file
void setupSteppers() {
  pwm.begin();
  pwm.setPWMFreq(1600);  // This is the maximum PWM frequency
}

// do a step for each stepper motor needing one.
void updateSteppers(StepperDriver* steppers[]){
  for (uint i = 0; i < STEPPERS_NUM; ++i){
    StepperDriver stepper = *steppers[i];
    
    uint8_t should_incr = stepper.goal > stepper.position;
    if (stepper.reversedDir) should_incr = !should_incr;
  
    // Do the step in the right direction
    if (should_incr) setHigh(stepper.dir); else setLow(stepper.dir);
    setHigh(stepper.step);
    delayMicroseconds(step_microdelay);
    setLow(stepper.step);
    stepper.position += should_incr ? 1 : -1;
  }
}

StepperDriver* StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise){
  StepperDriver stepper = {stepPin, dirPin, 0, 0, isClockwise, setGoal};
  return &stepper;
}

void setGoal(StepperDriver* stepper, uint goal){
  stepper->goal = goal;
}



// -------------------------------------------------------  utils functions

void setHigh(uint8_t pin){
  pwm.setPWM(pin, 0, 4096);
}
void setLow(uint8_t pin){
  pwm.setPWM(pin, 4096, 0);
}