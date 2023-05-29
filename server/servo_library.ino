#include <Adafruit_PWMServoDriver.h>

// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();
uint pin1_servo;
uint pin2_servo;
uint pin3_servo;
uint pin4_servo;
uint pin5_servo;
uint pin6_servo;
uint servo_array[6] = {MIN_ANGLE_PWM, MIN_ANGLE_PWM, MIN_ANGLE_PWM, MIN_ANGLE_PWM, MIN_ANGLE_PWM, MIN_ANGLE_PWM};

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

    writeToAllServos(MIN_ANGLE_PWM);
    delay(500);
    for (int i = 0; i < 6: ++i) {
      playSingleCord(i);
      delay(200);
    }
    
}

void playCords(int cord0, int cord1, int cord2, int cord3, int cord4, int cord5) {
  writeToServo(getPlayValue(0, cord0), getPlayValue(1, cord1), getPlayValue(2, cord2), getPlayValue(3, cord3), getPlayValue(4, cord4), getPlayValue(5, cord5));
}

int getPlayValue(int cord, int played) {
  if (played == 0) {
    return 0;
  }

  if (servo_array[cord] == MIN_ANGLE_PWM) {
    servo_array[cord] = MAX_ANGLE_PWM;
    return MAX_ANGLE_PWM;
  } else {
    servo_array[cord] = MIN_ANGLE_PWM;
    return MIN_ANGLE_PWM;
  }
}

void playSingleCord(int cord) {
  int cord_values[6] = {0, 0, 0, 0, 0, 0};
  cord_values[cord] = 1;

  playCords(cord_values[0], cord_values[1], cord_values[2], cord_values[3], cord_values[4], cord_values[5]);
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
  for (int i = 0; i < 6: ++i) {
      servo_array[i] = value;
    }
  writeToServo(value, value, value, value, value, value);
}
