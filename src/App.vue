<template>
    <n-config-provider :theme="theme">
        <n-message-provider>
            <n-dialog-provider><index /></n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup lang="ts">
import Index from "./components/Index.vue";
import {
    ConfigProviderProps,
    darkTheme,
    DialogApi,
    DialogProviderProps,
    LoadingBarApi,
    LoadingBarProviderProps,
    MessageApi,
    MessageProviderProps,
    NotificationProviderProps,
} from "naive-ui";
import type { GlobalTheme } from "naive-ui";
import { onMounted, Ref, ref } from "vue";

const theme = ref<GlobalTheme | null>(null);

onMounted(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.value = darkTheme;
    }
});
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
