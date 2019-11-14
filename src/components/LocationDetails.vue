<template>
  <div class="slide">
    Nearest Location: {{ location }}
    <br />
    Current State: {{ weather_state }}
    <br />
    Temperature: {{ temperature }}
  </div>
</template>

<script>
export default {
  props: {
    location: String,
    weather_state: String,
    temperature: Number
  }
};
</script>

<style scoped>
.slide {
  border: 2px solid lightblue;
  border-radius: 10px;
  background: lightblue;
  color: white;
  font-size: 20px;
  margin-left: 10%;
  margin-top: 5%;
  position: absolute;
  --display: none;
  transition: display 1s;
}
</style>