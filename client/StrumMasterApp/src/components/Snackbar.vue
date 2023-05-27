<template>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">{{ snackbarText
    }}</v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            snackbarVisible: false,
            snackbarText: '',
            snackbarColor: '',
            snackbarTimeout: 2000,
        }
    },
    methods: {
        showSnackbar(text, color) {
            this.snackbarText = text
            this.snackbarColor = color
            this.snackbarVisible = true
            console.log("Message shown with text: " + text + " and color: " + color);
        },
    },
    mounted() {
        const thisInstance = this
        this.$root.$on('showSnackbar', function () {
            thisInstance.showSnackbar()
        })
    }
}
</script>
