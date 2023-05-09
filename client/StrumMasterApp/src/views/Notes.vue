<template>
  <v-app id="inspire">
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="3">
            <v-sheet rounded="lg">
              <the-menu-bar />
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="9">
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>

                <v-form ref="form">
                  <p class="text-center">Enter the note you want to play<br><br></p>

                  <v-text-field v-model="note" label="Note" variant="outlined"></v-text-field>

                  <v-btn @click="playNote" block class="mt-2">Play note</v-btn><br><br>
                </v-form>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TheMenuBar from '../components/Menu.vue'

export default {
  components: {
    TheMenuBar,
  },
  data: () => ({
    note: null,
    snackbarText: null,
    snackbarColor: null,
    snackbarVisible: false,
  }),
  methods: {
    async playNote() {
      try {
        const response = await fetch(`http://192.168.1.1/play_note?id=${this.note}`);
        if (response.ok) {
          this.snackbarText = 'Note played successfully';
          this.snackbarColor = 'success';
        } else {
          this.snackbarText = 'An error occurred while playing the note';
          this.snackbarColor = 'error';
        }
      } catch (error) {
        this.snackbarText = 'An error occurred while playing the note';
        this.snackbarColor = 'error';
      } finally {
        this.snackbarVisible = true;
      }
    },
    hideSnackbar() {
      this.snackbarVisible = false;
    },
  },
}
</script>
