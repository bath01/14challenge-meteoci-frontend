<!-- <template>
  <nav class="app-nav">
    <div class="nav-inner">

      <div class="nav-brand" @click="router.push('/')">
        <div class="brand-flag">
          <span style="background: #FF8C00"></span>
          <span style="background: #FFF"></span>
          <span style="background: #009E49"></span>
        </div>
        <span class="brand-name">
          Météo<span class="brand-accent">CI</span>
        </span>
      </div>

      <div class="nav-links">
        <span
          v-for="item in navItems"
          :key="item.key"
          class="nav-link"
          :class="{ active: route.path === item.path }"
          @click="router.push(item.path)">
          {{ item.label }}
        </span>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const navItems = [
  { key: 'home',     label: 'Accueil',    path: '/' },
  { key: 'details',  label: 'Détails',    path: '/details' },
  { key: 'forecast', label: 'Prévisions', path: '/forecast' },
  { key: 'about',    label: 'A propos',   path: '/about' },
]
</script>

< scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 40px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}


.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.brand-flag {
  display: flex;
  width: 24px;
  height: 3px;
  border-radius: 2px;
  overflow: hidden;
}

.brand-flag span {
  flex: 1;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: -0.5px;
}

.brand-accent {
  color: #FF8C00;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #fff;
}

.nav-link.active {
  font-weight: 700;
  color: #fff;
}
</style> -->

<template>
  <nav class="app-nav">
    <div class="nav-inner">

      <div class="nav-brand" @click="navigateTo('/')">
        <div class="brand-flag">
          <span style="background: #FF8C00"></span>
          <span style="background: #FFF"></span>
          <span style="background: #009E49"></span>
        </div>
        <span class="brand-name">
          Météo<span class="brand-accent">CI</span>
        </span>
      </div>

      <!-- Liens desktop -->
      <div class="nav-links" :class="{ open: menuOpen }">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.path"
          class="nav-link"
          active-class="active"
          @click="menuOpen = false">
          {{ item.label }}
        </NuxtLink>
      </div>

      <!-- Hamburger mobile -->
      <button class="hamburger" @click="menuOpen = !menuOpen">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

    </div>
  </nav>
</template>

<script setup lang="ts">
const menuOpen = ref(false)

const navItems = [
  { key: 'home',     label: 'Accueil',    path: '/' },
  { key: 'details',  label: 'Détails',    path: '/details' },
  { key: 'forecast', label: 'Prévisions', path: '/forecast' },
  { key: 'about',    label: 'A propos',   path: '/about' },
]
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 40px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  position: relative;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.brand-flag {
  display: flex;
  width: 24px;
  height: 3px;
  border-radius: 2px;
  overflow: hidden;
}

.brand-flag span { flex: 1; }

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: -0.5px;
}

.brand-accent { color: #FF8C00; }

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-link:hover { color: #fff; }
.nav-link.active { font-weight: 700; color: #fff; }

/* ——— Hamburger ——— */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
}

.hamburger span {
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;
  display: block;
}

/* Animation hamburger → croix */
.hamburger span:nth-child(1).open {
  transform: translateY(7px) rotate(45deg);
}
.hamburger span:nth-child(2).open {
  opacity: 0;
}
.hamburger span:nth-child(3).open {
  transform: translateY(-7px) rotate(-45deg);
}

/* ——— Mobile ——— */
@media (max-width: 768px) {
  .app-nav { padding: 0 16px; }

  .hamburger { display: flex; }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 56px;
    left: -16px;
    right: -16px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(20px);
    padding: 8px 24px 16px;
    gap: 0;
    z-index: 999;
  }

  .nav-links.open { display: flex; }

  .nav-link {
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    font-size: 15px;
    width: 100%;
  }

  .nav-link:last-child { border-bottom: none; }
}
</style>