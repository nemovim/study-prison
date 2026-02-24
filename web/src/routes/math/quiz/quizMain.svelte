<script lang="ts">
    import {
        getMathjaxSvgByTex,
        getMathjaxSvgByString,
        displayAnswerAsTex,
    } from "$lib/math/mathjax.js";
    import { onMount } from "svelte";

    let { userAnswer, quizString, resultHtml = $bindable() } = $props();

    $effect(() => {
        resultHtml =
            "입력: " +
            getMathjaxSvgByString(displayAnswerAsTex(userAnswer.trim()));
    });

    onMount(() => {
        resultHtml = "입력: ";
    });
</script>

<div id="quiz-div">
    <p id="quiz-p" class="math">
        {@html getMathjaxSvgByTex(quizString)}
    </p>
    <p id="answer-p">{@html resultHtml}</p>
</div>

<style lang="scss">
    #quiz-div {
        position: relative;
        #quiz-p {
            font-size: 6rem;
            margin: 0;
            margin-top: 3rem;
            margin-bottom: 3rem;
            text-align: center;
            font-weight: bold;
            border: none;
        }
        #answer-p {
            font-size: 3rem;
            border: none;
            text-align: center;
            margin: 0;
            width: 100%;
            min-height: 7rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        margin-bottom: 3rem;
    }
</style>
