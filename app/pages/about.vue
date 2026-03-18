<template>
  <div class="about-page">

    <div class="glass-card about-main" :style="{ background: glassBg, borderColor: glassBorder }">
      <div class="ci-flag">
        <span style="background: #FF8C00"></span>
        <span style="background: #FFF"></span>
        <span style="background: #009E49"></span>
      </div>
      <h3 class="about-title" :style="{ color: textMain }">MétéoCI</h3>
      <p class="about-text" :style="{ color: textSub }">
        Jour 5 du Challenge 14-14-14. MétéoCI est une application météo immersive avec des fonds
        d'écran dynamiques qui changent selon les conditions météorologiques de la ville sélectionnée.
      </p>
      <p class="about-text" :style="{ color: textSub }">
        Le design s'inspire du style fullscreen immersif avec glassmorphism (tendance 2025-2026),
        où chaque condition météo transforme complètement l'ambiance visuelle de l'app.
      </p>
    </div>

    <div class="about-grid">

      <div class="glass-card" :style="{ background: glassBg, borderColor: glassBorder }">
        <p class="section-label" :style="{ color: textSub }">L'équipe</p>
        <div
          v-for="(member, i) in teamMembers"
          :key="i"
          class="team-member">
          <div class="team-avatar">{{ getInitials(member.name) }}</div>
          <div>
            <p class="member-name" :style="{ color: textMain }">{{ member.name }}</p>
            <p class="member-role" :style="{ color: textSub }">{{ member.role }}</p>
          </div>
        </div>
      </div>

      <div class="glass-card" :style="{ background: glassBg, borderColor: glassBorder }">
        <p class="section-label" :style="{ color: textSub }">Stack</p>
        <div
          v-for="(item, i) in stackItems"
          :key="i"
          class="stack-item"
          :style="{ background: stackBg }">
          <span class="stack-tech" :style="{ color: textMain }">{{ item }}</span>
        </div>
      </div>

    </div>

    <div class="glass-card about-footer" :style="{ background: glassBg, borderColor: glassBorder }">
      <p class="footer-text" :style="{ color: textSub }">
        Open Source sur <span class="orange">225os.com</span> & <span class="green">GitHub</span>
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
const { selectedCity, weatherTypes } = useWeather()

const isLight = computed(() => ['sunny', 'partlyCloudy'].includes(selectedCity.value.weather))
const textMain    = computed(() => isLight.value ? 'rgba(0,0,0,0.85)'       : 'rgba(255,255,255,0.95)')
const textSub     = computed(() => isLight.value ? 'rgba(0,0,0,0.5)'        : 'rgba(255,255,255,0.6)')
const glassBg     = computed(() => isLight.value ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)')
const glassBorder = computed(() => isLight.value ? 'rgba(255,255,255,0.5)'  : 'rgba(255,255,255,0.15)')
const stackBg     = computed(() => isLight.value ? 'rgba(0,0,0,0.06)'       : 'rgba(255,255,255,0.08)')

const teamMembers = [
  { name: 'Bath Dorgeles',  role: 'Chef de projet & Front' },
  { name: 'Oclin Marcel C.', role: 'Dev Front-end' },
  { name: 'Rayane Irie',    role: 'Back-end (Express)' },
]

const stackItems = ['Nuxt.js', 'Node.js (Express)', 'API OpenWeather']

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('')
</script>

<style scoped>
.about-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
}

.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid;
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s;
}

.about-main { margin-bottom: 20px; }

.ci-flag {
  display: flex;
  width: 48px;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.2);
}

.ci-flag span { flex: 1; }

.about-title { font-size: 24px; font-weight: 800; font-family: 'DM Sans', sans-serif; margin: 0 0 16px; }
.about-text { font-size: 15px; line-height: 1.8; font-family: 'DM Sans', sans-serif; margin: 0 0 12px; }
.about-text:last-child { margin-bottom: 0; }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.about-grid .glass-card { padding: 24px; }

.section-label {
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.team-member:last-child { margin-bottom: 0; }

.team-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #FF8C00, #009E49);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  flex-shrink: 0;
}

.member-name { font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; margin: 0; }
.member-role { font-size: 11px; font-family: 'DM Sans', sans-serif; margin: 2px 0 0; }

.stack-item {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.stack-item:last-child { margin-bottom: 0; }
.stack-tech { font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; }

.about-footer { text-align: center; padding: 20px; }
.footer-text { font-size: 13px; font-family: 'DM Sans', sans-serif; margin: 0; }
.orange { color: #FF8C00; font-weight: 600; }
.green { color: #009E49; font-weight: 600; }

@media (max-width: 768px) {
  .about-page { padding: 24px 16px; }
  .about-grid { grid-template-columns: 1fr; }
  .about-title { font-size: 20px; }
  .about-text { font-size: 14px; }
  .glass-card { padding: 20px; }
}

@media (max-width: 480px) {
  .about-title { font-size: 18px; }
  .member-name { font-size: 12px; }
  .member-role { font-size: 10px; }
}
</style>