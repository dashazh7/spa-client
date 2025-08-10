<script setup>
  import '../../assets/css/styles.css'
  import api from '../../services/api'
  import { ref, onMounted } from 'vue'
  import { Pie } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

  const chartData = ref({
    labels: [],
    datasets: [],
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
      },
    },
  }

  const loading = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/sales', {
        params: {
          dateFrom: '2024-07-01',
          dateTo: '2024-12-31',
          limit: 100,
          page: 1,
        }
      })
      const data = response.data.data || []

      const regionCountMap = {}
      data.forEach(item => {
        const region = item.region_name || 'Unknown'
        regionCountMap[region] = (regionCountMap[region] || 0) + 1
      })

      const sortedRegions = Object.entries(regionCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      chartData.value.labels = sortedRegions.map(item => item[0])
      chartData.value.datasets = [
        {
          label: 'Количество продаж',
          data: sortedRegions.map(item => item[1]),
          backgroundColor: [
            '#315A65', '#45C3C2', '#79B0C2', '#4498C0', '#45BB94'
          ],
          borderWidth: 1,
        },
      ]
    } catch (e) {
      error.value = e.message || 'Ошибка загрузки данных'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)
</script>

<template>
  <h2>Распределение количества продаж по пяти ведущим регионам</h2>
  <div v-if="loading">Загрузка графика...</div>
  <div v-else-if="error">Ошибка: {{ error }}</div>
  <div v-else>
    <div class="chart">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>