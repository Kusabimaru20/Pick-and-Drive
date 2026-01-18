<template>
  <q-page padding class="bg-grey-2">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="rez in rezervacije" :key="rez.id" class="my-card" flat bordered>

        <q-card-section>
          <div class="text-h6 q-mb-sm">{{ rez.naziv }}</div>
          <div class="text-caption text-grey">
            <strong>Datum od:</strong> {{ formatDatum(rez.datum_od) }}<br />
            <strong>Datum do:</strong> {{ formatDatum(rez.datum_do) }}<br />
            <strong>Cijena:</strong> {{ rez.ukupna_cijena }} €<br />
            <strong>Status:</strong> {{ rez.status }}
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            v-if="rez.status === 'Potvrđeno'"
            flat
            color="red"
            label="Otkaži"
            @click="otkaziRezervaciju(rez.id)"
          />
          <div v-else class="text-caption text-grey">
            {{ rez.status === 'Otkazano' ? 'Ova rezervacija je otkazana' : 'Ne može se otkazati' }}
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'MojeRezervacije',
  data() {
    return {
      rezervacije: [],
    }
  },
  async mounted() {
    await this.loadRezervacije()
  },
  methods: {
    async loadRezervacije() {
      try {
        const userId = localStorage.getItem('ID_korisnika')
        if (!userId) {
           this.$router.push('/prijava'); // Promjenjeno iz alerta da prebaci na prijavu
          return
        }

        const res = await fetch('http://localhost:3000/api/rezervacije/moje', {
          headers: {
            'X-User-ID': userId,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        this.rezervacije = data
      } catch (err) {
        console.error('Greška pri dohvaćanju rezervacija:', err)
      }
    },
    formatDatum(datum) {
      if (!datum) return ''
      const date = new Date(datum)
      return date.toLocaleString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    otkaziRezervaciju(id) {
      const userId = localStorage.getItem('ID_korisnika')

      if (!userId) {
        alert('Morate biti prijavljeni')
        return
      }

      if (confirm('Jeste li sigurni da želite otkazati ovu rezervaciju?')) {
        fetch(`http://localhost:3000/api/rezervacije/${id}/otkazi`, {
          method: 'PATCH',
          headers: {
            'X-User-ID': userId,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error('Greška pri otkazivanju')
            return res.json()
          })
          .then(() => {
            this.loadRezervacije()
            alert('Rezervacija otkazana!')
          })
          .catch((err) => {
            console.error(err)
            alert('Greška: ' + err.message)
          })
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
