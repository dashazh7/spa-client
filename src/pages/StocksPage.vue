<script setup>
  import StocksChart from '../components/Stocks/StocksChart.vue'
  import StocksTable from '../components/Stocks/StocksTable.vue'
  import StocksFilters from '../components/Stocks/StocksFilters.vue'
</script>

<template>
  <div class='container'>
    <StocksChart />
    <StocksTable />
    <StocksFilters />
  </div>
</template>