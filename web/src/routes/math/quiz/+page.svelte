<script lang="ts">
    import { createQuizEngine } from "./quizEngine.svelte.js";
    import QuizHeader from "./quizHeader.svelte";
    import QuizMain from "./quizMain.svelte";
    import QuizInput from "./quizInput.svelte";

    const scorePerLevel = 10;
    const quizEngine = createQuizEngine(scorePerLevel);

    let userAnswer = $state<string>("");
    let resultHtml = $state<string>("");
</script>

{#if quizEngine.maxLevel === 0}
    <p>존재하지 않는 단원입니다.</p>
{:else}
    <QuizHeader {quizEngine} />
    <QuizMain {userAnswer} quizString={quizEngine.quizString} bind:resultHtml={resultHtml} />
    <QuizInput {quizEngine} bind:userAnswer={userAnswer} bind:resultHtml={resultHtml} />
{/if}
<p class="horizontal-line"></p>

<style lang="scss">
</style>
