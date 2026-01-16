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

        <q-item v-if="korisnikIme" class="q-mb-sm bg-grey-2">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Prijavljeni ste kao:</q-item-label>
            <q-item-label class="text-weight-bold">{{ korisnikIme }}</q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink 
          v-for="link in filtriraniLinkovi" 
          :key="link.title" 
          v-bind="link" 
        />

        <q-separator q-my-md v-if="korisnikIme" />

        <q-item v-if="korisnikIme" clickable v-ripple @click="izvrsiOdjavu" class="text-red">
          <q-item-section avatar>
            <q-icon name="logout" color="red" />
          </q-item-section>
          <q-item-section>Odjavi se</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const leftDrawerOpen = ref(false)
const korisnikIme = ref('')

onMounted(() => {
  korisnikIme.value = localStorage.getItem('korisnicko_ime') || ''
})

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
    link: '#/pregled-vozila',
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
    link: '#/onama',
  },
  {
    title: 'Lokacije naših salona',
    caption: 'Nađite najbliži salon',
    icon: 'place',
    link: '#/lokacije',
  },
  {
    title: 'Registracija',
    caption: 'Registrirajte se',
    icon: 'person',
    link: '#/registracija',
    meta:'gost',
  },
  {
    title: 'Prijava',
    caption: 'Prijavite se',
    icon: 'person',
    link: '#/prijava',
    meta:'gost',
  },
  {
    title: 'Moje rezervacije',
    caption: '',
    icon: 'person',
    link: '#/mojerezervacije',
    meta:'korisnik',
  },
  {
    title: 'Postavke',
    caption: 'Postavke korisnika',
    icon: 'settings',
    link: '#/postavke',
    meta:'korisnik',
  },
]

// funkcija koja filtrira linkove koje ne zelim vidjet kad je korisnik prijavljen
const filtriraniLinkovi = computed(() => {
  const prijavljen = !!korisnikIme.value //boolean value

  return linksList.filter(link => { //Promjenjeno da ima i linkove koji se prikazuju samo prijavljenima
    // samo gost
    if (link.meta === 'gost') return !prijavljen

    // samo prijavljeni
    if (link.meta === 'korisnik') return prijavljen

    // svi ostali
    return true
  })
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function izvrsiOdjavu() {
  localStorage.clear()
  router.push('/prijava').then(() => { window.location.reload(); });
}
</script>
