<template>
  <div class="container">
    <div class="block">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="mob">
      Yet Another Weather App
      <br />Tap on map to select Location
    </div>
    <div class="menu">Info</div>
    <transition name="fade">
      <div class="showinfo" v-show="info">
        This app is created for learning purposes.
        <li>Vue JS is used as Javascript library</li>
        <li>For map, leaflet api is used</li>
        <li>It uses MetaWeather API, which gives nearest available location data and not exact coordinates data.</li>
        <li>Back ground images are shown based on API response code</li>
        <li>Sometimes, API send error code due to CORS / unavailability. In this case, the weather will not be updated. :(</li>
        <br />
        <br />
      </div>
    </transition>
    <div class="desc" style="color: white; left: 45%; font-size: 30px; position: absolute;">
      Yet Another Weather App
      <div
        class="desc2"
        style="color: white; left: 10%; font-size: 20px; position: relative;"
      >Click anywhere on the map to get weather details</div>
    </div>

    <div id="map" :v-on="onMapClick"></div>
    <transition name="fade">
      <div class="loc" v-if="fetchWeather">
        <h4>
          Nearest Loc: {{ location }} |
          {{ weather_state }} | {{ temperature }} &deg;C
        </h4>
      </div>
      <loading class="loc" v-else />
    </transition>
  </div>
</template>

<script>
import L from "leaflet";
import loading from "./LoadingBars";

let mymap;

export default {
  components: { loading },
  data() {
    return {
      loading: false,
      lat: null,
      long: null,
      fetchWeather: false,
      location: "",
      weather_state: "",
      temperature: "",
      image: "",
      wind_speed: "",
      abbr: "",
      info: false
    };
  },
  mounted() {
    // Coordinates, Zoom

    navigator.geolocation.getCurrentPosition(pos => {
      console.log("coords: ", pos.coords);
      this.lat = pos.coords.latitude;
      this.long = pos.coords.longitude;
      mymap = L.map("map").setView([this.lat, this.long], 4);
      //mymap = L.map("map").setView([34.6739672, 33.0110247], 4);

      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3Nib3JhIiwiYSI6ImNrMm9yeTliejEzMzkzY2xucHhlajI0bGQifQ.RIRPo0QfVPHZWDS7d-fTQA",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 50,
          id: "mapbox.streets",
          accessToken:
            "pk.eyJ1Ijoia3Nib3JhIiwiYSI6ImNrMm9yeTliejEzMzkzY2xucHhlajI0bGQifQ.RIRPo0QfVPHZWDS7d-fTQA"
        }
      ).addTo(mymap);
      mymap.on("click", this.onMapClick);
      this.getWeather(this.lat, this.long);
      //document.getElementById("map").style.width = "300px";
    });
    let info = document.querySelector(".menu");
    info.onmouseenter = () => {
      this.info = true;
    };

    info.onmouseleave = () => {
      this.info = false;
    };
    //console.log("current locaiton: ", this.lat, this.long);
    document.body.style.background = "grey";
  },
  methods: {
    getFakeWeather() {
      let weatherState = {
        Snow: "sn",
        Sleet: "sl",
        Hail: "h",
        Thunderstorm: "t",
        "Heavy Rain": "hr",
        "Light Rain": "lr",
        Showers: "s",
        "Heavy Cloud": "hc",
        "Light Cloud": "lc",
        Clear: "c"
      };
      setInterval(function() {
        let keys = Object.keys(weatherState);
        let curr_weather =
          weatherState[keys[(keys.length * Math.random()) << 0]];
        console.log(curr_weather);
      }, 2000);
    },
    getWeather(lat, lng) {
      console.log("loading value: ", this.loading);
      let url =
        "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=" +
        lat +
        "," +
        lng;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          console.log(data[0].woeid);
          url =
            "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/" +
            data[0].woeid;
          fetch(url)
            .then(res => res.json())
            .then(data => {
              console.log(data.consolidated_weather[0]);

              this.location = data.title;
              this.weather_state =
                data.consolidated_weather[0].weather_state_name;
              this.temperature = data.consolidated_weather[0].the_temp.toFixed(
                2
              );
              this.wind_speed = data.consolidated_weather[0].wind_speed;
              this.abbr = data.consolidated_weather[0].weather_state_abbr;

              this.image = this.getImageName(this.abbr);

              document.body.style.backgroundImage = "url(" + this.image + ")";

              document.body.style.backgroundSize = "cover";
              document.body.style.transitionDuration = "1s";

              console.log(this.image);

              document.getElementById("map").style.opacity = "100%";
              this.fetchWeather = true;
            })
            .catch(err => {
              console.log(err);
              document.getElementById("map").style.opacity = "100%";
              this.fetchWeather = false;
            });
        })
        .catch(err => {
          console.log(err);
          document.getElementById("map").style.opacity = "100%";
          this.fetchWeather = false;
        });
    },
    onMapClick(e) {
      this.fetchWeather = false;
      document.getElementById("map").style.opacity = "70%";
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `<p style="background-color: blue; color: white">This Location :  ${e.latlng.lat.toFixed(
            3
          ) +
            ", " +
            e.latlng.lng.toFixed(3)}</p>`
        )
        .openOn(mymap);

      this.getWeather(e.latlng.lat, e.latlng.lng);
    },
    changebkimage(e) {
      console.log("Event: ", e);
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
        hr: "heavy-rain",
        h: "hail",
        t: "storm",
        hc: "heavy-cloud",
        sn: "snow",
        c: "sunny",
        lr: "light-rain",
        lc: "cloudy2",
        s: "showers"
      };
      console.log(images[code] + ".gif");
      return images[code] + ".gif";
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:400, 900, 500");

