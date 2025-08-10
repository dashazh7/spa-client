<script setup>
  import '../../assets/css/styles.css'
  import api from '../../services/api'
  import { ref, onMounted } from 'vue'
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
  } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

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
        align: 'end',
      },
    },
  }

  const loading = ref(true)
  const error = ref(null)

  const brandId = '89edf2b23057232f'

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/orders', {
        params: {
          dateFrom: '2024-07-01',
          dateTo: '2024-12-31',
          limit: 100,
          page: 1,
        },
      })

      let data = response.data.data || []

      data = data.filter(item => item.brand === brandId && item.discount_percent != null)
      data.sort((a, b) => new Date(a.date) - new Date(b.date))

      if (data.length) {
        chartData.value.labels = data.map(item => item.date)
        chartData.value.datasets = [
          {
            label: 'Процент скидки',
            data: data.map(item => item.discount_percent),
            borderColor: '#1abc9c',
            tension: 0.3,
            borderWidth: 3,
          },
        ]
      } else {
        chartData.value.labels = []
        chartData.value.datasets = []
      }
    } catch (e) {
      error.value = e.message || 'Ошибка загрузки данных'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)
</script>

<template>
  <h2>Динамика скидок с течением времени для бренда {{ brandId }}</h2>
  <div v-if="loading">Загрузка графика...</div>
  <div v-else-if="error">Ошибка: {{ error }}</div>
  <div v-else>
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>