#include <Adafruit_PWMServoDriver.h>

const uint PWM_FREQ = 50;
const uint MIN_ANGLE_PWM = 210;
const uint MAX_ANGLE_PWM = 390;
const uint SERVO_DELAY = 500;

/**
 * Set up the servos
*/
void setupServos(uint pin1, uint pin2, uint pin3, uint pin4, uint pin5, uint pin6);

/**
 * Plays a single cord
*/
void playSingleCord(int cord);

/**
 * Plays cords for which values are 1, usage to play 1rst and 5th cord: playCords(1, 0, 0, 0, 1, 0); 
*/
void playCords(int cord1, int cord2, int cord3, int cord4, int cord5, int cord6);

/**
 * Stops all servos
*/
void stopAll();

/**
 * Set the servo back to 90 degrees
*/
void setAllToMiddle();

/**
 * Write specific PWM to the specific servos
*/
void writeToServo(int value1, int value2, int value3, int value4, int value5, int value6);

/**
 * Write the same PWM value to all servos
*/
void writeToAllServos(int value);
