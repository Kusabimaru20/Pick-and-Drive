const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/pregled-vozila',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PregledVozila.vue') }],
  },
  {
    path: '/pretraga-vozila',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PretrazivanjePage.vue') }],
  },
  {
    path: '/mojerezervacije',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MojeRezervacijePage.vue') }],
  },
  {
    path: '/onama',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/OnamaPage.vue') }],
  },
  {
    path: '/lokacije',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LokacijaPage.vue') }],
  },
  {
    path: '/prijava',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PrijavaPage.vue') }],
  },
  {
    path: '/registracija',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegistracijaPage.vue') }],
  },
  {
    path: '/postavke',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
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
