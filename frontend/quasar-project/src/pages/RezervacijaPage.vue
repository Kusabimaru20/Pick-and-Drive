<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Rezervacija vozila</div>

    <q-form @submit.prevent="submitRezervaciju">
        <q-input
            v-model="datumOd"
            type="date"
            label="Datum od"
            outlined
            class="q-mb-md"
            required
        />

        <q-input
            v-model="datumDo"
            type="date"
            label="Datum do"
            outlined
            class="q-mb-md"
            required
        />
        <q-btn label="Potvrdi rezervaciju" color="primary" type="submit"/>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup () {
    const route = useRoute()
    const router = useRouter()

    const automobilId = Number(route.params.id)
    const userId = localStorage.getItem('ID_korisnika')

    const datumOd = ref('')
    const datumDo = ref('')

    const submitRezervaciju = async () => {
    if (!userId) {
        router.push('/prijava')
        return
    }

    try {
        await axios.post('http://localhost:3000/rezervacije', {
            automobil_id: automobilId,
            datum_od: datumOd.value,
            datum_do: datumDo.value
        },
        {
            headers: {
                'X-User-ID': userId
            }
        })

        alert('Vozilo je rezervirano!');
        router.push('/mojerezervacije');
        
    } catch (error) {
        console.error("Greška pri rezervaciji:", error);
        alert('Vozilo je već rezervirano u odabranom terminu. Pokušajte ponovno.');
    }
}
    return {
        datumOd,
        datumDo,
        submitRezervaciju
    }
  }
}
</script>
