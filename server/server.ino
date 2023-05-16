#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <AccelStepper.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include "servo_library.h"

// Webserver config
const char* ssid = "touche_pas_a_mon_wifi";
const char* password = "pastouche";
IPAddress local_ip(192, 168, 174, 140);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
ESP8266WebServer server(80);
SoftwareSerial Arduino(2, 3);

// Program variables
bool connected = 0;
bool is_playing_note = 0;
uint8_t nbFrets = 10;  // number of frets handled by strings

void setup() {
  Serial.begin(9600);

  // Servos init
  setupServos(10, 11, 12, 13, 14, 15);

  // WiFi initialisation
  WiFi.begin(ssid, password);
  int i = 0;
  while (WiFi.status() != WL_CONNECTED) {  // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.print(++i);
    Serial.print(' ');
  }
  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
  server.enableCORS(true);
  delay(100);

  // Commands handle
  server.on("/connect", handleConnect);

  server.on("/play_note", HTTP_GET, []() {  // arg: id
    handlePlayNote();
  });

  server.on("/stop", handleStop);

  server.on("/debug_stepper", HTTP_GET, []() {  // arg: function, id, value
    handleDebugStepper();
  });
  server.on("/debug_servo", HTTP_GET, []() {  // arg: id
    handleDebugServo();
  });
  server.onNotFound(handleNotSupported);

  server.begin();


  Arduino.println("");
}
void loop() {
  server.handleClient();
}

///////////////////////////////////////////////////////////

void activate_stepper(int id_note) {
  // Todo @Albert: send to Arduino
  Serial.printf("%d,\n", id_note);
  //Arduino.printf("%d,\n", id_note);
}

void debug_stepper(int id_stepper, int steps) {
  // Todo @Albert: send to Arduino
  Serial.printf("%d,%d,\n", id_stepper, steps);
  // Arduino.printf("%d,%d,\n", id_stepper, steps);
}

void activate_servo(int id_servo) {
  playSingleCord(id_servo);
}

void handleConnect() {
  server.send(200, "text/plain", "Connexion successful. Try to play a note :) !");
}

void handlePlayNote() {
  int id = server.arg("id").toInt();
  activate_stepper(id);
  delay(1000);  // FIXME bloquing, Ok for debug and if we only want to play 1 note, Must be changed for final
  activate_servo(id / nbFrets);

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

  playSingleCord(id);

  server.send(200, "text/plain", "Executed on adafruit");
}
