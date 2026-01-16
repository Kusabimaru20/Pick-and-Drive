<template>
  <q-page class="flex flex-center" style="background: #eee;">
    <div class="q-pa-md shadow-2 bg-white" style="border-radius: 10px; max-width: 400px; width: 100%;">
      <h2 class="text-center" style="font-size: 2.5rem; margin-bottom: 20px;">Prijava</h2>

      <q-input v-model="user.korisnicko_ime" label="Korisničko ime" filled class="q-mb-md" />
      <q-input v-model="user.lozinka" label="Lozinka" type="password" filled class="q-mb-md" />
      <q-btn label="Prijava" color="primary" @click="submitForm" class="full-width q-mb-md" />

      <q-separator class="q-my-lg" />

      <q-input v-model="adminId" label="Admin ID" filled class="q-mb-md" />
      <q-btn label="Prijava kao admin" color="secondary" @click="loginAdmin" class="full-width" />
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      user: { korisnicko_ime: "", lozinka: "" },
      adminId: "",
    };
  },
  methods: {
    submitForm() {
      if (!this.user.korisnicko_ime || !this.user.lozinka) {
        alert("Sva polja su obavezna.");
        return;
      }
      axios.post("http://localhost:3000/api/prijava", {
        korisnicko_ime: this.user.korisnicko_ime,
        lozinka: this.user.lozinka,
      })
      .then(response => {
        const korisnik = response.data.korisnik;
        if (korisnik) {
          localStorage.setItem("prijavljen", "true");
          localStorage.setItem("korisnicko_ime", korisnik.korisnicko_ime);
          localStorage.setItem("ID_korisnika", korisnik.id); // dodan ID korisnika za MojeRezervacije.vue
          localStorage.setItem("userRole", "user");
          alert("Prijava uspješna!");
          this.router.push("/").then(() => { window.location.reload(); });
        }
      })
      .catch(() => alert("Neispravni podaci."));
    },
    async loginAdmin() {
      if (!this.adminId) {
        alert("Unesite ID.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/Admin", {
          params: { adminId: this.adminId }
        });
        if (Array.isArray(response.data) && response.data[0].id_exists === 1) {
          localStorage.setItem("prijavljen", "true");
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("korisnicko_ime", "Administrator");
          alert("Admin prijava uspješna!");
          this.router.push("/admin").then(() => { window.location.reload(); });
        } else {
          alert("Neispravan Admin ID.");
        }
      } catch {
        alert("Greška pri admin prijavi.");
      }
    }
  }
};
</script>