typedef struct StepperDriver {
  // pins
  uint8_t step;
  uint8_t dir;

  // 1 = clockwise, 0 = counterclockwise todo (i think, to be verified)
  bool reversedDir;

  uint position;
  uint goal;
  uint blockedUntil;
} StepperDriver;

/**
  Setup for the steppers librairy
  @param nb Number of steppers handled
  @param stepDelay Duration for a step, in microseconds. Setting it too low will result in undefined behavior (min value tested is 200)
*/
void steppersLibrairySetup(uint nb, uint stepDelay);

/**
  Contruct a stepper motor driver given the pins and whether a positive means clock wise or anti-clockwise
*/
StepperDriver StepperDriverConstructor(uint8_t stepPin, uint8_t dirPin, uint8_t isClockwise);

/**
  Make all steppers that have not reached their goal position do a step
  @param steppers: Array of pointers to stepper drivers. The size of the array must be equal to the number of steppers precised in steppersLibrairySetup
*/
void updateSteppers(StepperDriver steppers[]);

/**
  Set the position goal of a stepper, i.e the number of steps required to reach the goal from 0
*/
void setGoal(StepperDriver* stepper, int goal);

/**
  Make the stepper do a given number of steps (can be negative)
*/
void doSteps(StepperDriver* stepper, int steps);

/**
  Stop all steppers. 
*/
void stopSteppers(StepperDriver steppers[]);

/**
  Return true if the stepper is blocked, false otherwise
*/
bool isRunning(StepperDriver* stepper, uint currTime);

