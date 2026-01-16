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
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Adresa e-pošte</div>
            <div class="col-12 col-sm-8">
              <q-input v-model="user.email" dense outlined placeholder="primjer@mail.com">
                <template v-slot:prepend>
                  <q-icon name="error" color="negative" size="xs" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Grad</div>
            <div class="col-12 col-sm-8">
              <q-input v-model="user.grad" dense outlined placeholder="Unesite grad" />
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Država</div>
            <div class="col-12 col-sm-8">
              <q-select
                v-model="user.drzava"
                :options="drzavaOptions"
                dense
                outlined
                emit-value
                map-options
                display-value=""
                placeholder="Odaberite državu"
              />
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-sm-4 text-subtitle1 text-grey-8">Vremenska zona</div>
            <div class="col-12 col-sm-8">
              <q-select
                v-model="user.vremenskaZona"
                :options="vremenskaOptions"
                dense
                outlined
                placeholder="Odaberite zonu"
              />
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
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Podaci su inicijalno prazni
const user = ref({
  ime: '',
  prezime: '',
  email: '',
  grad: '',
  drzava: null,
  vremenskaZona: null,
})

const drzavaOptions = ['Hrvatska', 'Slovenija', 'Austrija', 'Njemačka']
const vremenskaOptions = ['Europe/Zagreb', 'UTC', 'Europe/London']

const saveSettings = () => {
  // Ovdje ide logika za slanje podataka na server (npr. axios.post)
  console.log('Spremanje podataka:', user.value)
  $q.notify({
    color: 'positive',
    message: 'Postavke su uspješno spremljene!',
    icon: 'check',
  })
}
</script>

<style scoped>
.user-settings-card {
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
