<template>
  <div class="countdown-container">
    <h2>Tiempo restante:</h2>
    <div class="countdown">{{ minutes }}:{{ seconds }}</div>
    <div v-if="finished" class="finished-msg">
      ⏰ ¡Se acabó el tiempo! podéis entrar.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Duración inicial en segundos (15 minutos)
const duration = ref(12 * 60);
const finished = ref(false);
let timer = null;

// Computed para mostrar minutos y segundos con dos dígitos
const minutes = computed(() =>
  String(Math.floor(duration.value / 60)).padStart(2, "0")
);
const seconds = computed(() => String(duration.value % 60).padStart(2, "0"));

// Función para actualizar el contador
const updateCountdown = () => {
  if (duration.value > 0) {
    duration.value--;
  } else {
    finished.value = true;
    clearInterval(timer);
  }
};

onMounted(() => {
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.countdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Courier New", monospace;
}

.countdown {
  font-size: 3rem;
  color: #04c0a8;
  background: #1a1a1a;
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 0 10px #04c0a8;
}

.finished-msg {
  margin-top: 1rem;
  color: orange;
  font-weight: bold;
}
</style>
