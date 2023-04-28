typedef struct StepperDriver {
  // pins
  uint8_t step;
  uint8_t dir;

  uint8_t reversedDir;

  uint position;
  uint goal;

  void (*setGoal)(struct StepperDriver*, uint);
} StepperDriver;

/**
  Make all steppers that have not reached their goal position do a step
  @param steppers: Array of *6* pointers to stepper drivers
*/
void updateSteppers(StepperDriver* steppers[]);

/**
  Contruct a stepper motor driver given the pins and wether a positive means clock wise or anti-clockwise
*/
StepperDriver* StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise);

/**
  Set the goal of a stepper, i.e the number of steps required to reach the goal from 0
*/
void setGoal(StepperDriver* stepper, uint goal);