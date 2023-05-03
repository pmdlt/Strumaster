#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>
#include <AccelStepper.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

#include "stepper_librairy.h"

// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// Webserver config
const char* ssid = "StrumMaster";
const char* password = "12345678";
IPAddress local_ip(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
ESP8266WebServer server(80);

// Program variables
bool connected = 0;
bool is_playing_note = 0;

// Servos pin attribution
uint8_t servo1_pin = D4;

// Servos init
Servo servo1;
Servo servo[7] = {
  Servo(), servo1
};

// Steppers pins attribution (adafruit pins)
const uint nbSteppers = 3;
StepperDriver steppers[nbSteppers];
const uint8_t steppersStepPins[nbSteppers] = {0, 2, 4};
const uint8_t steppersDirPins[nbSteppers] = {1, 3, 5};

void setup() {
  Serial.begin(9600);
  // Adafruit PCA9685 initialisation
  pwm.begin();
  pwm.setPWMFreq(1600);  // Maximum PWM frequency

  // Servos pin attachment
  servo[1].attach(servo1_pin);

  // Steppers init
  steppersLibrairySetup(nbSteppers, 5 * 1000); // 5 ms for step delay
  const static StepperDriver tmp[nbSteppers] = {
    StepperDriverConstructor(steppersStepPins[0], steppersDirPins[0], 0),
    StepperDriverConstructor(steppersStepPins[1], steppersDirPins[1], 0),
    StepperDriverConstructor(steppersStepPins[2], steppersDirPins[2], 0)
    };
  memcpy(steppers, tmp, sizeof tmp);

  // WiFi initialisation
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  delay(100);

  // Commands handle
  server.on("/connect", handleConnect);
  server.on("/play_note", handlePlayNote);
  server.on("/stop", handleStop);

  server.on("/debug_stepper", HTTP_GET, []() {
    handleDebugStepper();
  });
  server.on("/debug_servo", HTTP_GET, []() {
    handleDebugServo();
  });
  server.onNotFound(handleNotSupported);

  server.begin();
}
void loop() {
  server.handleClient();
  updateSteppers(steppers);
}

///////////////////////////////////////////////////////////

void activate_stepper(int id, int goal) {
  setGoal(&steppers[id], goal);
}

void activate_servo(int id) {
  servo1.write(45);
  servo1.write(0);
}

void handleConnect() {
  server.send(200, "text/plain", "Connexion successful. Try to play a note :) !");
}

void handlePlayNote() {
  activate_stepper(1, 0);
  activate_servo(1);

  server.send(200, "text/plain", "");
}

void handleStop() {
  stopSteppers(steppers);
  server.send(200, "text/plain", "All motor off.");
}

void handleNotSupported() {
  server.send(404, "text/plain", "Command not supported.");
}

void handleDebugStepper() {
  int id = server.arg("id").toInt();
  int value = server.arg("value").toInt();
  int function = server.arg("function").toInt();
  int rtnv = 0;
  Serial.printf("Id: %d, value: %d, function: %d\n", id, value, function);


  switch (function) {
    // Make a stepper go to a certain position
    case 1:
      setGoal(&steppers[id], value);
      break;

    // Move the stepper <value> steps 
    case 2:
      setGoal(&steppers[id], steppers[id].position + value);
      break;

    // return the stepper position
    case 3:
      rtnv = steppers[id].position;
      break;

    // return the distance to go of the stepper
    case 4:
      rtnv = steppers[id].position - steppers[id].goal;
      rtnv = rtnv < 0 ? -rtnv : rtnv;
      break;

    // Modify the delay of the steps 
    case 5:
      steppersLibrairySetup(nbSteppers, value);
      break;

    default:
      return;
  }

  server.send(200, "text/plain", "Executed. Return value : " + rtnv);
}

void handleDebugServo() {
  int id = server.arg("id").toInt();
  int value = server.arg("value").toInt();

  servo[id].write(value);
  server.send(200, "text/plain", "Executed.");
}
