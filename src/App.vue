<template>
  <!--<div id="app" v-bind:style="{ backgroundImage: 'url(' + image + ')'  }"> -->
  <div id="app">
    <Map v-bind:lat="lat" v:bind:long="long" v-on:weather="chgbkg" />
    <transition name="fade">
      <Loc
        class="loc"
        v-bind:location="location"
        v-bind:weather_state="weather_state"
        v-bind:temperature="temperature"
        v-show="weather"
      />
    </transition>
  </div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
import Map from "./components/map.vue";
import Loc from "./components/LocationDetails";
//import rain from "./gifs/rainy/rain.svg";
//import sunny from "./gifs/rainy/sunny.svg";

export default {
  name: "app",
  data() {
    return {
      lat: null,
      long: null,
      weather: false,
      location: "",
      weather_state: "",
      temperature: "",
      image: ""
    };
  },
  components: {
    Map,
    Loc
  },
  created() {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log("coords: ", pos.coords);
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
    });
    console.log("current locaiton: ", this.lat, this.long);
  },
  methods: {
    chgbkg(e) {
      console.log("Event: ", e);
      document.body.style.transitionDuration = "1s";
      //document.body.style.backgroundColor = "#99ccff";
      //this.image = this.image == sunny ? rain : sunny;
      this.location = e.city;
      this.weather_state = e.weather;
      this.temperature = e.temperature;
      this.image = this.getImageName(e.abbr);
      document.body.style.backgroundImage = "url(" + this.image + ")";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      this.weather = true;
      console.log(this.image);
    },
    getImageName(code) {
      let images = {
        hr: "rain",
        h: "hail",
        t: "storm",
        hc: "cloudy",
        sn: "snow",
        c: "sunny",
        lr: "rain",
        lc: "cloudy",
        s: "rain"
      };
      console.log(images[code] + "gif");
      return images[code] + ".gif";
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  align-content: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
  --display: flex;
  --flex-direction: row;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.none {
  display: none;
}
</style>
