import Vue from "vue";
import weatherApp from "./components/MapWeather.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(weatherApp)
}).$mount("#app");
