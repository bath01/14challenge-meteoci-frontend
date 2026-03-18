<template>
  <div class="forecast-page">

    <div class="forecast-header">
      <h2 class="forecast-title" :style="{ color: textMain }">Prévisions 7 jours</h2>
      <p class="forecast-subtitle" :style="{ color: textSub }">{{ city.name }}, {{ city.country }}</p>
    </div>

    <div class="forecast-list">
      <div
        v-for="(day, i) in nextDays"
        :key="i"
        class="glass-card forecast-row"
        :style="{ background: glassBg, borderColor: glassBorder }">

        <div class="forecast-day">
          <p class="day-name" :style="{ color: textMain }">{{ day }}</p>
        </div>

        <span class="forecast-icon">{{ weatherTypes[city.forecastW[i] ?? 'sunny']?.icon }}</span>

        <p class="forecast-condition" :style="{ color: textSub }">
          {{ weatherTypes[city.forecastW[i] ?? 'sunny']?.label }}
        </p>

        <div class="forecast-temps">
          <span class="temp-min" :style="{ color: textSub }">{{ tempMins[i] ?? '—' }}°</span>
          <div class="temp-bar">
            <div class="temp-bar-fill" :style="{ right: (100 - ((city.forecast[i] ?? 0) / 40) * 100) + '%' }"></div>
          </div>
          <span class="temp-max" :style="{ color: textMain }">{{ city.forecast[i] ?? '—' }}°</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const { city, weatherTypes, fetchCity } = useWeather()

onMounted(async () => {
  await fetchCity(city.value.name)
})

const isLight = computed(() => ['sunny', 'partlyCloudy'].includes(city.value.weather))
const textMain    = computed(() => isLight.value ? 'rgba(0,0,0,0.85)'       : 'rgba(255,255,255,0.95)')
const textSub     = computed(() => isLight.value ? 'rgba(0,0,0,0.5)'        : 'rgba(255,255,255,0.6)')
const glassBg     = computed(() => isLight.value ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)')
const glassBorder = computed(() => isLight.value ? 'rgba(255,255,255,0.5)'  : 'rgba(255,255,255,0.15)')

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const today = new Date().getDay()
const nextDays = Array.from({ length: 7 }, (_, i) => days[(today + i + 1) % 7])

const tempMins = computed(() =>
  city.value.forecastMin?.length
    ? city.value.forecastMin
    : city.value.forecast.map((t: number) => t - 4)
)
</script>

<style scoped>
.forecast-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

.forecast-header { margin-bottom: 32px; }
.forecast-title { font-size: 36px; font-weight: 800; font-family: 'DM Sans', sans-serif; margin: 0 0 8px; letter-spacing: -1px; }
.forecast-subtitle { font-size: 14px; font-family: 'DM Sans', sans-serif; margin: 0; }

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid;
  border-radius: 16px;
  transition: all 0.3s;
}

.forecast-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.forecast-row:hover { transform: translateY(-2px); }

.forecast-day { width: 60px; }
.day-name { font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; margin: 0; }
.forecast-icon { font-size: 28px; }

.forecast-condition {
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  width: 160px;
  text-align: center;
}

.forecast-temps { display: flex; align-items: center; gap: 8px; }
.temp-min { font-size: 13px; font-family: 'DM Sans', sans-serif; }
.temp-max { font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; }

.temp-bar {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.15);
  position: relative;
}

.temp-bar-fill {
  position: absolute;
  left: 20%;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #009E49, #FF8C00);
}

@media (max-width: 768px) {
  .forecast-page { padding: 24px 16px; }
  .forecast-title { font-size: 26px; }
  .forecast-row { padding: 12px 16px; gap: 8px; }
  .forecast-condition { display: none; }
  .forecast-day { width: 45px; }
  .temp-bar { width: 50px; }
  .day-name { font-size: 13px; }
}

@media (max-width: 480px) {
  .temp-min { display: none; }
  .temp-bar { display: none; }
  .forecast-row { padding: 10px 12px; }
  .forecast-icon { font-size: 22px; }
}
</style>