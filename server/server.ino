#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <AccelStepper.h>
#include <Wire.h>
#include <SoftwareSerial.h>

#include "servo_library.h"

// Webserver config
const char* ssid = "strumaster_control";
const char* password = "12345678";
IPAddress local_ip(192, 168, 174, 140);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
ESP8266WebServer server(80);


// Program variables
bool connected = 0;
bool is_playing_note = 0;
uint8_t nbFrets = 8;  // number of frets handled by strings

void setup() {
  Serial.begin(9600);

  // Servos init
  setupServos(10, 11, 12, 13, 14, 15);

  // WiFi initialisation
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  delay(100);

  // Commands handle
  server.on("/connect", handleConnect);
  server.on("/stop", handleStop);
  server.on("/pause", handlePause);
  server.on("/resume", handleResume);
  server.on("/reset", handleReset);
  server.onNotFound(handleNotSupported);

  server.on("/play_song", HTTP_POST, []() {  // arg: POST_plain
    handlePlaySong();
  });
  server.on("/play_song", HTTP_OPTIONS, handleCORS);

  server.on("/play_note", HTTP_GET, []() {  // arg: id
    handlePlayNote();
  });

  server.on("/debug_stepper", HTTP_GET, []() {  // arg: function, id, value
    handleDebugStepper();
  });

  server.on("/debug_servo", HTTP_GET, []() {  // arg: id
    handleDebugServo();
  });

  server.enableCORS(true);
  server.begin();  
  
}
void loop() {
  server.handleClient();
  loopTiming();
}

///////////////////////////////////////////////////////////

void activate_stepper(int id_note) {
  // Todo @Albert: send to Arduino
  Serial.printf("%d,\n", id_note);
}

void debug_stepper(int id_stepper, int steps) {
  // Todo @Albert: send to Arduino
  Serial.printf("%d,%d,\n", id_stepper, steps);
}

void reverse_stepper(int id_stepper) {
  Serial.printf("%d,%d,\n", -1, id_stepper);
}

void reset_stepper(int id_stepper) {
  Serial.printf("%d,%d,\n", -2, id_stepper);
}

void activate_servo(int id_servo) {
  playSingleCord(id_servo);
}

void handleConnect() {
  server.send(200, "text/plain", "Connexion successful. Try to play a note !");
}

void handlePause() {
  // Todo
  server.send(200, "text/plain", "Song paused");
}

void handleResume() {
  // Todo
  setupTimings(NULL);
  server.send(200, "text/plain", "Song resumed");
}

void handleStop() {
  // Todo
  server.send(200, "text/plain", "All motor off");
}

void handleReset() {
  // Todo
  Serial.println("-3,");
  server.send(200, "text/plain", "Device reinitialized");
}

void handleNotSupported() {
  server.send(501, "text/plain", "Command not supported");
}

void handlePlaySong() {
    setupTimings(server.arg("plain").c_str());
    server.send(200, "text/plain", "Song was sent to the guitar. Enjoy the vibe !");
}

void handlePlayNote() {
  int id = server.arg("id").toInt();
  activate_stepper(id);
  delay(1000);  // FIXME bloquing, Ok for debug and if we only want to play 1 note, Must be changed for final
  activate_servo(id / nbFrets);

  server.send(200, "text/plain", "Note sent and played");
}

void handleDebugStepper() {
  int id = server.arg("id").toInt();
  int value = server.arg("value").toInt();
  String function = server.arg("function");
  int rtnv = 0;

  if (function == "Note") {
    rtnv = 1;
  } else if (function == "Steps") {
    rtnv = 2;
  } else if (function == "Reset") {
    rtnv = 3;
  } else if (function == "Reverse") {
    rtnv = 4;
  } else {
    return;
  }

  switch (rtnv) {
    // Make a stepper go to a certain note
    case 1:
      activate_stepper(value);
      break;

    // Move the stepper <value> steps
    case 2:
      debug_stepper(id, value);
      break;

    // Reset the stepper's position
    case 3:
      reset_stepper(id);
      break;

    // Reverse the stepper
    case 4:
      reverse_stepper(id);
      break;

    default:
      return;
  }

  server.send(200, "text/plain", "Debug function received by ESP !");
}

void handleDebugServo() {
  int id = server.arg("id").toInt();

  playSingleCord(id);

  server.send(200, "text/plain", "Servo moved.");
}

void handleCORS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Max-Age", "10000");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);
}
