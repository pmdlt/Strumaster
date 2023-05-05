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
SoftwareSerial Arduino(2, 3);

// Program variables
bool connected = 0;
bool is_playing_note = 0;
uint8_t nbFrets = 10; // number of frets handled by strings

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
  server.on("/play_note", handlePlayNote); // arg: id
  server.on("/stop", handleStop);

  server.on("/debug_stepper", HTTP_GET, []() { // arg: function, id, value
    handleDebugStepper();
  });
  server.on("/debug_servo", HTTP_GET, []() { // arg: id
    handleDebugServo();
  });
  server.onNotFound(handleNotSupported);

  server.begin();
}
void loop() {
  server.handleClient();
}

///////////////////////////////////////////////////////////

void activate_stepper(uint8_t id_note) {
  // Todo @Albert: send to Arduino
  Arduino.println(id_note);
}

void debug_stepper(int id_stepper, int steps) {
  // Todo @Albert: send to Arduino
  Arduino.println(id_stepper+","+steps);
}

void activate_servo(int id_servo) {
  // Todo @P-H: send to Adafruit
}

void handleConnect() {
  server.send(200, "text/plain", "Connexion successful. Try to play a note :) !");
}

void handlePlayNote() {
  int id = server.arg("id").toInt();
  activate_stepper(id);
  delay(1000); // FIXME bloquing, Ok for debug and if we only want to play 1 note, Must be changed for final
  activate_servo(id/nbFrets);

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
    // Make a stepper go to a certain note
    case 1:
      activate_stepper(value);
      break;

    // Move the stepper <value> steps 
    case 2:
      debug_stepper(id, value);
      break;

    default:
      return;
  }

  server.send(200, "text/plain", "Executed. Return value : " + rtnv);
}

void handleDebugServo() {
  int id = server.arg("id").toInt();

  activate_servo(id);
}
