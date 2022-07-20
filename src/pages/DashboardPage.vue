<template>
  <div>
    <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
  <div>
    <apexchart width="500" type="pie" :options="pieOptions" :series="pieValues"></apexchart>
  </div>
</template>

<script setup lang="ts">
const chartOptions = {
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
}
const series = [
  {
    name: 'series-1',
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
  {
    name: 'series-2',
    data: [15, 78, 32, 45, 45, 12, 82, 75],
  },
]
const pieOptions = {
  labels: ['Vue', 'React', 'Angular'],
}
const pieValues = [35, 40, 25]
</script>
