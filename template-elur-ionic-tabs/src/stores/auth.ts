import { signal } from "@elurjs/core";

const isAuthenticated = signal(false);

export const authStore = {
    isAuthenticated,
    login() {
        isAuthenticated.value = true;
    },
    logout() {
        isAuthenticated.value = false;
    },
};
