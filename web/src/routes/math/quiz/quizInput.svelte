<script lang="ts">
    import { getMathjaxSvgByString, displayAnswerAsTex } from "$lib/math/mathjax.js";
    import { onMount } from "svelte";

    let {
        resultHtml = $bindable(),
        userAnswer = $bindable(),
        quizEngine,
    } = $props();

    let answerInput = $state<HTMLInputElement>();

    let checkAnswer = $state<boolean>(false);

    let isWating = $state<boolean>(false);
    let isInputDisabled = $state<boolean>(false);
    let isBtnDisabled = $state<boolean>(false);

    let btnText = $state<string>("제출");
    let animClass = $state<string>("");

    const triggerAnim = (className: string) => {
        animClass = className;
        setTimeout(() => {
            animClass = "";
        }, 600); // 애니메이션 종료 후 초기화
    };

    const showQuiz = (): void => {
        quizEngine.getNextQuiz();
        userAnswer = "";
        resultHtml = "";
    };

    const submitAnswer = (): void => {
        const { type, isFirstTry } = quizEngine.submit(userAnswer.trim());
        if (type === "success") {
            if (isFirstTry) {
                resultHtml = `<span style="color: green">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizEngine.quizAnswer))}</span> (+1점)</span>`;
            } else {
                resultHtml = `<span style="color: green">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizEngine.quizAnswer))}</span> (+0점)</span>`;
            }
            triggerAnim("success");
        } else if (type === "retry") {
            resultHtml = `<span style="color: orange">다시 한번 풀어보세요.</span>`;
            triggerAnim("shake");
        } else {
            resultHtml = `<span style="color: red">정답: <span class="math">${getMathjaxSvgByString(displayAnswerAsTex(quizEngine.quizAnswer))}</span> (-2점)</span>`;
            triggerAnim("fail");
        }
    };

    const doNext = (): void => {
        if (isWating) return; // 대기 중일 때는 아무것도 하지 않음

        if (!checkAnswer) {
            if (userAnswer.trim() === "") return;

            submitAnswer(); // 정답 체크 및 score 반영

            isBtnDisabled = true;

            if (!quizEngine.isRetry) {
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

    $effect(() => {
        if (!isInputDisabled && answerInput) {
            answerInput.focus();
        }
    });

    onMount(() => {
        showQuiz();
    })

</script>

<svelte:window onkeydown={keyEvent} />

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