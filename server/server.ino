#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>
#include <AccelStepper.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

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

void setup() {
  Serial.begin(9600);
  // Adafruit PCA9685 initialisation
  pwm.begin();
  pwm.setPWMFreq(1600);  // Maximum PWM frequency

  // Servos pin attachment
  servo[1].attach(servo1_pin);

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
}

///////////////////////////////////////////////////////////

void activate_stepper(int id, int goal) {
  
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

  switch (function) {
    // Make a stepper go to a certain position
    case 1:
      break;

    // Move the stepper <value> steps 
    case 2:
      break;

    // return the stepper position
    case 3:
      break;

    // return the distance to go of the stepper
    case 4:
      break;

    // Modify the delay of the steps 
    case 5:
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
