<template>
    <button v-if="showButton" @click="scrollToTop" class="scroll-to-top" aria-label="Scroll to top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z" />
            <path d="M0 0h24v24H0z" fill="none" />
        </svg>
    </button>
</template>

<script>
    import { ref, onMounted, onUnmounted } from 'vue';

    export default {
        name: 'ScrollToTop',
        setup() {
            const showButton = ref(false);

            const handleScroll = () => {
                showButton.value = window.scrollY > 300;
            };

            const scrollToTop = () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            };

            onMounted(() => {
                window.addEventListener('scroll', handleScroll);
            });

            onUnmounted(() => {
                window.removeEventListener('scroll', handleScroll);
            });

            return {
                showButton,
                scrollToTop,
            };
        },
    };
</script>

<style>
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #1845c0;
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0.7;
        transform: scale(1);
    }

    .scroll-to-top:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    .scroll-to-top svg {
        width: 24px;
        height: 24px;
    }
</style>