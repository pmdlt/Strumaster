<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12">
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>
                <h1 class="title text-center">StrumMaster</h1>
                <model-viewer src="guitar.glb" ar ar-modes="webxr scene-viewer quick-look" camera-controls
                  poster="poster.webp" shadow-intensity="0.89" environment-image="whipple_creek_regional_park_04_1k.hdr"
                  exposure="0.18" shadow-softness="1" camera-orbit="4.077deg 83.83deg 1707m" field-of-view="30deg">
                  <div class="progress-bar hide" slot="progress-bar">
                    <div class="update-bar"></div>
                  </div>
                  <button slot="ar-button" id="ar-button">
                    View in your space
                  </button>
                  <div id="ar-prompt">
                    <img src="/public/ar_hand_prompt.png">
                  </div>
                </model-viewer>

                <p class="text-center">Welcome to the control center app of the StrumMaster project.<br>

                  We control the guitar.<br><br></p>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import '@google/model-viewer';

export default {
};
</script>

<style>
model-viewer {
  width: 100%;
  height: 90%;
  background-color: #ffffff;
}


.progress-bar {
  display: block;
  width: 33%;
  height: 10%;
  max-height: 2%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 25px;
  box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.5), 0px 0px 5px 1px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.9);
  background-color: rgba(0, 0, 0, 0.5);
}

.progress-bar.hide {
  visibility: hidden;
  transition: visibility 0.3s;
}

.update-bar {
  background-color: rgba(255, 255, 255, 0.9);
  width: 0%;
  height: 100%;
  border-radius: 25px;
  float: left;
  transition: width 0.3s;
}

#ar-button {
  background-image: url(ar_icon.png);
  background-repeat: no-repeat;
  background-size: 20px 20px;
  background-position: 12px 50%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  bottom: 16px;
  padding: 0px 16px 0px 40px;
  font-family: Roboto Regular, Helvetica Neue, sans-serif;
  font-size: 14px;
  color: #4285f4;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  border: 1px solid #DADCE0;
}

#ar-button:active {
  background-color: #E8EAED;
}

#ar-button:focus {
  outline: none;
}

#ar-button:focus-visible {
  outline: 1px solid #4285f4;
}

@keyframes circle {
  from {
    transform: translateX(-50%) rotate(0deg) translateX(50px) rotate(0deg);
  }

  to {
    transform: translateX(-50%) rotate(360deg) translateX(50px) rotate(-360deg);
  }
}

@keyframes elongate {
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(-100px);
  }
}

model-viewer>#ar-prompt {
  position: absolute;
  left: 50%;
  bottom: 60px;
  animation: elongate 2s infinite ease-in-out alternate;
  display: none;
}

model-viewer[ar-status="session-started"]>#ar-prompt {
  display: block;
}

model-viewer>#ar-prompt>img {
  animation: circle 4s linear infinite;
}
</style>
