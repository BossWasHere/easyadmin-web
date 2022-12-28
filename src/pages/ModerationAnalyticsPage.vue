<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div class="row">
        <div id="chart-modActions" class="col-12 col-md">
          <apexchart height="300" :options="modActionsOptions" :series="modActionsData"></apexchart>
        </div>
        <div id="chart-autoMod" class="col-12 col-md">
          <apexchart height="300" :options="autoModOptions" :series="autoModData"></apexchart>
        </div>
      </div>
    </div>
    <div class="row">
      <div id="chart-chatFilter" class="col-12 col-md">
        <apexchart height="300" :options="chatFilterOptions" :series="chatFilterData"></apexchart>
      </div>
      <div id="chart-onlineStaff" class="col-12 col-md">
        <apexchart height="300" :options="onlineStaffOptions" :series="onlineStaffData"></apexchart>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const timestamp = Date.now()

const defaultChartOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: true,
        zoom: '<i class="material-icons text-primary apexcharts-material-icon">zoom_in</i>',
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: '<i class="material-icons text-primary apexcharts-material-icon">restart_alt</i>',
      },
    },
  },
  colors: ['#c10015', '#26a69a', '#9c27b0', '#1976d2', '#f2c037'],
  dataLabels: {
    enabled: false,
  },
  theme: {
    mode: 'dark',
  },
}

const tooltip30m = {
  x: {
    show: false,
    formatter: (val: number) => {
      const minutes = Math.floor((timestamp - val) / 60000)
      return minutes === 0 ? 'now' : `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    },
  },
}

const xAxis30m = {
  type: 'datetime',
  min: timestamp - 1800000,
  max: timestamp,
}

const modActionsOptions = {
  ...defaultChartOptions,
  chart: {
    ...defaultChartOptions.chart,
    stacked: true,
  },
  title: {
    text: 'Moderation Actions',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
}

const modActionsData = [
  {
    name: 'Bans',
    data: fastRandomTrend(30 + 1, 0, 3, 1, 0, 0).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Mutes',
    data: fastRandomTrend(30 + 1, 0, 3, 1, 0, 0).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Kicks',
    data: fastRandomTrend(30 + 1, 0, 5, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Comments',
    data: fastRandomTrend(30 + 1, 0, 6, 1, 0, 2).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Warnings',
    data: fastRandomTrend(30 + 1, 0, 3, 1, 0, 0).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

const autoModOptions = {
  ...defaultChartOptions,
  chart: {
    ...defaultChartOptions.chart,
    stacked: true,
  },
  title: {
    text: 'Auto Mod',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
}

const autoModData = [
  {
    name: 'Bans',
    data: fastRandomTrend(30 + 1, 0, 1, 1, 0, 0).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Mutes',
    data: fastRandomTrend(30 + 1, 0, 2, 1, 0, 0).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Kicks',
    data: fastRandomTrend(30 + 1, 0, 2, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Notifications',
    data: fastRandomTrend(30 + 1, 0, 6, 1, 0, 4).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Warnings',
    data: fastRandomTrend(30 + 1, 0, 2, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

const chatFilterOptions = {
  ...defaultChartOptions,
  chart: {
    ...defaultChartOptions.chart,
    stacked: true,
  },
  title: {
    text: 'Chat Filtration',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
}

const chatFilterData = [
  {
    name: 'Blocked (Acted Upon)',
    data: fastRandomTrend(30 + 1, 0, 2, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Blocked (Warning)',
    data: fastRandomTrend(30 + 1, 0, 10, 2, 0, 5).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Obfuscated',
    data: fastRandomTrend(30 + 1, 0, 10, 3, 0, 5).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

const onlineStaffOptions = {
  ...defaultChartOptions,
  chart: {
    ...defaultChartOptions.chart,
    stacked: true,
  },
  title: {
    text: 'Staff Online',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
}

const onlineStaffData = [
  {
    name: 'Trainees',
    data: fastRandomTrend(30 + 1, 0, 10, 2, 0, 2).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Moderators',
    data: fastRandomTrend(30 + 1, 0, 5, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
  {
    name: 'Administators',
    data: fastRandomTrend(30 + 1, 0, 2, 1, 0, 1).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

function fastRandomTrend(
  count: number,
  min: number,
  max: number,
  delta: number,
  startMin?: number,
  startMax?: number
) {
  const array = new Array(count)
  const deltaRange = delta * 2 + 1

  startMin = startMin ?? min
  startMax = startMax ?? max

  array[0] = Math.floor(Math.random() * (startMax - startMin + 1) + startMin)

  for (let i = 1; i < count; i++) {
    array[i] = Math.min(
      max,
      Math.max(min, array[i - 1] + Math.floor(Math.random() * deltaRange) - delta)
    )
  }

  return array
}
</script>
