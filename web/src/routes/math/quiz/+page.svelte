<script lang="ts">
    import type { QuizModule } from "$lib/math/types";
    import { getMathjaxSvgByString, getMathjaxSvgByTex } from "$lib/math/mathjax";
    import { getQuizModule, isCorrect } from "$lib/math/quiz";
    import { onMount } from "svelte";
    import { page } from "$app/state";

    const emptyQuizModule: QuizModule = {
        grade: -1,
        section: -1,
        name: "",
        maxLevel: 0,
        makeQuiz: () => ({ quiz: "", answer: "" }),
    };

    const scorePerLevel = 10;

    let grade = $derived<number>(Number(page.url.searchParams.get("grade")));
    let section = $derived<number>(
        Number(page.url.searchParams.get("section")),
    );
    let startLevel = $derived<number>(
        Number(page.url.searchParams.get("level")),
    );
    let startScore = $derived<number>(
        Number(page.url.searchParams.get("score")),
    );
    let isTest = $derived<boolean>(
        page.url.searchParams.get("isTest") === "true",
    );

    let quizModule = $derived<QuizModule>(getQuizModule(grade, section) ?? emptyQuizModule);
    let maxLevel = $derived<number>(quizModule.maxLevel);
    let quizCnt = $state<number>(0);
    let score = $state<number>(0);
    let wrongCnt = $state<number>(0);
    let level = $derived.by<number>(() => {
        if (isTest) return maxLevel + 1;

        let temp = Math.floor(score / scorePerLevel) + 1;
        if (temp <= 0) {
            temp = 1;
        }
        if (temp > maxLevel) temp = maxLevel + 1;
        return temp;
    });

    let answerInput = $state<HTMLElement>();
    let userAnswer = $state<string>("");

    let quizString = $state<string>("");
    let quizAnswer = $state<string>("");
    let resultHtml = $state<string>("");

    let checkAnswer = $state<boolean>(false);
    let isWating = $state<boolean>(false);

    let isDisabledInput = $state<boolean>(false);
    let isDisabledBtn = $state<boolean>(false);
    let btnText = $state<string>("제출");

    $effect(() => {
        resultHtml = '입력: ' + getMathjaxSvgByString(userAnswer.trim() || '0');
    });

    function doNext() {
        if (!checkAnswer && !isWating) {
            submitAnswer();
            isDisabledBtn = true;
            isDisabledInput = true;
            btnText = "다음";
            checkAnswer = true;
            isWating = true;
            setTimeout(() => {
                isDisabledBtn = false;
                isWating = false;
            }, 1000);
        } else if (!isWating) {
            showQuiz();
            isDisabledInput = false;
            btnText = "제출";
            checkAnswer = false;
        }
    }

    function submitAnswer() {
        if (isCorrect(userAnswer.trim() || '0', quizAnswer)) {
            resultHtml = `<span style="color: green">정답: <span class="math">${getMathjaxSvgByString(quizAnswer)}</span> (+1점)</span>`;
            score += 1;
        } else {
            resultHtml = `<span style="color: red">정답: <span class="math">${getMathjaxSvgByString(quizAnswer)}</span> (-2점)</span>`;
            score -= 2;
            wrongCnt += 1;
        }
    }

    const showQuiz = () => {
        const { quiz, answer } = quizModule.makeQuiz(level);
        quizString = quiz;
        quizAnswer = answer;
        userAnswer = "";
        resultHtml = "";
        quizCnt += 1;
    };

    function keyEvent(event: KeyboardEvent) {
        if (event.key === "Enter") doNext();
        else answerInput?.focus();
    }

    onMount(() => {
        if (startScore > 0) score = startScore;
        else if (startLevel > 0) score = (startLevel - 1) * scorePerLevel;
        showQuiz();
        resultHtml = '입력: ' + getMathjaxSvgByString("0");
    });
</script>

<svelte:window onkeydown={keyEvent} />

{#if quizModule.name === ""}
    <p>존재하지 않는 단원입니다.</p>
{:else}
    <div id="quiz-info-div">
        <p>No. {quizCnt}</p>
        <div id="tags-div">
            <p class="tag" id="section-tag">{quizModule.name}</p>
            {#if level > maxLevel}
                <p class="tag">단원 평가</p>
            {:else}
                <p class="tag">{level}단계</p>
            {/if}
            <p class="tag">{score}점</p>
            <p class="tag" id="wrong-tag">{wrongCnt}개 틀림</p>
        </div>
    </div>

    <div id="quiz-div">
        <p id="quiz-p" class="math">{@html getMathjaxSvgByTex(quizString)}</p>
        <p id="answer-p">{@html resultHtml}</p>
    </div>

    <div id="answer-div">
        <!-- svelte-ignore a11y_autofocus -->
        <input
            autofocus
            type="text"
            id="answer-input"
            disabled={isDisabledInput}
            placeholder="답을 입력하세요"
            autocomplete="off"
            bind:this={answerInput}
            bind:value={userAnswer}
        />
        <button id="submit-btn" disabled={isDisabledBtn} onclick={doNext}
            >{btnText}</button
        >
    </div>
{/if}
<p class="horizontal-line"></p>

<style lang="scss">
    #quiz-info-div {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        padding-bottom: 0.5rem;
        border-bottom: solid 0.15rem black;
        margin-bottom: 1.2rem;
        font-size: 2rem;
    }

    #tags-div {
        display: flex;
    }

    #section-tag {
        background-color: rgb(255, 255, 210);
    }

    #wrong-tag {
        background-color: rgb(255, 220, 220) !important;
    }

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
            // position: absolute;
            // bottom: 0;
            width: 100%;
        }
        margin-bottom: 3rem;
    }

    #answer-div {
        display: flex;
        justify-content: center;

        #answer-input {
            font-size: 3.2rem;
            padding: 0.5rem 1.5rem;
            font-weight: normal;
            border: none;
            width: 30vw;
            background-color: rgb(245, 245, 245);
            &:focus {
                outline: none;
            }
        }

        #submit-btn {
            font-size: 2.5rem;
            font-weight: bold;
            padding: 0.4rem 1.6rem;
            margin-left: 1rem;
            border: none;
            width: 6vw;
            background-color: rgb(220, 255, 220);
            box-shadow: 0 0.3rem 0.5rem rgb(220, 220, 220);

            &:hover {
                background-color: rgb(215, 240, 215);
            }
        }
    }
</style>
