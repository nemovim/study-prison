<script lang="ts">
    import { page } from '$app/state';
    let { children } = $props();
</script>

<section>
    <h1>수학 <span style="color: red">감옥</span></h1>

    <div>
        <nav>
            <a
                href="/math"
                class={page.url.pathname === '/math' ? 'chosenPage' : ''}
                >메인</a
            >
            <a
                href={page.url.toString()}
                class={Number(page.url.searchParams.get('section')) > 0
                    ? 'chosenPage'
                    : ''}>퀴즈</a
            >
            <a href="/">🏠︎</a>
        </nav>

        <article class="container">
            {@render children()}
        </article>
    </div>
</section>

<style lang="scss">
    section {
        margin: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        div {
            display: flex;
            flex-direction: column;
        }
    }

    article {
        z-index: 9999;
        width: 70vw;
    }

    h1 {
        font-size: 6rem;
        margin-bottom: 5rem;
        margin-top: 5rem;
        text-shadow: 0 0.5rem 0.5rem rgb(200, 200, 200);
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
</style>
