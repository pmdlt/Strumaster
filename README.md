# Strumaster project

> EPFL ***Making intelligent things*** (**CS-358**) semester project
> 
> Introducing Strumaster, the connected & automated guitar that combines
> art, technology, and entertainment in a unique and innovative way.
> With its industrial-chic design and whimsical features, Strumaster is
> not just a guitar, it's a blend of form and function.

## Project Description
### Goal
The ultimate goal of the Strumaster project is a guitar that can play itself, providing a MIDI file via a web app. It also has of course the function to play a note by itself, and has a whole host of debugging functions (manage engine by engine, string by string, etc.).
### Context


## Servos

In this project the servos are used to pluck the strings. They are positioned were the fingers usually pluck the strings, and act as replacement for the musician's ones. For this, we had to design and print a bridge on top of the guitar to hold them, as well as code a library to play different notes. 

### Hardare

For the hardware, we use Adafruit PCA9685 and six 6v servos. The bridge on the guitar that hold the servos are comprised of 3 different parts: one servoPlateformLeft, one servoPlateformRight and tzo servoPlateformBottom which serves respectivly as holders and legs for holding the servoPlateformCenter on top of the guitar cords, which in turn hold the servos. Those parts are made to assemble with one another to form a single bridge which holds each servo above a cord. It should be noted that the servos are not positioned on top of the guitar hole, but rather a little more downstram of the cords. This design choice was made to mitigate the impact that pushing down on the string had on the sound made by plucking it with the servos. The final printed parts were the six servoStrum, which were attached to the servos and were the parts touching the string. To construct these parts, we printed them, and glued a small sheet of soft plastic (packaging plastic PET) of 10 mm x 5 mm in between the legs of that 3d printed part. This was done because 3d printed parts are not soft enough to produce a quality sound when plucking the guitar, and since we need to adjust the length of that plastic sheet it was easier to have it separated.

The rest of the hardware include electronics. For this, we connected the servos to the adafruit board and the adafruit board to a 5v output from the arduino, and connected the signal controls and ground to the ESP8266. This allowed us to control the servos from the esp using the adafruit library.

# Software

The software part consisted in creating the library for using the servos (servo_library.h and servo_library.ino) and using them in the server file (server.ino). The coding of this part was pretty straightforward: we first setup the function to a 45 degree angle above the cords and then the function playSingleCord could be used to activate servos. Other functions of the library include moving several servos over specific cords, as well as moving servos to specific angles. The angle value of the servos always oscillate between 45 and 135 degrees, and is stored in memory by the program. 



## List of supplies
- 1x Guitar
- 1x Wooden plateform (?x?x?cm)
- 1x Arduino Uno
- 1x ESP8266
- 1x 12V power supply
- 1x Buck converter (12V to 5V)
- 1x Adafruit PCA9685
- 2x CNC shield
- 6x stepper motor driver
- 6x stepper motor
- 6x stepper motor timing Belt Pulley
- 100cm of timing belt
- 6x servo
- 10x 6Mx65 screw
- 10x 6M nuts
- ?x 3Mx10 screw
- a lot of wires
- zip-ties


## List of Parts to 3d print

### Servo Part:
- 6x servoStrum
- 1x servoPlateformLeft
- 1x servoPlateformCenter
- 1x servoPlateformRight
- 2x servoPlateformBottom

### Stepper Part:
- 1x plateformSteppers
- 2x plateformGuider
- 3x neckGuiderUniversalTop
- 3x neckGuiderUniversalBottom
- 1x neckGuiderFret2Top
- 1x neckGuiderFret2Bottom
- 1x neckGuiderFret0Top
- 1x neckGuiderFret0Bottom

### Others:
- 3x supportCNC_Shield
- 1x supportPCA9685
- 5x guitarHolder
- 10x cableGuider

## List of Parts laser cut in plexiglas 
- 6x rails




