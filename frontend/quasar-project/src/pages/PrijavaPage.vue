<template>
  <q-page>
    <div class="q-pa-md">
      <div
        class="q-pa-md"
        style="background: rgba(255, 255, 255, 0.9); color: black; padding: 20px; border-radius: 10px; max-width: 400px; margin: auto;"
      >
        <h2 class="text-center" style="font-size: 3rem; margin-top: 40px; margin-bottom: 40px;">
          Prijava
        </h2>

        <!-- Korisnički login -->
        <q-input
          v-model="user.korisnicko_ime"
          label="Korisničko ime"
          filled
          :rules="[val => val && val.length > 0 || 'Popunite sva polja']"
          class="q-mb-md"
        />
        <q-input
          v-model="user.lozinka"
          label="Lozinka"
          type="password"
          filled
          :rules="[val => val && val.length > 0 || 'Popunite sva polja']"
          class="q-mb-md"
        />
        <q-btn
          label="Prijava"
          color="primary"
          @click="submitForm"
          class="full-width q-mb-md"
          style="background-color: #29854c; color: white; border-radius: 8px;"
        />

        <!-- Admin login -->
        <q-input
          v-model="adminId"
          label="Admin ID"
          filled
          class="q-mb-md"
        />
        <q-btn
          label="Prijava kao admin"
          color="secondary"
          @click="loginAdmin"
          class="full-width q-mb-md"
          style="border-radius: 8px;"
        />

        <q-btn
          label="Odjava"
          color="red"
          @click="logout"
          class="full-width"
          style="border-radius: 8px;"
        />
      </div>
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
    // Korisnički login
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

        if (korisnik && korisnik.korisnicko_ime) {
          localStorage.setItem("korisnicko_ime", korisnik.korisnicko_ime);
          localStorage.setItem("ID_korisnika", korisnik.id);
          alert("Prijava uspješna!");
          this.router.push("/");
        } else {
          alert("Neispravno korisničko ime ili lozinka.");
        }
      })
      .catch(err => {
        console.error("Greška prilikom prijave:", err);
        alert("Neispravno korisničko ime ili lozinka.");
      });
    },

    // Admin login (isto kao stari page)
    async loginAdmin() {
      if (!this.adminId) {
        alert("Molimo unesite ID admina.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/Admin", {
          params: { adminId: this.adminId }
        });

        if (Array.isArray(response.data) && response.data[0].id_exists === 1) {
          alert("Prijava admina uspješna!");
          this.router.push({ name: "AdminPage" });
        } else {
          alert("Neispravan ID admina.");
        }
      } catch (error) {
        console.error("Greška pri admin prijavi:", error);
        alert("Došlo je do greške pri prijavi.");
      }
    },

    // Logout
    logout() {
      localStorage.removeItem("korisnicko_ime");
      localStorage.removeItem("ID_korisnika");
      this.user.korisnicko_ime = "";
      this.user.lozinka = "";
      this.adminId = "";
      alert("Odjava uspješna!");
      this.router.push("/login");
      window.location.reload();
    },

    resetForm() {
      this.user.korisnicko_ime = "";
      this.user.lozinka = "";
      this.adminId = "";
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 3rem;
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: center;
}
</style>
