#include <CSV_Parser.h>

float* duration;
int* id;
float* timeArray;
float* velocity;
int rowCount;
int i = 0;

unsigned long startTime;
unsigned long currentTime;

void setup() {
  Serial.begin(9600);

const char* csvData = "duration,id,time,velocity\n"
                      "0.75,10,5.25,0.6929133858267716\n"
                      "0.394874057291668,20,13.056699765625002,0.7165354330708661\n"
                      "0.123456789,30,18.987654321,0.54321\n"
                      "0.987654321,40,26.345678901,0.123456789\n"
                      "0.54321,50,33.678901234,0.987654321\n"
                      "0.246813575,60,41.345678901,0.7654321\n"
                      "0.135791357,70,48.789012345,0.321987654\n"
                      "0.987654321,80,56.876543210,0.987654321\n"
                      "0.654321,90,64.567890123,0.432109876\n"
                      "0.333333333,100,71.111111111,0.222222222\n";


  CSV_Parser csvParser(csvData, "fLff");

  // Retrieving parsed values
  duration = (float*)csvParser["duration"];
  id = (int*)csvParser["id"];
  timeArray = (float*)csvParser["time"];
  velocity = (float*)csvParser["velocity"];

  rowCount = csvParser.getRowsCount();

  Serial.println("Parsed CSV Data:");
  for (int i = 0; i < rowCount; i++) {
    Serial.print("Row ");
    Serial.print(i + 1);
    Serial.print(": duration=");
    Serial.print(duration[i]);
    Serial.print(", id=");
    Serial.print(id[i]);
    Serial.print(", time=");
    Serial.print(timeArray[i]);
    Serial.print(", velocity=");
    Serial.println(velocity[i]);
  }

  startTime = millis(); // Start the timer
  Serial.println("Start_timer");
}

void loop() {
  if (i < rowCount) {
    currentTime = millis() - startTime; // Calculate the elapsed time

    if (currentTime >= timeArray[i] * 1000 && currentTime <= (timeArray[i] + duration[i]) * 1000) {
      Serial.print("i: ");
      Serial.println(i);
      Serial.print("ID: ");
      Serial.print(id[i]);
      Serial.print(", Velocity: ");
      Serial.println(velocity[i]);
    } else if (currentTime > (timeArray[i] + duration[i]) * 1000) {
      i++;
    }
  }

  // Other code in the loop
}
