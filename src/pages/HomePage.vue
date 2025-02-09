<script setup lang="ts">
import Layout from "../layouts/default.vue";
// import { useAppState } from "../composables/appState";
//
// const { setCurrentPage } = useAppState();
</script>
<template>
  <Layout>
    <section id="hero-banner">
      <div class="text-content">
        <div class="__text">
          <h2>Your favorite friend deserve the best care</h2>
          Adipisicing consequat proident fugiat do quis dolor duis mollit quis
          <br />
          <a href="#">Schedule an appointment</a>
        </div>
      </div>
      <div class="__bg_img"></div>
    </section>
  </Layout>
</template>
<style scoped>
#hero-banner {
  height: 900px;
  display: grid;
  background-image: url("/hero-dog2.jpg");
  background-position: left;
  background-size: cover;
  background-repeat: no-repeat;
  grid-template-columns: 1fr 1.2fr;
  .text-content {
    background-color: indianred;
    display: flex;
    flex-direction: columns;
    place-items: center;
    font-size: 2rem;
    padding: 30px;
    -webkit-text-stroke: 1px;
    h2 {
      font-weight: 600;
      font-size: 2em;
      font-family: Staatliches, "Poiret One";
      -webkit-text-stroke: 2px #000;
    }
    .__text {
      position: absolute;
      color: #ffd;
      padding-left: 4rem;
      max-width: 40dvw;
      /*background-blend-mode: color-burn;*/
    }
  }
  a {
    color: #fea;
  }
}
</style>
