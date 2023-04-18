#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Servo.h>
#include <Stepper.h>

#define STEPS 200  // number of steps of steppers

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

// Steppers pin attribution
uint8_t stp1_1 = D4;
uint8_t stp1_2 = D4;
uint8_t stp1_3 = D4;
uint8_t stp1_4 = D4;

// Steppers init
Stepper stepper1(STEPS, stp1_1, stp1_2, stp1_3, stp1_4);

void setup() {
  // Servos pin attachment
  servo1.attach(servo1_pin);

  // Steppers speed init
  stepper1.setSpeed(30);

  // WiFi initialisation
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  delay(100);

  // Commands handle
  server.on("/connect", connect);
  server.on("/play_note", play_note);
  server.on("/stop", stop);
  server.onNotFound(not_supported);

  server.begin();
}
void loop() {
  server.handleClient();
}

///////////////////////////////////////////////////////////

void activate_stepper(int id, int position) {

}

void activate_servo(int id) {
  servo.write(45);
}

void connect() {
  server.send(200, "text/plain", "Connexion successful. Try to play a note :) !");
}

void play_note() {
  activate_stepper(1, 1);
  activate_servo(1);

  server.send(200, "text/plain", "");
}

void stop() { 
  server.send(200, "text/plain", "All motor off.");
}

void not_supported() {
  server.send(404, "text/plain", "Command not supported.");
}
