<script setup>
  import IncomesChart from '../components/Incomes/IncomesChart.vue'
  import IncomesTable from '../components/Incomes/IncomesTable.vue'
  import IncomesFilters from '../components/Incomes/IncomesFilters.vue'
</script>

<template>
  <div class='container'>
    <IncomesChart />
    <IncomesTable />
    <IncomesFilters />
  </div>
</template>