<script setup lang="ts">
import Button from "primevue/button";
import Layout from "../layouts/default.vue";
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
          <div class="__text">
            <h2>Your best friend deserve the best care</h2>
            <p>
              Certified expert and caregiver always avalable for you<br />
              Call to schedule an appointment
            </p>
            <br />
            <Button
              icon="pi pi-phone"
              label="Call Now"
              iconPos="right"
              severity="secondary"
              rounded
            />
          </div>
        </div>
        <div class="__bg_img"></div>
      </section>
      <section>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos nostrum suscipit cumque impedit hic. Placeat deleniti, quae,
          perspiciatis odio illo a impedit doloremque blanditiis, in debitis
          dignissimos nemo repudiandae!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos nostrum suscipit cumque impedit hic. Placeat deleniti, quae,
          perspiciatis odio illo a impedit doloremque blanditiis, in debitis
          dignissimos nemo repudiandae!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos nostrum suscipit cumque impedit hic. Placeat deleniti, quae,
          perspiciatis odio illo a impedit doloremque blanditiis, in debitis
          dignissimos nemo repudiandae!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos nostrum suscipit cumque impedit hic. Placeat deleniti, quae,
          perspiciatis odio illo a impedit doloremque blanditiis, in debitis
          dignissimos nemo repudiandae!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          eos nostrum suscipit cumque impedit hic. Placeat deleniti, quae,
          perspiciatis odio illo a impedit doloremque blanditiis, in debitis
          dignissimos nemo repudiandae!
        </p>
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
  height: 90dvh;
  display: grid;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.52),
      rgba(255, 255, 255, 0)
    ),
    url("/hero-dog.jpg");
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  grid-template-columns: 1fr 1.2fr;
  .text-content {
    /*background-color: indianred;*/
    display: flex;
    place-items: center;
    font-size: 1.2rem;
    padding: 30px;
    /*    -webkit-text-stroke: 1px;*/
    h2 {
      /*      font-weight: 600;*/
      font-size: 3rem;
      font-family: "Bitter";
      font-weight: 900;
      /*-webkit-text-stroke: 0.3px #000;*/
    }
    .__text {
      position: absolute;
      color: #ffd;
      padding-left: 4rem;
      max-width: 40dvw;
    }
  }
  a {
    color: #fea;
  }
}
</style>
