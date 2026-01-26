<script lang="ts">
    import { getQuizModule, getMaxSection, quizModuleMap } from "$lib/math/quiz";
</script>

{#each quizModuleMap.keys() as grade}
    {#if grade <= 6}
        <p>• 초등학교 {grade}학년</p>
    {:else}
        <p>• 중학교 {grade - 6}학년</p>
    {/if}
    <article>
        {#each quizModuleMap.get(grade)!.keys() as section}
            <div>
                <a class="tag" href="/math/quiz?grade={grade}&section={section}"
                    >{section}. {getQuizModule(grade, section)!.name}</a
                >
                <a
                    class="tag test-tag"
                    href="/math/quiz?grade={grade}&section={section}&isTest=true"
                    >[단원 평가]</a
                >
            </div>
        {/each}
    </article>
{/each}

<style lang="scss">
    p {
        font-weight: bold;
    }
    article {
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
