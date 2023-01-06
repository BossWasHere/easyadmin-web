<template>
  <q-page padding class="column q-gutter-md">
    <div>
      <div class="text-h4 text-primary q-my-md">General</div>
      <div class="row q-gutter-md justify-center">
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Network</div>
          </q-card-section>
          <q-card-section>
            <p>Uptime: <span class="text-info">12h 30m</span> (Started 00:00:00 01/01/1970 UTC)</p>
            <p>Address: <span class="text-info">mc.example.com:25565</span></p>
          </q-card-section>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Platform</div>
          </q-card-section>
          <q-card-section>
            <p>BungeeCord 1.19-R0.1-SNAPSHOT</p>
            <p>Proxy for 127/200 servers and no additional proxies</p>
          </q-card-section>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Players</div>
          </q-card-section>
          <q-card-section>
            <p>50 currently online</p>
            <p>Avg. 30 last 24h</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div>
      <div class="text-h4 text-primary q-my-md">My Statistics</div>
      <div class="row q-gutter-md justify-center">
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Time Online</div>
          </q-card-section>
          <q-card-section>
            <p>12 hours in the past 30 days</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">Go to profile</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Actions Performed</div>
          </q-card-section>
          <q-card-section>
            <p>17 in the past 30 days</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">My logs</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Appeals Processed</div>
          </q-card-section>
          <q-card-section>
            <p>3 appeals in the past 30 days</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">Manage appeals</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div>
      <div class="text-h4 text-primary q-my-md">My Team</div>
      <div v-if="areTeamsEnabled" class="row q-gutter-md justify-center">
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Team Info</div>
          </q-card-section>
          <q-card-section>
            <p>Team name: Mods-NA</p>
            <p>Members: 10</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">Go to team dashboard</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Team Ranking</div>
          </q-card-section>
          <q-card-section>
            <p>You are rank 2 of 10</p>
            <p>You are 60 points away from ranking up!</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">Go to team ranking</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="col-md card-info-basic">
          <q-card-section>
            <div class="text-h6">Team Leader</div>
          </q-card-section>
          <q-card-section>
            <p>Your leader is jeb_</p>
            <p>Your team is managed by Notch</p>
          </q-card-section>
          <q-card-actions>
            <q-btn flat class="text-primary">Message Leader</q-btn>
            <q-btn flat class="text-primary">Contact Manager</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div v-else>
        <q-card class="row justify-between">
          <q-card-section>Teams are not enabled for this network! </q-card-section>

          <q-card-actions>
            <q-btn flat class="text-primary" target="_blank" :href="teamsHelpUrl">Learn more</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const areTeamsEnabled = ref(true)

const teamsHelpUrl = process.env.URL_HELP_PAGE
</script>
