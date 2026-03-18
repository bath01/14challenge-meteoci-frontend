<template>
  <div class="details-page">

    <div class="details-header">
      <p class="details-country" :style="{ color: textSub }">{{ city.country }}</p>
      <h2 class="details-city" :style="{ color: textMain }">{{ city.name }}</h2>
    </div>

    <div class="details-grid-top">
      <div
        v-for="(item, i) in topCards"
        :key="i"
        class="glass-card stat-card"
        :style="{ background: glassBg, borderColor: glassBorder }">
        <p class="stat-label" :style="{ color: textSub }">{{ item.label }}</p>
        <p class="stat-value" :style="{ color: item.colored ? accentColor : textMain }">{{ item.value }}</p>
        <p class="stat-sub" :style="{ color: textSub }">{{ item.sub }}</p>
      </div>
    </div>

    <div class="details-grid-bottom">
      <div class="glass-card uv-card" :style="{ background: glassBg, borderColor: glassBorder }">
        <p class="stat-label" :style="{ color: textSub }">UV Index</p>
        <p class="stat-value" :style="{ color: city.uv >= 8 ? '#FF6B6B' : textMain }">
          {{ city.uv }} / 11
        </p>
        <p class="stat-sub" :style="{ color: textSub }">
          {{ city.uv >= 8 ? 'Très élevé — Protection requise' : 'Modéré' }}
        </p>
      </div>

      <div class="glass-card condition-card" :style="{ background: glassBg, borderColor: glassBorder }">
        <p class="stat-label" :style="{ color: textSub }">Condition</p>
        <span class="condition-icon">{{ currentWeather.icon }}</span>
        <p class="condition-label" :style="{ color: textMain }">{{ currentWeather.label }}</p>
      </div>
    </div>

    <div class="glass-card hourly-card" :style="{ background: glassBg, borderColor: glassBorder }">
      <p class="stat-label" :style="{ color: textSub }">Température aujourd'hui</p>
      <div class="hourly-chart">
        <div v-for="(bar, i) in hourlyData" :key="i" class="hourly-col">
          <span class="hourly-temp" :style="{ color: textSub }">{{ bar.temp }}°</span>
          <div
            class="hourly-bar"
            :style="{
              height: bar.height + '%',
              background: bar.temp >= city.temp ? 'rgba(255,140,0,0.5)' : 'rgba(255,255,255,0.2)'
            }">
          </div>
          <span class="hourly-time" :style="{ color: textSub }">{{ bar.time }}</span>
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
const accentColor = '#FF6B6B'

const defaultWeather = { label: 'Ensoleillé', icon: '☀️', bg: '' }
const currentWeather = computed(() => weatherTypes[city.value.weather] ?? defaultWeather)

const topCards = computed(() => [
  {
    label: 'Température',
    value: city.value.temp + '°C',
    sub: 'Ressenti ' + city.value.feels + '°C',
    colored: false
  },
  {
    label: 'Humidité',
    value: city.value.humidity + '%',
    sub: city.value.humidity > 70 ? 'Humide' : 'Modéré',
    colored: false
  },
  {
    label: 'Vent',
    value: city.value.wind + ' km/h',
    sub: city.value.wind > 20 ? 'Fort' : 'Modéré',
    colored: false
  },
])

const hourlyData = computed(() => {
  return Array.from({ length: 24 }, (_, i) => {
    const base = city.value.temp
    const variation = Math.sin((i - 6) * Math.PI / 12) * 5
    const temp = Math.round(base + variation - 3)
    const maxH = base + 5
    const minH = base - 8
    const height = Math.max(((temp - minH) / (maxH - minH)) * 100, 10)
    return {
      temp,
      height: Math.round(height),
      time: String(i).padStart(2, '0') + 'h'
    }
  })
})
</script>

<style scoped>
.details-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
}

.details-header { margin-bottom: 32px; }
.details-country { font-size: 11px; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px; }
.details-city { font-size: 40px; font-weight: 800; font-family: 'DM Sans', sans-serif; margin: 0; letter-spacing: -1px; }

.details-grid-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.details-grid-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid;
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s;
}

.stat-label { font-size: 11px; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; }
.stat-value { font-size: 36px; font-weight: 700; font-family: 'DM Sans', sans-serif; margin: 0 0 4px; }
.stat-sub { font-size: 12px; font-family: 'DM Sans', sans-serif; margin: 0; }

.uv-card { text-align: center; }
.condition-card { text-align: center; }
.condition-icon { font-size: 48px; display: block; margin: 8px 0; }
.condition-label { font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif; margin: 0; }

/* .hourly-card { margin-bottom: 40px; }

.hourly-chart {
  display: flex;
  align-items: flex-end;
  height: 120px;
  gap: 4px;
  margin-top: 16px;
}

.hourly-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.hourly-temp { font-size: 9px; font-family: 'DM Sans', sans-serif; }
.hourly-bar { width: 100%; border-radius: 4px 4px 0 0; transition: all 0.3s; min-height: 4px; }
.hourly-time { font-size: 8px; font-family: 'DM Sans', sans-serif; } */

.hourly-card { margin-bottom: 40px; overflow: hidden; }

.hourly-chart {
  display: flex;
  align-items: flex-end;
  height: 120px;
  gap: 2px;
  margin-top: 16px;
  overflow: hidden;
  width: 100%;
}

.hourly-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  height: 100%;
  justify-content: flex-end;
  overflow: hidden;
}

.hourly-temp { font-size: 9px; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
.hourly-bar { width: 100%; border-radius: 4px 4px 0 0; transition: all 0.3s; min-height: 4px; }
.hourly-time { font-size: 8px; font-family: 'DM Sans', sans-serif; white-space: nowrap; }

@media (max-width: 768px) {
  .hourly-chart { gap: 1px; height: 100px; }
  .hourly-temp { font-size: 0; }
  .hourly-time { display: none; }
  .hourly-bar { border-radius: 2px 2px 0 0; }
}

@media (max-width: 480px) {
  .hourly-chart { height: 80px; }
}

@media (max-width: 768px) {
  .details-page { padding: 24px 16px; }
  .details-city { font-size: 28px; }
  .details-grid-top { grid-template-columns: 1fr 1fr; }
  .details-grid-bottom { grid-template-columns: 1fr 1fr; }
  .stat-value { font-size: 28px; }
  .hourly-time { display: none; }
  .glass-card { padding: 20px; }
}

@media (max-width: 480px) {
  .details-grid-top { grid-template-columns: 1fr; }
  .details-grid-bottom { grid-template-columns: 1fr; }
  .stat-value { font-size: 24px; }
  .details-city { font-size: 24px; }
}
</style>