<template>
  <Page>
    <ActionBar>
      <Label text="Home"/>
    </ActionBar>

    <GridLayout>
      <Label class="info" :text="message" @tap="logMessage" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";

  export default Vue.extend({
    computed: {
      message() {
        return "Blank {N}-Vue app";
      }
    },

    methods: {
      logMessage() {
        console.log('You have tapped the message!')
      }
    }
  });
</script>

<style scoped>
  .info {
    font-size: 20;
    horizontal-align: center;
    vertical-align: center;
  }
</style>
