#include <CSV_Parser.h>
#include <ArduinoQueue.h>

float* duration;
int* id;
float* timeArray;
float* velocity;
int rowCount;
int i = 0;

unsigned long startTime;
unsigned long currentTime;
unsigned long lastActivatedTime = 0;  // Track the last activated time

ArduinoQueue<int> timeQueue;  // Queue to store activation times


void setupTiming() {
  Serial.begin(9600);

  const char* csvData = "duration,id,time,velocity\n"
                        "0.75,1,5.25,0.6929133858267716\n"
                        "0.394874057291668,11,13.056699765625002,0.7165354330708661\n"
                        "0.123456789,23,18.987654321,0.54321\n"
                        "0.987654321,4,26.345678901,0.123456789\n"
                        "0.54321,25,33.678901234,0.987654321\n"
                        "0.246813575,16,41.345678901,0.7654321\n"
                        "0.135791357,15,48.789012345,0.321987654\n"
                        "0.987654321,22,56.876543210,0.987654321\n"
                        "0.654321,6,64.567890123,0.432109876\n"
                        "0.333333333,12,71.111111111,0.222222222\n";

  CSV_Parser csvParser(csvData, "fLff");

  // Retrieving parsed values
  duration = (float*)csvParser["duration"];
  id = (int*)csvParser["id"];
  timeArray = (float*)csvParser["time"];
  velocity = (float*)csvParser["velocity"];

  rowCount = csvParser.getRowsCount();

  Serial.println("Parsed CSV Data:");
  for (int i = 0; i < rowCount; i++) {
    // Serial.print("Row ");
    // Serial.print(i + 1);
    // Serial.print(": duration=");
    // Serial.print(duration[i]);
    // Serial.print(", id=");
    // Serial.print(id[i]);
    // Serial.print(", time=");
    // Serial.print(timeArray[i]);
    // Serial.print(", velocity=");
    // Serial.println(velocity[i]);
    timeQueue.enqueue(timeArray[i] * 1000);
  }

  startTime = millis();
  Serial.println("Start_timer");
}

void loopTiming() {
  if (i < rowCount) {
    currentTime = millis() - startTime;

    if (!timeQueue.isEmpty() && currentTime >= timeQueue.getHead() && currentTime > lastActivatedTime) {
      // Serial.print("i: ");
      // Serial.println(i);
      // Serial.print("ID: ");
      // Serial.print(id[i]);
      // Serial.print(", Velocity: ");
      // Serial.println(velocity[i]);
      lastActivatedTime = currentTime;
      timeQueue.dequeue();
      i++;
      activate_servo(id[i]/10);
      activate_stepper(id[i]);
    }

    // servo_id = id[i]/10
  }

  // Other code in the loop
}

