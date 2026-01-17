<template>
  <q-page class="q-pa-none" style="background-color: #211c1c;">
    <q-img
      src="/slike/main.png"
      style="height: 100vh; width: 100%;"
      fit="cover"
    />
    <div class="q-pa-md" style="color: white;">
      <h1 style="font-weight: bold;">NAŠA FLOTA</h1>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
        <img src="/slike/SUV(0).jpg">

        <q-card-section>
          <div align="left">
            <q-btn flat rounded label="SUV / Terenci" style="font-size: 20px; font-weight: bold;" @click="idiNaKategoriju('SUV')"/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <img src="/slike/sedan(0).jpg">

        <q-card-section>
          <div align="left">
            <q-btn flat rounded label="Sedan / Limuzina" style="font-size: 20px; font-weight: bold;" @click="idiNaKategoriju('Limuzina')"/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <img src="/slike/sport(0).jpg">

        <q-card-section>
          <div align="left">
            <q-btn flat rounded label="Sportski automobili" style="font-size: 20px; font-weight: bold; text-align: left;" @click="idiNaKategoriju('Sportski')"/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <img src="/slike/hatchback(0).jpeg">
        <q-card-section>
          <div align="left">
            <q-btn flat rounded label="Kompaktna vozila" style="font-size: 20px; font-weight: bold;" @click="idiNaKategoriju('Kompakt')"/>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <img src="/slike/drugo.jpg" @click="idiNaKategoriju('Ostalo')" class="cursor-pointer">
      </q-card>
    </div>
    <div class="row items-center q-pa-xl">
      <div class="col-6" style="color: white;" >
        <h1 style="font-weight: bold;">Kako to funkcionira?</h1>
        <h3>1. Odaberi svoj automobil</h3>
        <p>
          Pregledaj našu flotu i pronađi savršeni automobil za svoje potrebe – od ekonomičnih gradskih vozila do luksuznih sportskih modela.
        </p>
        <p>
          _________________________________________________________________________________________________________________________________________
        </p>
        <h3>2. Rezerviraj odmah</h3>
        <p>
          Brzo i jednostavno: rezervaciju možeš napraviti online ili putem našeg tima, bez skrivenih uvjeta i komplikacija.
        </p>
        <p>
          _________________________________________________________________________________________________________________________________________
        </p>
        <h3>3. Vozi i uživaj</h3>
        <p>
          Pregledaj našu flotu i pronađi savršeni automobil za svoje potrebe – od ekonomičnih gradskih vozila do luksuznih sportskih modela.
        </p>
        <p>
          _________________________________________________________________________________________________________________________________________
        </p>
        <h3>4. Vrati bez brige</h3>
        <p>
          Vraćanje vozila je jednostavno i fleksibilno – mi se brinemo da sve prođe glatko i bez stresa.
        </p>
        <p>
          _________________________________________________________________________________________________________________________________________
        </p>
      </div>

      <div class="col-6" align="right">
        <q-img src="/slike/kljucevi(1).jpg" :ratio="5/7" style="max-width: 700px" />
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const idiNaKategoriju = (kategorija) => {
  router.push(`/pregled-vozila/${encodeURIComponent(kategorija)}`)
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 353px
</style>