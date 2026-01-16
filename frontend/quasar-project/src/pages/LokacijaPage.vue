<template>
  <q-page padding>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Lokacije</q-toolbar-title>
      <div class="row items-center">
        <q-input dense debounce="300" v-model="query" placeholder="Pretraži..." outlined class="q-mr-sm black-input" bg-color="white"/>
        <q-btn flat round icon="refresh" @click="fetchLocations" />
      </div>
    </q-toolbar>

    <div class="row q-mt-md" style="height: calc(100vh - 120px);">
      <div class="col-12 col-md-4">
        <q-card flat class="full-height overflow-auto">
          <q-list bordered separator>
            <q-item v-for="loc in filteredLocations" :key="loc.id" clickable @click="selectLocation(loc)">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ loc.grad }}</q-item-label>
                <q-item-label caption>{{ loc.adresa }}</q-item-label>
                <q-item-label caption class="text-blue">{{ loc.latitude }}, {{ loc.longitude }}</q-item-label>
                <q-item-label caption>Tel: {{ loc.telefon }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="place" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <div ref="mapContainer" style="height: 100%; width: 100%; min-height: 400px;"></div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Slike markera - promjena da radi - maknuto koristenje .mergeOptions
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIcon2x,
  iconRetinaUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})



const map = ref(null)
const mapContainer = ref(null)
const markers = ref([])
const query = ref('')
const locations = ref([]) // Ovdje dolaze podaci iz baze

// Filtriranje koristi nove nazive: grad i adresa
const filteredLocations = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return locations.value
  return locations.value.filter(l => 
    (l.grad + ' ' + l.adresa).toLowerCase().includes(q)
  )
})

// Dohvaćanje podataka s tvog servera
async function fetchLocations() {
  try {
    const response = await fetch('http://localhost:3000/lokacije') //bile su male greške u Heidi, pa je to editano
    const data = await response.json()
    locations.value = data
    rebuildMarkers()
    
    setTimeout(() => {
      map.value.invalidateSize();
    }, 200); // Mala odgoda osigurava da je DOM spreman
    
  } catch (error) {
    console.error("Greška pri dohvaćanju:", error)
  }
}

function rebuildMarkers() {
  // Brišemo stare markere s karte
  markers.value.forEach(m => m.remove())
  markers.value = []

  // Dodajemo nove
  locations.value.forEach(loc => {
    if (loc.latitude && loc.longitude) {
      const m = L.marker([loc.latitude, loc.longitude], { icon: defaultIcon })
        .addTo(map.value)
        .bindPopup(`<b>${loc.grad}</b><br>${loc.adresa}`)
      markers.value.push(m)
    }
  })
}

function selectLocation(loc) {
  if (!map.value) return
  map.value.setView([loc.latitude, loc.longitude], 15)
  
  const m = markers.value.find(marker => {
    const p = marker.getLatLng()
    return p.lat == loc.latitude && p.lng == loc.longitude
  })
  if (m) m.openPopup()
}

onMounted(() => {
  map.value = L.map(mapContainer.value).setView([45.8, 15.98], 7)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
  fetchLocations()
})

onBeforeUnmount(() => {
  if (map.value) map.value.remove()
})
</script>
