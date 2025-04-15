<script lang="ts">
    import { afterNavigate, beforeNavigate } from '$app/navigation';
    import { setContext } from 'svelte';

    let { children } = $props();

    let pageIdx = $state<{ idx: number }>({ idx: 1 });
    setContext('pageIdx', pageIdx);

    let isLoading = $state<boolean>(false);
    beforeNavigate(() => {
        isLoading = true;
    });
    afterNavigate(() => {
        isLoading = false;
    });
</script>

<section>
    <h1>영단어 <span style:color="red">감옥</span></h1>

    <div>
        <nav>
            <a href="/voca" class={pageIdx.idx === 1 ? 'chosenPage' : ''}>메인</a>
            <a href="/voca/quiz" class={pageIdx.idx === 2 ? 'chosenPage' : ''}
                >외우기</a
            >
            <a href="/voca/add" class={pageIdx.idx === 3 ? 'chosenPage' : ''}
                >추가하기</a
            >
            <a href="/">🏠︎</a>
        </nav>

        {#if isLoading}
            <article class="container">
                <p>Loading...</p>
            </article>
        {:else}
            <article class="container">
                {@render children()}
            </article>
        {/if}
    </div>
</section>

<style lang="scss">
    section {
        margin: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    h1 {
        font-size: 6rem;
        margin-bottom: 5rem;
        margin-top: 5rem;
        text-shadow: 0 0.5rem 0.5rem rgb(200, 200, 200);

        span {
            text-shadow: 0 0.5rem 0.5rem rgb(255, 200, 200);
        }
    }

    div {
        display: flex;
        flex-direction: column;
    }

    article {
        z-index: 9999;
        width: 70vw;
    }

    nav > a {
        margin: 0;
        font-weight: bold;
        border-radius: 1rem 1rem 0 0;
        display: inline-block;
        /* border: .3rem black outset; */
        box-shadow: 0 0.5rem 1rem 0rem rgb(200, 200, 200);
        padding: 1.2rem 2.4rem;
        padding-bottom: 2.2rem;
        font-size: 2rem;
        text-decoration: none;
        color: black;
        background-color: rgb(255, 255, 210);
        bottom: -1rem;

        &.chosenPage {
            bottom: 0rem;
        }
    }

    nav > a:first-child {
        position: relative;
        z-index: 30;
    }

    nav > a:nth-child(2) {
        position: relative;
        left: -1rem;
        z-index: 20;
    }

    nav > a:nth-child(3) {
        position: relative;
        left: -2rem;
        z-index: 10;
    }

    nav > a:nth-child(4) {
        position: relative;
        left: -3rem;
        z-index: 0;
    }

    nav > a:hover {
        background-color: rgb(245, 245, 200);
    }
</style>
