#include <Adafruit_PWMServoDriver.h>

// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();
uint pin1_servo;
uint pin2_servo;
uint pin3_servo;
uint pin4_servo;
uint pin5_servo;
uint pin6_servo;

void setupServos(uint pin1, uint pin2, uint pin3, uint pin4, uint pin5, uint pin6) {
    // Adafruit PCA9685 initialisation
    pwm.begin();
    pwm.setPWMFreq(50);  // PWM frequency

    pin1_servo = pin1;
    pin2_servo = pin2;
    pin3_servo = pin3;
    pin4_servo = pin4;
    pin5_servo = pin5;
    pin6_servo = pin6;

    setAllToMiddle();
}

// Plays cords for which values are 1, usage to play 1rst and 5th cord: playCords(1, 0, 0, 0, 1, 0);
void playCords(int cord1, int cord2, int cord3, int cord4, int cord5, int cord6) {
  writeToServo(cord1 * MIN_ANGLE_PWM, cord2 * MIN_ANGLE_PWM, cord3 * MIN_ANGLE_PWM, cord4* MIN_ANGLE_PWM,cord5 * MIN_ANGLE_PWM, cord6 * MIN_ANGLE_PWM);
  delay(SERVO_DELAY);
  writeToServo(cord1 * MAX_ANGLE_PWM, cord2 * MAX_ANGLE_PWM, cord3 * MAX_ANGLE_PWM, cord4 * MAX_ANGLE_PWM,cord5 * MAX_ANGLE_PWM, cord6 * MAX_ANGLE_PWM);
}

void stopAll() {
  writeToAllServos(0);
}

void setAllToMiddle() {
  writeToAllServos((MAX_ANGLE_PWM - MIN_ANGLE_PWM) / 2);
}

void writeToServo(int value1, int value2, int value3, int value4, int value5, int value6) {
  pwm.setPWM(pin1_servo, 0, value1);
  pwm.setPWM(pin2_servo, 0, value2);
  pwm.setPWM(pin3_servo, 0, value3);
  pwm.setPWM(pin4_servo, 0, value4);
  pwm.setPWM(pin5_servo, 0, value5);
  pwm.setPWM(pin6_servo, 0, value6);
}

void writeToAllServos(int value) {
  writeToServo(value, value, value, value, value, value);
}
