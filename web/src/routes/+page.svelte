<script>
    import { goto } from '$app/navigation';
</script>

<section>
    <h1>공부 <span style="color: red">감옥</span></h1>
    <article class="container">
        <button class="tag" onclick={() => goto('/math')}>수학</button>
        <button class="tag" onclick={() => goto('/voca')}>영어</button>
        <p class="horizontal-line"></p>
    </article>
</section>

<style lang="scss">
    section {
        margin: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        article {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: row;
            padding: 3rem 6rem;
        }
    }

    button {
        width: fit-content;
        margin-top: 1rem;
        font-size: 4rem;
        padding: 0 4rem;
        &:first-child {
            margin-right: 4rem;
        }
        &:hover {
            background-color: rgb(225, 225, 245);
        }
    }

    h1 {
        font-size: 6rem;
        margin-bottom: 5rem;
        margin-top: 5rem;
        text-shadow: 0 0.5rem 0.5rem rgb(200, 200, 200);
    }

</style>
