<template>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">{{ snackbarText
    }}</v-snackbar>
</template>

<script>
export default {
    methods: {
        data: () => ({
            snackbarVisible: false,
            snackbarText: '',
            snackbarColor: '',
            snackbarTimeout: 2000,
        }),
        show(text, color) {
            this.snackbarText = text
            this.snackbarColor = color
            this.snackbarVisible = true
        },
    }
}
</script>