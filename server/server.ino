#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>
#include <AccelStepper.h>

#define stepsPerSecond 200  // number of steps of steppers

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

// Steppers pin attribution
uint8_t stp1_step = D4;
uint8_t stp1_dir = D5;

// Steppers init
AccelStepper stp1(1, stp1_step, stp1_dir);
AccelStepper stp[7] = {
  AccelStepper(), stp1
};

void setup() {
  // Servos pin attachment
  servo[1].attach(servo1_pin);

  // Steppers speed init
  stp[1].setMaxSpeed(stepsPerSecond);

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
  server.onNotFound(handleNotSupported);

  server.begin();
}
void loop() {
  server.handleClient();
  stp1.run();
}

///////////////////////////////////////////////////////////

void activate_stepper(int id, int position) {
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
  int function = server.arg("function").toInt();
  int id = server.arg("id").toInt();
  int value = server.arg("value").toInt();
  int rtnv = 0;

  switch (function) {
    case 1:
      stp[id].moveTo(value);
      break;
    case 2:
      stp[id].move(value);
      break;
    case 3:
      rtnv = stp[id].currentPosition();
      break;
    case 4:
      rtnv = stp[id].distanceToGo();
      break;

    default:
      return;
  }
  server.send(200, "text/plain", "Executed. Return value : " + rtnv);
}
