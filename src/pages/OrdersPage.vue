<script setup>
  import OrdersTable from '../components/Orders/OrdersTable.vue'
  import OrdersChart from '../components/Orders/OrdersChart.vue'
  import OrdersFilters from '../components/Orders/OrdersFilters.vue'
</script>

<template>
  <div class='container'>
    <OrdersChart />
    <OrdersTable />
    <OrdersFilters />
  </div>
</template>