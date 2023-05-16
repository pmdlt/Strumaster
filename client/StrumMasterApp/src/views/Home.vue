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
                  poster="poster.webp" shadow-intensity="0.89" exposure="0.18" shadow-softness="1"
                  camera-orbit="4.077deg 83.83deg 1707m" field-of-view="30deg">
                  <div class="progress-bar hide" slot="progress-bar">
                    <div class="update-bar"></div>
                  </div>
                  <button slot="ar-button" id="ar-button">
                    View in your space
                  </button>
                  <div id="ar-prompt">
                    <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
                  </div>
                </model-viewer>

                <p class="text-center">Welcome to the control center app of the StrumMaster project.<br>

                  We control the guitar.<br><br></p>
                <img src="1.png" alt="Image 1" class="image">
                <img src="2.png" alt="Image 2" class="image">
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ModelViewer } from 'vue-model-viewer';

export default {
  components: {
    ModelViewer
  }
};
</script>
