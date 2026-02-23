<script lang="ts">
    import type { QuizModule } from "$lib/math/types";
    import {
        getMathjaxSvgByString,
        getMathjaxSvgByTex,
        displayAnswerAsTex,
    } from "$lib/math/mathjax";
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
    let practiceLevel = $derived<number>(
        Number(page.url.searchParams.get("practice")),
    );

    let isRetry = $state<boolean>(false);
    let animClass = $state<string>("");

    const triggerAnim = (className: string) => {
        animClass = className;
        setTimeout(() => {
            animClass = "";
        }, 600); // 애니메이션 종료 후 초기화
    };

    let quizModule = $derived<QuizModule>(
        getQuizModule(grade, section) ?? emptyQuizModule,
    );
    let maxLevel = $derived<number>(quizModule.maxLevel);
    let quizCnt = $state<number>(0);
    let score = $state<number>(0);
    let wrongCnt = $state<number>(0);

    let level = $derived.by<number>(() => {
        if (isTest) return maxLevel + 1;
        if (practiceLevel > 0) return practiceLevel;

        // 점수를 기반으로 한 단계 계산을 좀 더 직관적으로
        const calculatedLevel = Math.floor(score / scorePerLevel) + 1;
        return Math.max(1, Math.min(calculatedLevel, maxLevel + 1));
    });

    let answerInput = $state<HTMLElement>();
    let userAnswer = $state<string>("");

    let quizString = $state<string>("");
    let quizAnswer = $state<string>("");
    let resultHtml = $state<string>("");

    let checkAnswer = $state<boolean>(false);
    let isWating = $state<boolean>(false);

    let isInputDisabled = $state<boolean>(false);
    let isBtnDisabled = $state<boolean>(false);
    let btnText = $state<string>("제출");

    $effect(() => {
        resultHtml =
            "입력: " +
            getMathjaxSvgByString(displayAnswerAsTex(userAnswer.trim()));
    });

    $effect(() => {
        if (!isInputDisabled && answerInput) {
            answerInput.focus();
        }
    });

    const submitAnswer = (): void => {
        if (isCorrect(userAnswer.trim(), quizAnswer)) {
            if (!isRetry) {
                resultHtml = `<span style="color: green">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizAnswer))}</span> (+1점)</span>`;
                score += 1;
                triggerAnim("success");
            } else {
                resultHtml = `<span style="color: green">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizAnswer))}</span> (+0점)</span>`;
                isRetry = false;
            }
        } else {
            if (!isRetry) {
                resultHtml = `<span style="color: orange">다시 한번 풀어보세요.</span>`;
                isRetry = true;
                triggerAnim("shake");
            } else {
                resultHtml = `<span style="color: red">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizAnswer))}</span> (-2점)</span>`;
                score -= 2;
                wrongCnt += 1;
                isRetry = false;
                triggerAnim("fail");
            }
        }
    };

    const showQuiz = (): void => {
        const { quiz, answer } = quizModule.makeQuiz(level);
        quizString = quiz;
        quizAnswer = answer;
        userAnswer = "";
        resultHtml = "";
        quizCnt += 1;
    };

    const doNext = (): void => {
        if (isWating) return; // 대기 중일 때는 아무것도 하지 않음

        if (!checkAnswer) {
            if (userAnswer.trim() === "") return;

            submitAnswer(); // 정답 체크 및 score 반영

            isBtnDisabled = true;

            if (!isRetry) {
                isInputDisabled = true;
                checkAnswer = true;
                btnText = "다음";
            }

            // 버튼 연타 방지 쿨다운
            isWating = true;
            setTimeout(() => {
                isWating = false;
                isBtnDisabled = false;
            }, 800);
        } else {
            // '다음' 버튼을 누른 경우
            showQuiz();
            isInputDisabled = false;
            btnText = "제출";
            checkAnswer = false;
        }
    };

    const keyEvent = (event: KeyboardEvent): void => {
        if (event.key === "Enter") doNext();
        else answerInput?.focus();
    };

    onMount(() => {
        if (startScore > 0) score = startScore;
        else if (startLevel > 0) score = (startLevel - 1) * scorePerLevel;
        showQuiz();
        resultHtml = "입력: ";
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
            {:else if practiceLevel > 0}
                <p class="tag">반복 학습</p>
                <p class="tag">{practiceLevel}단계</p>
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
        <input
            type="text"
            id="answer-input"
            class={animClass}
            disabled={isInputDisabled}
            placeholder="답을 입력하세요"
            autocomplete="off"
            bind:this={answerInput}
            bind:value={userAnswer}
        />
        <button id="submit-btn" disabled={isBtnDisabled} onclick={doNext}
            >{btnText}</button
        >
    </div>
{/if}
<p class="horizontal-line"></p>

<style lang="scss">
    /* 1. 재도전 시 (절레절레) */
    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        75% {
            transform: translateX(5px);
        }
    }

    /* 2. 정답일 때 (통통 튀기) */
    @keyframes success-bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-7px);
        }
    }

    /* 3. 완전히 틀렸을 때 (맥박 뛰듯 붉은색 강조) */
    @keyframes final-fail {
        0% {
            background-color: white;
        }
        50% {
            background-color: #ffebee;
            border-color: #ff8a80;
        }
        100% {
            background-color: white;
        }
    }

    .shake {
        animation: shake 0.4s ease-in-out;
        outline: 1px solid orange !important; /* border 대신 outline 사용 */
        outline-offset: -1px;
    }

    .success {
        animation: success-bounce 0.4s ease-in-out;
        outline: 1px solid #4caf50 !important;
        outline-offset: -1px;
    }

    .fail {
        animation: final-fail 0.6s ease-in-out;
        outline: 1px solid #e57373 !important;
        outline-offset: -1px;
    }

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
            width: 100%;
            min-height: 7rem;
            display: flex;
            justify-content: center;
            align-items: center;
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
