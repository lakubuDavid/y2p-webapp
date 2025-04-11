<script setup lang="ts">
import Button from "primevue/button";
import Layout from "../layouts/default.vue";
import { services } from "../data/services.json";
// import { useAppState } from "../composables/appState";
//
// const { setCurrentPage } = useAppState();
const API_URL = import.meta.env.VITE_API_URL;
const response = fetch(`${API_URL}`);
console.log(response);
</script>
<template>
  <Layout>
    <main>
      <section id="hero-banner">
        <div class="text-content">
          <div class="__text w-690px">
            <img height="130" src="/logo.png" />
            <h2>Your best friend deserve the best care</h2>
            <div>
              Certified expert and caregiver always avalable for you<br />
              Call to schedule an appointment
            </div>
            <br />
            <Button
              icon="pi pi-phone"
              label="Call Now"
              iconPos="right"
              severity="secondary"
              class="b-1px b-solid b-black"
              rounded
              raised
            />
          </div>
        </div>
        <div class="__bg_img"></div>
      </section>
      <section class="pad-20">
        <div class="column pad-20">
          <h2 class="heading-2">Our Services</h2>
          <span class="heading">Discover our services </span>
          <div class="row wrap justify-center pad-50">
            <div
              class="row items-center gap-20 w-45p"
              v-for="(service, i) in services"
              :key="i"
            >
              <span
                v-if="service.icon.type == 'text'"
                :style="{ fontSize: '5rem' }"
                >{{ service.icon.text }}
              </span>
              <div class="column">
                <h3>{{ service.label }}</h3>
                <span>{{ service.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </Layout>
</template>
<style scoped>
main {
  min-height: 100dvh;
  p {
    padding: 20px;
    margin: 0px auto;
    width: 1000px;
  }
}
#hero-banner {
  min-height: 720px;
  display: grid;
  aspect-ratio: 1440/720;
  /*background-image: linear-gradient(*/
  /*    to right,*/
  /*    rgba(0, 0, 0, 0.52),*/
  /*    rgba(255, 255, 255, 0)*/
  /*  ),*/
  /*  url("/hero-dog.jpg");*/
  background-image: url("/hero-dog.jpg");
  background-position: left;
  /*background-size: cover;*/
  background-size: 120%;
  background-repeat: no-repeat;
  background-position: -16px -140px;
  grid-template-columns: 1fr 1.2fr;
  .text-content {
    /*background-color: indianred;*/
    display: flex;
    place-items: center;
    font-size: 1.2rem;
    padding: 10px;
    /*    -webkit-text-stroke: 1px;*/
    h2 {
      /*      font-weight: 600;*/
      font-size: 3rem;
      font-weight: 900;
      /*-webkit-text-stroke: 0.3px #000;*/
    }
    .__text {
      position: absolute;
      /*color: #ffd;*/
      padding-left: 2rem;
      max-width: 50dvw;
    }
  }
  a {
    color: #fea;
  }
}
</style>
