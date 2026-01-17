<template>
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
            @click="otvoriKategoriju('SUV')"
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
            @click="otvoriKategoriju('Limuzina')"
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
            @click="otvoriKategoriju('Sportski')"
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
            @click="otvoriKategoriju('Kompakt')"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <img src="/slike/drugo.jpg" @click="otvoriKategoriju('Kombi')" class="cursor-pointer" />
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
      :key="vozilo.naziv"
    >
      <img :src="vozilo.slika" />
      <q-card-section>
        <div class="text-h6">{{ vozilo.naziv }} ({{ vozilo.godina || 'N/A' }})</div>
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
        <div class="text-h5 text-primary">Detalji o vozilu: {{ odabranoVozilo.naziv }}</div>
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
              <div class="text-body1">{{ odabranoVozilo.tip }}</div>
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

<script setup> //Dodane rute i router
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
const aktivnaKategorija = ref(null)
const isLoading = ref(false)
const prikazModala = ref(false)
const odabranoVozilo = ref(null)

const route = useRoute()
const router = useRouter()
const API_URL = 'http://localhost:3000/api/automobili-potrebnapolja'
const vozila = ref([]) // Kategorije, slike... nam se dohvacaju iz baze, NE lokalno

const dohvatiVozila = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get(API_URL)
    vozila.value = data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  dohvatiVozila()

  if (route.params.kategorija) {
    aktivnaKategorija.value = decodeURIComponent(route.params.kategorija)
  }
})

watch(
  () => route.params.kategorija,
  (novaKategorija) => {
    if (novaKategorija) {
      aktivnaKategorija.value = decodeURIComponent(novaKategorija)
    } else {
      aktivnaKategorija.value = null
    }
  }
)


const filtriranaVozila = computed(() => {
  if (!aktivnaKategorija.value) return []
  return vozila.value.filter((vozilo) => vozilo.tip === aktivnaKategorija.value)
})

const otvoriKategoriju = (kategorija) => {
  aktivnaKategorija.value = kategorija
}

const zatvoriVozila = () => { //Dodan router push
  aktivnaKategorija.value = null
  router.push('/pregled-vozila')
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

<style lang="sass" scoped> 
.my-card 
  width: 100%
  max-width: 353px
</style>
