const routes = [
  {
    path: '/', //Uređene rute
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'pregled-vozila/:kategorija?', component: () => import('pages/PregledVozila.vue') }, //koja je kategorija aktivna
      { path: 'pretraga-vozila', component: () => import('pages/PretrazivanjePage.vue') },
      { path: 'mojerezervacije', component: () => import('pages/MojeRezervacijePage.vue') },
      { path: 'onama', component: () => import('pages/OnamaPage.vue') },
      { path: 'lokacije', component: () => import('pages/LokacijaPage.vue') },
      { path: 'prijava', component: () => import('pages/PrijavaPage.vue') },
      { path: 'registracija', component: () => import('pages/RegistracijaPage.vue') },
      { path: 'postavkekorisnika', component: () => import('pages/PostavkeKorisnika.vue') }
    ]
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      { path: "", component: () => import("pages/AdminPage.vue") },
      { path: "vozila", component: () => import("pages/AdminVozila.vue") }, 
      { path: "rezervacije", component: () => import("pages/AdminRezervacije.vue") },
      { path: "korisnici", component: () => import("pages/UpravljanjeKorisnicima.vue") }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
