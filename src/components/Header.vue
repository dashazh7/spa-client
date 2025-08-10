<template>
  <nav>
    <router-link class="router-link" to="/sales">Продажи</router-link>
    <router-link class="router-link" to="/orders">Заказы</router-link> 
    <router-link class="router-link" to="/stocks">Склады</router-link>
    <router-link class="router-link" to="/incomes">Доходы</router-link>
  </nav>
</template>

<script setup>
    import '../assets/css/header.css'
</script>