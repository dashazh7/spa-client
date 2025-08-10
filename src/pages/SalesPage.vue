<script setup>
  import SalesChart from '../components/Sales/SalesChart.vue'
  import SalesTable from '../components/Sales/SalesTable.vue'
  import SalesFilters from '../components/Sales/SalesFilters.vue'
</script>

<template>
  <div class='container'>
    <SalesChart />
    <SalesTable />
    <SalesFilters />
  </div>
</template>