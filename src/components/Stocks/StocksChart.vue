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

  const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    return `${year}-${month}-${day}`
  }

  const getTodayDate = () => {
    return formatDate(new Date())
  }

  const getDateOneYearLater = (dateStr) => {
    const date = new Date(dateStr)
    date.setFullYear(date.getFullYear() + 1)
    return formatDate(date)
  }

  const fetchData = async () => {
    const dateFrom = getTodayDate()
    const dateTo = getDateOneYearLater(dateFrom)

    loading.value = true
    error.value = null
    try {
      const response = await api.get('/stocks', {
        params: {
          dateFrom,
          dateTo,
          limit: 20,
          page: 1,
        }
      })
      const data = response.data.data || []

      if (data.length) {
        chartData.value.labels = data.map(item =>
          item.date ? item.date : (item.datelast_change ? item.datelast_change.split(' ')[0] : '—')
        )
        chartData.value.datasets = [
          {
            label: 'Количество',
            data: data.map(item => item.quantity_full ?? 0),
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
  <h2>Динамика количества</h2>
  <div v-if="loading">Загрузка графика...</div>
  <div v-else-if="error">Ошибка: {{ error }}</div>
  <div v-else>
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>