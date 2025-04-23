<script setup lang="ts">
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
</script>
<template>
  <footer>
    <div class="row pad-20 gap-20">
      <div class="column w-200">
        <!-- <Panel header=""> -->
        <h3>Menu</h3>
        <ul>
          <li>
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/check_reservation">Check Reservation</RouterLink>
          </li>
        </ul>
        <!-- </Panel> -->
      </div>
      <div v-if="userStore.currentUser" class="column w-200">
        <!-- <Panel header="Staff"> -->
        <h3>Internal</h3>
        <ul>
          <li>
            <RouterLink to="/staff">Dashboard</RouterLink>
          </li>
          <li>
            <RouterLink to="/staff/account">Accounts</RouterLink>
          </li>
          <li>
            <RouterLink to="/staff/pets">Pets</RouterLink>
          </li>
          <li>
            <RouterLink to="/staff/reservations">Reservations</RouterLink>
          </li>
        </ul>
        <!-- </Panel> -->
      </div>
      <div class="column w-300">
        <h3>Address</h3>
        <p>
          123 Avenue Street <br />
          Albert Park<br />
          Town City
        </p>
        <p>
          <a href="tel:+23000000000"> +230 0000 0000</a><br />
          <a href="mailto:contact@mail.com"> contact@mail.com</a>
        </p>
      </div>
      <div class="column">
        <h3>Social</h3>
      </div>
    </div>
    <!-- <Divider /> -->
    <div class="row text-center justify-center pad-b-20">
      Copyright &copy; {{ new Date().getFullYear() }}
    </div>
  </footer>
</template>
<style scoped>
footer {
  color: #fff;
  background: #333333;
}
a {
  color: #fff;
}
ul {
  padding: 0px;
  line-height: 2rem;
  list-style: none;
}
</style>
