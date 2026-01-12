<template>
  <q-img src="/slike/main.png" style="height: 100vh; width: 100%" fit="cover" />
  <div class="q-pa-md" style="color: white">
    <h1 style="font-weight: bold">NAŠA FLOTA</h1>
  </div>

  <div class="q-pa-md">
    <q-btn
      v-if="aktivnaKategorija"
      flat
      icon="arrow_back"
      label="Natrag na kategorije"
      @click="zatvoriVozila"
      class="q-mb-md"
    />
  </div>

  <div class="q-pa-md row items-start q-gutter-md" v-if="!aktivnaKategorija">
    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/SUV(0).jpg" />
      <q-card-section>
        <div align="left">
          <q-btn
            flat
            rounded
            label="SUV / Terenci"
            style="font-size: 20px; font-weight: bold"
            @click="otvoriKategoriju('SUV / Terenci')"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/sedan(0).jpg" />
      <q-card-section>
        <div align="left">
          <q-btn
            flat
            rounded
            label="Sedan / Limuzina"
            style="font-size: 20px; font-weight: bold"
            @click="otvoriKategoriju('Sedan / Limuzina')"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/sport(0).jpg" />
      <q-card-section>
        <div align="left">
          <q-btn
            flat
            rounded
            label="Sportski automobili"
            style="font-size: 20px; font-weight: bold; text-align: left"
            @click="otvoriKategoriju('Sportski automobili')"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/hatchback(0).jpeg" />
      <q-card-section>
        <div align="left">
          <q-btn
            flat
            rounded
            label="Kompaktna vozila"
            style="font-size: 20px; font-weight: bold"
            @click="otvoriKategoriju('Kompaktna vozila')"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/drugo.jpg" @click="otvoriKategoriju('Ostalo')" class="cursor-pointer" />
    </q-card>
  </div>

  <div class="q-pa-md row items-start q-gutter-md" v-else>
    <div class="col-12 q-mb-md">
      <h2>{{ aktivnaKategorija }}</h2>
    </div>

    <div v-if="isLoading" class="col-12 text-center text-h6 text-grey-6">
      <q-spinner-hourglass color="primary" size="2em" class="q-mr-sm" /> Učitavanje detalja
      vozila...
    </div>

    <q-card
      class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3"
      v-for="vozilo in filtriranaVozila"
      :key="vozilo.ime"
    >
      <img :src="vozilo.slika" />
      <q-card-section>
        <div class="text-h6">{{ vozilo.ime }} ({{ vozilo.godina || 'N/A' }})</div>
        <div class="text-subtitle2 q-mt-sm">Mjenjač: {{ vozilo.mjenjac || 'N/A' }}</div>
        <div class="text-caption text-grey q-mt-xs">
          {{ vozilo.opis ? vozilo.opis.substring(0, 50) + '...' : 'Nema opisa u bazi.' }}
        </div>

        <q-btn
          flat
          label="Više detalja"
          color="primary"
          class="q-mt-md"
          @click="prikaziDetalje(vozilo)"
        />
      </q-card-section>
    </q-card>

    <div
      v-if="!isLoading && filtriranaVozila.length === 0"
      class="col-12 text-center text-h6 text-grey-6"
    >
      Nema dostupnih vozila u kategoriji "{{ aktivnaKategorija }}".
    </div>
  </div>

  <q-dialog v-model="prikazModala">
    <q-card v-if="odabranoVozilo" style="width: 700px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h5 text-primary">Detalji o vozilu: {{ odabranoVozilo.ime }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="zatvoriDetalje" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6">
            <q-img :src="odabranoVozilo.slika" ratio="1" style="border-radius: 8px" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold">Kategorija:</div>
              <div class="text-body1">{{ odabranoVozilo.kategorija }}</div>
            </div>
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold">Godina proizvodnje:</div>
              <div class="text-body1">{{ odabranoVozilo.godina || 'N/A' }}</div>
            </div>
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold">Gorivo:</div>
              <div class="text-body1">{{ odabranoVozilo.gorivo || 'N/A' }}</div>
            </div>
            <div class="q-mb-md">
              <div class="text-subtitle1 text-weight-bold">Mjenjač:</div>
              <div class="text-body1">{{ odabranoVozilo.mjenjac || 'N/A' }}</div>
            </div>
          </div>

          <div class="col-12 q-mt-md">
            <div class="text-subtitle1 text-weight-bold">Opis:</div>
            <p class="text-body2">{{ odabranoVozilo.opis || 'Opis nije dostupan u bazi.' }}</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Zatvori" color="primary" @click="zatvoriDetalje" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
const aktivnaKategorija = ref(null)
const isLoading = ref(false)
const prikazModala = ref(false)
const odabranoVozilo = ref(null)

const API_URL = 'http://localhost:3000/api/automobili'

const primarnaVozila = ref([
  { ime: 'BMW X5', slika: '/slike/BMWX5.jpg', kategorija: 'SUV / Terenci' },
  { ime: 'Audi Q7', slika: '/slike/AUDIQ7.jpg', kategorija: 'SUV / Terenci' },
  { ime: 'Toyota RAV4', slika: '/slike/RAV4.jpg', kategorija: 'SUV / Terenci' },
  { ime: 'Hyundai Ioniq 5', slika: '/slike/hyundai-ioniq-5.jpg', kategorija: 'SUV / Terenci' },
  { ime: 'Mercedes C-klasa', slika: '/slike/Mercedes_C300D.jpg', kategorija: 'Sedan / Limuzina' },
  { ime: 'BMW Serija 3', slika: '/slike/BMW3.jpg', kategorija: 'Sedan / Limuzina' },
  { ime: 'Audi A4', slika: '/slike/A4.jpg', kategorija: 'Sedan / Limuzina' },
  { ime: 'Tesla Model 3', slika: '/slike/Model3.jpg', kategorija: 'Sedan / Limuzina' },
  { ime: 'Porsche 911', slika: '/slike/911.jpg', kategorija: 'Sportski automobili' },
  { ime: 'Audi R8', slika: '/slike/R8.jpg', kategorija: 'Sportski automobili' },
  { ime: 'BMW M4', slika: '/slike/M4.jpg', kategorija: 'Sportski automobili' },
  { ime: 'Volkswagen Golf 8', slika: '/slike/Golf8.jpg', kategorija: 'Kompaktna vozila' },
  { ime: 'Ford Focus', slika: '/slike/Focus.jpg', kategorija: 'Kompaktna vozila' },
  { ime: 'Hyundai i30', slika: '/slike/i30N.jpg', kategorija: 'Kompaktna vozila' },
  { ime: 'Volkswagen ID.4', slika: '/slike/ID4.jpg', kategorija: 'Kompaktna vozila' },
])

// === IZMIJENJENA FUNKCIJA (AXIOS) ===
const dohvatiIDopuniVozila = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(API_URL)
    const podaciIzBaze = response.data // Ovo su podaci sa slike: model, godina, tip...

    // Prolazimo kroz listu vozila koje već imam u kodu (BMW X5, Audi Q7...)
    primarnaVozila.value = primarnaVozila.value.map((vozilo) => {
      // Tražimo u podacima iz baze onaj redak koji odgovara modelu
      // npr. ako je vozilo.ime "BMW X5", tražimo onaj gdje je model "X5"
      const detalji = podaciIzBaze.find((bazaVozilo) => {
        if (!bazaVozilo.model) return false

        const imeUFrontendu = vozilo.ime.toLowerCase()
        const modelUBazi = bazaVozilo.model.toLowerCase().trim()

        // Provjerava sadrži li "BMW X5" riječ "X5"
        return imeUFrontendu.includes(modelUBazi)
      })

      if (detalji) {
        // Ako nađe podudaranje, puni podatke:
        return {
          ...vozilo,
          godina: detalji.godina,
          gorivo: detalji.gorivo,
          mjenjac: detalji.mjenjac,
          opis: detalji.opis,
          tip: detalji.tip,
          model_iz_baze: detalji.model, // sprema "X5" radi provjere
        }
      }

      return vozilo
    })

    console.log('Podaci uspješno povučeni i spojeni!')
  } catch (error) {
    console.error('Greška pri dohvaćanju s Axiosom:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  //šalje axios zahtjev server.js
  dohvatiIDopuniVozila()
})

const filtriranaVozila = computed(() => {
  if (!aktivnaKategorija.value) return []
  return primarnaVozila.value.filter((vozilo) => vozilo.kategorija === aktivnaKategorija.value)
})

const otvoriKategoriju = (kategorija) => {
  aktivnaKategorija.value = kategorija
}

const zatvoriVozila = () => {
  aktivnaKategorija.value = null
}

const prikaziDetalje = (vozilo) => {
  odabranoVozilo.value = vozilo
  prikazModala.value = true
}

const zatvoriDetalje = () => {
  odabranoVozilo.value = null
  prikazModala.value = false
}
</script>
