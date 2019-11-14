<template>
  <svg
    id="loading-bar"
    xmlns="http://www.w3.org/2000/svg"
    width="55"
    height="28"
    viewBox="0 0 36 22"
    fill="#53f"
  >
    <g>
      <rect id="loading-bar-left" width="8" height="22" />
      <rect id="loading-bar-middle" width="8" height="22" x="14" />
      <rect id="loading-bar-right" width="8" height="22" x="28" />
    </g>
  </svg>
</template>

<script>
export default {};
</script>

<style scoped>
.top {
  position: absolute;
  z-index: -1;
}

#loading-bar {
  background-color: white;
}
#loading-bar-left {
  animation: loading-bar-morph 1s linear 0.1s infinite;
  transform-origin: center;
}
#loading-bar-middle {
  animation: loading-bar-morph 1s linear 0.2s infinite;
  transform-origin: center;
}
#loading-bar-right {
  animation: loading-bar-morph 1s linear 0.4s infinite;
  transform-origin: center;
}

@keyframes loading-bar-morph {
  0% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(0.7);
  }
  75% {
    transform: scaleY(0.15);
  }
}
</style>