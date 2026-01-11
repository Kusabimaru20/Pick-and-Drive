<template>
  <q-page padding style="height: 100vh; display: flex;">

    <div style="width: 300px; flex-shrink: 0; overflow-y: auto; border-right: 1px solid #ddd; padding: 16px;">
      <div class="text-h6 q-mb-md">Filteri</div>

      <!-- Marka -->
      <div class="q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Marka vozila</div>
        <q-checkbox
          v-for="b in marka"
          :key="b"
          v-model="selectedMarka"
          :label="b"
          :val="b"
          @update:model-value="applyFilters"
        />
      </div>

      <q-separator color="grey-3" :thickness="1" />

      <!-- Tip vozila -->
      <div class="q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Tip vozila</div>
        <q-checkbox
          v-for="t in tipovi"
          :key="t"
          v-model="selectedTipovi"
          :label="t"
          :val="t"
          @update:model-value="applyFilters"
        />
      </div>

      <q-separator color="grey-3" :thickness="1" />

      <!-- Mjenjač -->
      <div class="q-mb-md">
        <q-btn-toggle
          v-model="selectedMjenjac"
          toggle-color="primary"
          flat
          :options="[
            {label: 'Automatik', value: 'automatik'},
            {label: 'Manualni', value: 'manualni'},
          ]"
          @update:model-value="applyFilters"
        />
      <q-separator color="grey-3" :thickness="1" />
      </div>

      <!-- Gorivo -->
      <div class="q-mb-md">
        <div class="text-subtitle1 q-mb-sm">Vrsta goriva</div>
        <q-checkbox
          v-for="g in gorivo"
          :key="g"
          v-model="selectedGorivo"
          :label="g"
          :val="g"
          @update:model-value="applyFilters"
        />
      </div>

      <!-- Lokacija -->
      <div class="q-mb-md">
        <q-select 
          filled
          rounded 
          standout
          v-model="selectedLokacije"
          :options="lokacije"
          label="Lokacija"
          @update:model-value="applyFilters"
        />
      </div>

      <!-- Dostupnost -->
      <div class="q-mb-md">
        <q-toggle
          v-model="showUnavailable"
          label="Prikaži trenutno nedostupna vozila?"
          left-label
          @update:model-value="applyFilters"
        />
      </div>
      <q-btn
        label="Resetiraj filtere"
        color="primary"
        flat
        rounded
        @click="resetFilters"
      />
    </div>

    <div style="flex: 1; overflow-y: auto; padding: 16px;">
      <div class="auto-grid">
        <q-card v-for="auto in cars" :key="auto.id" class="my-card">
          <q-img :src="auto.slika" :ratio="16/9" />
          <q-card-section>
            <div class="text-h6">{{ auto.naziv }}</div>
            <div>Godina: {{ auto.godina }}</div>
            <div>Tip: {{ auto.tip }}</div>
            <div>Gorivo: {{ auto.gorivo }}</div>
            <div>Mjenjač: {{ auto.mjenjac }}</div>
            <div>Lokacija: {{ auto.lokacija }}</div>
            <div>Dostupno: {{ auto.dostupno ? 'Da' : 'Ne' }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const marka = ref([])
    const tipovi = ref([])
    const lokacije = ref([])
    const gorivo = ref([])
    const selectedMarka = ref([])
    const selectedTipovi = ref([])
    const selectedGorivo = ref([])
    const selectedLokacije = ref('')
    const showUnavailable = ref(false)
    const selectedMjenjac = ref('')
    const cars = ref([])

    const fetchFilters = async () => {
      const res = await axios.get('http://localhost:3000/automobili')
      const auti = res.data
      marka.value = [...new Set(auti.map(a => a.marka))]
      tipovi.value = [...new Set(auti.map(a => a.tip))]
      gorivo.value = [...new Set(auti.map(a => a.gorivo))]

      const lokRes = await axios.get('http://localhost:3000/lokacije')
      lokacije.value = lokRes.data.map(l => l.grad)
    }

    const fetchCars = async () => {
      const params = {}
      if (selectedMarka.value.length) params.marka = selectedMarka.value.join(',')
      if (selectedTipovi.value.length) params.tip = selectedTipovi.value.join(',')
      if (selectedMjenjac.value.length) params.mjenjac = selectedMjenjac.value
      if (selectedGorivo.value.length) params.gorivo = selectedGorivo.value.join(',')
      if (selectedLokacije.value) params.lokacija = selectedLokacije.value
      if (!showUnavailable.value) params.dostupno = 1
      const res = await axios.get('http://localhost:3000/pretraga', { params })
      cars.value = res.data
    }

    const resetFilters = () => {
      selectedMarka.value = []
      selectedTipovi.value = []
      selectedGorivo.value = []
      selectedLokacije.value = ''
      showUnavailable.value = false
      selectedMjenjac.value = ''
      applyFilters()
    }

    const applyFilters = () => fetchCars()

    onMounted(() => {
      fetchFilters()
      fetchCars()
    })

    return {
      marka,
      tipovi,
      gorivo,
      lokacije,
      selectedMarka,
      selectedTipovi,
      selectedMjenjac,
      selectedGorivo,
      selectedLokacije,
      showUnavailable,
      cars,
      applyFilters,
      resetFilters   
    }
  }
}
</script>

<style scoped>
.auto-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.my-card {
  width: 100%;
  max-width: 475px;
  cursor: pointer;
}
</style>
