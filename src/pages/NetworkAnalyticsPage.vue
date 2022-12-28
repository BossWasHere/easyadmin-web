<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div class="row">
        <div id="chart-onlinePlayers" class="col-12 col-md">
          <apexchart
            height="300"
            :options="onlinePlayerOptions"
            :series="onlinePlayersData"
          ></apexchart>
        </div>
        <div id="chart-tps" class="col-12 col-md">
          <apexchart height="300" :options="tpsOptions" :series="tpsData"></apexchart>
        </div>
        <div id="chart-chatActivity" class="col-12 col-md">
          <apexchart
            height="300"
            :options="chatActivityOptions"
            :series="chatActivityData"
          ></apexchart>
        </div>
      </div>

      <div class="row">
        <div id="chart-cpu" class="col-12 col-md">
          <apexchart height="300" :options="cpuOptions" :series="cpuData"></apexchart>
        </div>
        <div id="chart-memory" class="col-12 col-md">
          <apexchart height="300" :options="memoryOptions" :series="memoryData"></apexchart>
        </div>
        <div id="chart-networkThroughput" class="col-12 col-md">
          <apexchart
            height="300"
            :options="networkThroughputOptions"
            :series="networkThroughputData"
          ></apexchart>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QPage } from 'quasar'

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
  colors: ['#1976d2', '#26a69a', '#f2c037'],
  dataLabels: {
    enabled: false,
  },
  theme: {
    mode: 'dark',
  },
}

// const tooltip30s = {
//   x: {
//     show: false,
//     formatter: (val: number) => {
//       const seconds = Math.floor((timestamp - val) / 1000)
//       return seconds === 0 ? 'now' : `${seconds} second${seconds === 1 ? '' : 's'} ago`
//     },
//   },
// }

const tooltip30m = {
  x: {
    show: false,
    formatter: (val: number) => {
      const minutes = Math.floor((timestamp - val) / 60000)
      return minutes === 0 ? 'now' : `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    },
  },
}

// const xAxis30s = {
//   type: 'datetime',
//   min: timestamp - 30000,
//   max: timestamp,
// }

const xAxis30m = {
  type: 'datetime',
  min: timestamp - 1800000,
  max: timestamp,
}

// todo prevent chart selection + zoom in (or enable controls)

const tpsOptions = {
  ...defaultChartOptions,
  title: {
    text: 'TPS',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  stroke: {
    curve: 'stepline',
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 20,
  },
}

const tpsData = [
  {
    name: 'TPS',
    data: [
      [timestamp - 1800000, 20],
      [timestamp - 1463000, 19],
      [timestamp - 1126000, 18],
      [timestamp - 1110000, 19],
      [timestamp - 964000, 18],
      [timestamp - 962000, 16],
      [timestamp - 850000, 17],
      [timestamp - 727000, 18],
      [timestamp - 725000, 19],
      [timestamp - 703000, 20],
      [timestamp, 20],
    ],
  },
]

const onlinePlayerOptions = {
  ...defaultChartOptions,
  title: {
    text: 'Online Players',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 100,
  },
}

const onlinePlayersData = [
  {
    name: 'Online Players',
    data: fastRandomTrend(30 + 1, 0, 64, 2).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

const chatActivityOptions = {
  ...defaultChartOptions,
  title: {
    text: 'Chat Activity',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 100,
  },
}

const chatActivityData = [
  {
    name: 'Messages / Minute',
    data: fastRandomTrend(30 + 1, 0, 45, 5, 0, 10).map((value, index) => [
      timestamp - (30 - index) * 60000,
      value,
    ]),
  },
]

const cpuOptions = {
  ...defaultChartOptions,
  chart: {
    ...defaultChartOptions.chart,
    stacked: true,
  },
  title: {
    text: 'CPU Usage',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: tooltip30m,
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      formatter: (value: number) => `${value}%`,
    },
  },
}

const serverCPUUsage = {
  name: 'Usage (Server)',
  data: fastRandomTrend(180 + 1, 4, 85, 1, 4, 10).map((value, index) => [
    timestamp - (180 - index) * 10000,
    value,
  ]),
}

const cpuData = [
  serverCPUUsage,
  {
    name: 'Usage (System)',
    data: serverCPUUsage.data.map(([timestamp, value]) => [
      timestamp,
      value + 4 + Math.floor(Math.random() * 8),
    ]),
  },
]

const memoryOptions = {
  ...defaultChartOptions,
  title: {
    text: 'Memory Usage',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: {
    ...tooltip30m,
    y: {
      formatter: (value: number) => `${value} MB`,
    },
  },
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 4000,
  },
  annotations: {
    yaxis: [
      {
        y: 3200,
        borderColor: 'red',
        label: {
          text: 'Allocated (max)',
          style: {
            color: '#fff',
            background: '#9c27b0',
          },
        },
      },
    ],
  },
}

const memoryData = [
  {
    name: 'Usage',
    data: fastRandomTrend(180 + 1, 800, 2500, 50, 1000, 1300).map((value, index) => [
      timestamp - (180 - index) * 10000,
      value,
    ]),
  },
]

const networkThroughputOptions = {
  ...defaultChartOptions,
  title: {
    text: 'Network Throughput',
    align: 'left',
    style: {
      fontFamily: 'inherit',
    },
  },
  tooltip: {
    ...tooltip30m,
    y: {
      formatter: (value: number) => `${value} kb/s`,
    },
  },
  xaxis: xAxis30m,
  yaxis: {
    min: 0,
    max: 10000,
  },
}

const networkThroughputData = [
  {
    name: 'Send',
    data: fastRandomTrend(180 + 1, 0, 6000, 100, 200, 500).map((value, index) => [
      timestamp - (180 - index) * 10000,
      value,
    ]),
  },
  {
    name: 'Receive',
    data: fastRandomTrend(180 + 1, 0, 6000, 100, 200, 500).map((value, index) => [
      timestamp - (180 - index) * 10000,
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
