# Strumaster project

> EPFL ***Making intelligent things*** (**CS-358**) semester project
> 
> Introducing Strumaster, the connected & automated guitar that combines
> art, technology, and entertainment in a unique and innovative way.
> With its industrial-chic design and whimsical features, Strumaster is
> not just a guitar, it's a blend of form and function.

![IMG_0113](https://github.com/pmdlt/Strumaster/assets/75203799/97a3d210-cc7e-4ddc-aac9-d32d75b0b9df)


## Project Description
### Goal
The ultimate goal of the Strumaster project is a guitar that can play itself, providing a MIDI file via a web app. It also has of course the function to play a note by itself, and has a whole host of debugging functions (manage engine by engine, string by string, etc.).

## List of supplies
- 1x Guitar
- 1x Wooden plateform (120x70x5 cm)
- 1x Arduino Uno
- 1x ESP8266
- 1x 12V power supply
- 1x 9V power supply
- 1x Adafruit PCA9685
- 2x CNC shield
- 6x stepper motor driver
- 6x stepper motor
- 6x stepper motor timing Belt Pulley
- 100cm of timing belt
- 6x servo
- 10x 6Mx65 screw
- 16x 6M nuts
- 30x 3Mx10 screw
- 12x 3mx5 screw
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
- 6x neckGuiderUniversalTop
- 6x neckGuiderUniversalBottom
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

# ESP
The ESP serves as a master, it is the brain of our system. It creates a WiFi which the user has to connect to and it handles all requests asked by the user. The requests are then transmitted to the Adafruit PCA or to the Arduino board in terms of orders to the servos or the steppers, respectively. In order to play a song, a csv file is sent to the ESP which build 6 queues of notes and their timings, one for each string. It then dequeues the notes one by one, places the stepper at its correct fret, and activate the servo when note must be played.

# Servos
In this project the servos are used to pluck the strings. They are positioned were the fingers usually pluck the strings, and act as replacement for the musician's ones. For this, we had to design and print a bridge on top of the guitar to hold them, as well as code a library to play different notes. 

### Hardware
For the hardware, we use Adafruit PCA9685 and six 6v servos. The bridge on the guitar that hold the servos are comprised of 3 different parts: one servoPlateformLeft, one servoPlateformRight and tzo servoPlateformBottom which serves respectivly as holders and legs for holding the servoPlateformCenter on top of the guitar cords, which in turn hold the servos. Those parts are made to assemble with one another to form a single bridge which holds each servo above a cord. It should be noted that the servos are not positioned on top of the guitar hole, but rather a little more downstram of the cords. This design choice was made to mitigate the impact that pushing down on the string had on the sound made by plucking it with the servos. The final printed parts were the six servoStrum, which were attached to the servos and were the parts touching the string. To construct these parts, we printed them, and glued a small sheet of soft plastic (packaging plastic PET) of 10 mm x 5 mm in between the legs of that 3d printed part. This was done because 3d printed parts are not soft enough to produce a quality sound when plucking the guitar, and since we need to adjust the length of that plastic sheet it was easier to have it separated.

The rest of the hardware include electronics. For this, we connected the servos to the adafruit board and the adafruit board to a 5v output from the arduino, and connected the signal controls and ground to the ESP8266. This allowed us to control the servos from the esp using the adafruit library.

### Software (Arduino/ESP part)
The software part consisted in creating the library for using the servos (servo_library.h and servo_library.ino) and using them in the server file (server.ino). The coding of this part was pretty straightforward: we first setup the function to a 45 degree angle above the cords and then the function playSingleCord could be used to activate servos. Other functions of the library include moving several servos over specific cords, as well as moving servos to specific angles. The angle value of the servos always oscillate between 45 and 135 degrees, and is stored in memory by the program.

### Software (Client part)
<img width="1470" alt="image" src="https://github.com/pmdlt/Strumaster/assets/18498650/70ad5d67-f3cc-4ef7-8d43-e273a5c48ae2">

To control the guitar, a modern web-app based on [VueJS](https://vuejs.org/)/[Vuetify](https://vuetifyjs.com/en/) and hosted on [Netlify](https://www.netlify.com/) was created. It send POST and GET request to the ESP, witch is on the same WiFi.

# Steppers and Rails
In order to do the fretting, we use rails that constantly push the strings. They are moved to the correct fret using stepper motors.

The steppers are controlled by the Arduino board, with two CNC shields between them to serves as drivers. We made a simple labrary that allow the steppers to take steps in a non-blocking way (one stepper must not wait for the other to have finish its travel) and without loss of speed when several steppers are actuated at the same time. This was necessary for the guitar, as the rails can move at the same time in a music.
We also coded a Serial protocol of communication to get orders from the ESP. It was very straightforward, the ESP communication an integer corresponding to an order along a value, which can be an string id, a number of steps or a fret id. To move to a specific fret on the guitar, we counted the number of steps needed from the 1st fret to reach the desired fret.
We also made a simple dictionnary to map a note id, which goes from 0 to 60, to a string and a fret. We made this because of the small RAM constraints and to make communications as small as possible. Indeed, the ESP just has to communicate a small integer, instead of a string id and a number of steps.

### Necessary measurements

When you are starting the build, it is important to note that even though all guitars are standardized in terms of length (4/4, 3/4, 1/2, 1/4), the neck sizes may vary.
For example, in the case of 4/4 guitars, the neck widths (measured at the top) vary between 43 and 45 mm for acoustic, 51 and 55mm for classical and 41 and 45 mm for electric. In our case it is a 4/4 classic with a neck width of 52mm. The design we chose, requires the rails to run in parallel in order to not intersect, for this reason it is wise to first verify the maximum number of frets you can work with. How you can do this:

 1. Choose a rail width such that you have at least 2mm between each pair of rails   						
 (you need this for stability reasons and in order for the guiding gate entrances to be larger than the exits which assures fluent rail movement) [less than 4mm is never recommended]
 
 2. After you have chosen your rail width, you need to find the optimal position such that you can act on a sufficient set of strings. I. E., as each string has a different angle you need to find how many frets of each string can be covered when it is intersected with a rail going perpendicullarly to the nut (white part before the first fret). The minimum is your constraint, it should be at least 8 frets to have enough variety.
 3. When you have your fret coverage, you need to measure its length - the distance between the nut and your furthest fret.
 4. You can then use this distance to set the distance of the stepper platform from the nut. It is determined by two reference points - the axis of the steppers that are going to be closest to the guitar and the nut. This distance should be equal to the fret coverage + 1-2 cm of headroom. We need to do this because your timing belt length is the same as your fret coverage (again + the headroom) and it needs to be able to fit its entire length in that space when you are trying to play your furthest fret. The belt cannot pass through the 3d part on the nut as it is the one that holds the rails the tightest.


## Other Hardware

### Guitar Holders and Plank
In order to fix all our hardware and guitar together, we used a 120x70x5 cm wooden epicea plank to put bellow the guitar, as well as % 3d small printed pieces used to keep the guitar from moving from its spot on the plank. Those holders where positioned at the bottem, beginning of neck and sides of the guitar, and screwed on the metal plank.


## Electric scheme:

![Guitar-1](https://github.com/pmdlt/Strumaster/assets/75203799/eaa921dd-770b-434a-b1b7-62b4e1eb75d8)
