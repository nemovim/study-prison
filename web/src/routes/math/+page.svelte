<script lang="ts">
    import { getSectionName } from '$lib/math/quiz';
</script>

<p>• 중학교 1학년</p>
<article>
    {#each [1, 2, 3, 4, 5, 6] as i, idx}
    <div>
        <a class='tag' href="/math/middle?section={i}">{idx+1}. {getSectionName(i)}</a>
        <a class='tag test-tag' href="/math/middle?section={i}&isTest=true">[단원 평가]</a>
    </div>
    {/each}
</article>

<style lang="scss">
    p {
        font-weight: bold;
    }
    article{
        display: flex;
        flex-direction: column;
    }

    div {
        display: flex;
    }

    a {
        width: fit-content;
        margin-top: 1.5rem;
        font-size: 2rem;
        text-decoration: none;
        color: black;
        background-color: rgb(255, 255, 210);
        &:hover {
            background-color: rgb(245, 245, 200);
        }
    }

    .test-tag {
        background-color: rgb(235, 235, 255);
        &:hover {
            background-color: rgb(225, 225, 245);
        }
    }
</style>
