<template>
  <div class="navbar">
    <nav>
      <ul>
        <li>
          <RouterLink to="/">Home </RouterLink>
        </li>
        <li>
          <RouterLink to="/login">Login </RouterLink>
        </li>
        <li>
          <RouterLink to="/signup">Sign Up</RouterLink>
        </li>
        <li>
          <RouterLink to="/check_reservation">Check reservation</RouterLink>
        </li>
        <li>
          <RouterLink to="/reservation">Make Reservation</RouterLink>
        </li>
        <li>
          <RouterLink to="/staff/account">Staff Account</RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  position: absolute;
  top: 5px;
  nav {
    border-radius: 50px;
    background-color: #fed;
    border: 1px solid #0003;
    /*position: absolute;*/
    display: flex;
    place-items: center;
    text-align: center;
    margin: 0 auto;
    ul {
      display: flex;
      place-items: center;
      text-align: center;
      list-style: none;
      li {
        padding: 0px 20px;
      }
    }
  }
}
</style>
