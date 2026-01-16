<template>
  <q-page class="q-pa-md flex flex-center" style="background-color: #211c1c">
    <q-img
      src="/slike/main.png"
      style="height: 100vh; width: 100%; position: absolute; top: 0; left: 0"
      fit="cover"
    />

    <q-card
      class="user-settings-card q-pa-md"
      style="
        width: 100%;
        max-width: 700px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
      "
    >
      <q-expansion-item
        expand-separator
        icon="settings"
        label="Općenito"
        default-opened
        header-class="text-h6 text-grey-9"
      >
        <q-card-section class="q-gutter-y-sm">
          <div class="row items-center">
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Ime</div>
            <div class="col-12 col-sm-8">
              <q-input v-model="user.ime" dense outlined placeholder="Unesite ime" />
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Prezime</div>
            <div class="col-12 col-sm-8">
              <q-input v-model="user.prezime" dense outlined placeholder="Unesite prezime" />
            </div>
          </div>

          <div class="row items-center">  
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Korisničko ime</div>
            <div class="col-12 col-sm-8">
              <q-input v-model="user.korisnicko_ime" dense outlined placeholder="Unesite novo korisničko ime" />
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn label="Spremi promjene" color="primary" @click="saveSettings" />
          </div>
        </q-card-section>
      </q-expansion-item> 
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'

const userId = localStorage.getItem('ID_korisnika')

// Podaci su inicijalno prazni, DODANO korisnicko ime, maknuti grad i zona
const user = ref({
  ime: '',
  prezime: '',
  korisnicko_ime: '',
})

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/user', {
      headers: {'x-user-id': userId }
    })
    user.value = data
  } catch {
    alert("Greška pri dohvaćanju podataka.");
  }
})

const saveSettings = async () => { //Editano za error i par sitnica + da se korisnicko ime update na layoutu
  try {
    console.log('Spremanje podataka:', user.value)
    await axios.put('http://localhost:3000/api/user', 
    {
        ime: user.value.ime,
        prezime: user.value.prezime,
        korisnicko_ime: user.value.korisnicko_ime
    },
    {
      headers: { 'x-user-id': userId
      }
    })
    
    alert("Postavke su uspješno spremljene!");
    localStorage.setItem('korisnicko_ime', user.value.korisnicko_ime)
    window.location.reload()
  } catch {
    alert("Spremanje nije uspjelo.");
  }
}
</script>

<style scoped>
.user-settings-card {
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