#app {
  font-family: "Roboto", sans-serif;
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
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.none {
  display: none;
}

#map {
  height: 300px;
  width: 400px;
  margin-left: 10%;
  margin-top: 5%;
  border: 10px solid #1fa2ff;
  border-radius: 25px;
  position: relative;
  transition: width 0.4s, height 0.4s, opacity 0.5s;
}

.mob {
  display: block;
  color: white;
  font-size: 15px;
  position: absolute;
  top: 1%;
  left: 20%;
}

#map:hover {
  width: 600px;
  height: 400px;
}

.loc {
  font-family: "Roboto", sans-serif;
  border: 3px solid #1fa2ff;
  border-radius: 10px;
  background: white;
  color: black;
  font-size: 11px;
  margin-left: 20%;
  margin-top: 1%;
  padding: 3px;
  position: absolute;
  --display: none;
  transition: display 1s;
}

.block {
  width: 100%;
  height: 760px;
  background: linear-gradient(150deg, #53f 15%, #05d5ff 70%, #a6ffcb 94%);
  transform: skewY(-12deg);
  transform-origin: 0;
  position: absolute;
  top: 0;
  left: 0;
}
.block span {
  height: 190px;
  position: absolute;
  --border-radius: 50%;
}
.block span:nth-child(1) {
  width: 33.3%;
  width: calc(100% / 3);
  left: -16.66666%;
  left: calc(calc(calc(100% / 3) / 2) * -1);
  background: #53f;
}
.block span:nth-child(2) {
  width: 33.33333%;
  width: calc(100% / 3);
  top: 0;
  left: 16.66666%;
  left: calc(calc(100% / 3) / 2);
  right: auto;
  background: #4553ff;
}
.block span:nth-child(3) {
  width: 33.33333%;
  width: calc(100% / 3);
  left: 49.99999%;
  left: calc(calc(calc(100% / 3) / 2) + calc(100% / 3));
  bottom: auto;
  background: #4f40ff;
}
.block span:nth-child(4) {
  width: 33.33333%;
  width: calc(100% / 3);
  bottom: 0;
  background: #1fa2ff;
}

.menu {
  left: 90%;
  height: 20px;
  background: transparent;
  padding: 2%;
  color: white;
  font-size: 30px;
  top: 2%;
  position: absolute;
}

.showinfo {
  height: 15%;
  position: absolute;
  width: 20%;
  background-color: white;
  left: 70%;
  padding: 3%;
  font-size: 18px;
  border-radius: 20px;
  --border: 10px solid #1fa2ff;
}

.showinfo > li {
  font-size: 15px;
}

@keyframes animatedBackground {
  from {
    background-position: 0 100%;
  }
  to {
    background-position: 0 0;
  }
}

@media screen and (max-width: 700px) {
  #map {
    height: 300px;
    width: 370px;
    top: 20px;
    left: 0;
  }

  .loc {
    top: 55%;
  }

  #map:hover {
    height: 300px;
    width: 370px;
  }

  .block {
    height: 420px;
    transform: none;
  }

  .menu {
    display: none;
  }

  .showinfo {
    display: none;
  }

  .desc {
    display: none;
  }
}

@media screen and (min-width: 700px) {
  .desc {
    display: none;
  }

  .block {
    height: 650px;
    --transform: skewY(-30deg);
  }

  #map:hover {
    height: 300px;
    width: 400px;
  }

  .showinfo {
    height: 50%;
  }
}

@media screen and (min-width: 900px) {
  .block {
    height: 750px;
    transform: skewY(-24deg);
  }
  .showinfo {
    height: 40%;
  }
  #map:hover {
    width: 480px;
    height: 400px;
  }
}

@media screen and (min-width: 1200px) {
  .mob {
    display: none;
  }
  .desc {
    display: block;
  }
  .block {
    height: 750px;
    transform: skewY(-18deg);
  }
  .showinfo {
    height: 30%;
  }
  #map:hover {
    width: 520px;
    height: 400px;
  }
}

@media screen and (min-width: 1600px) {
  .block {
    height: 790px;
    transform: skewY(-12deg);
  }
  .showinfo {
    height: 16%;
  }
  #map:hover {
    width: 600px;
    height: 400px;
  }
}
</style>
