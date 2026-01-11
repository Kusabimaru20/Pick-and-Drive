<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Menu </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Početna',
    icon: 'favorite',
    link: '/',
  },
  {
    title: 'Pregled vozila',
    caption: 'Pregledajte našu ponudu',
    icon: 'list',
    link: '#/vozila',
  },
  {
    title: 'Pretraživanje vozila',
    caption: 'Nađite savršeno vozilo za Vas',
    icon: 'search',
    link: '#/pretraga-vozila',
  },
  {
    title: 'O nama',
    caption: 'Pitanja i Kontakt',
    icon: 'info',
    link: '#/o-nama',
  },
  {
    title: 'Lokacije naših salona',
    caption: 'Nađite najbliži salon',
    icon: 'place',
    link: '#/lokacije',
  },
  {
    title: 'Prijava / Registracija',
    caption: '???',
    icon: 'person',
    link: '#/prijava',
  },
  {
    title: 'Postavke',
    caption: '???',
    icon: 'settings',
    link: '#/postavke',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
