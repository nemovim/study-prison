<script lang="ts">
    import QuizMachine from '$lib/modules/quizMachine.js';
    import { onMount } from 'svelte';

    const { reviewArr, vocaArr, isLevelTest } = $props();

    $inspect(reviewArr, vocaArr);

    const quizMachine = new QuizMachine();

    let quiz = $state<Quiz>();
    let isCorrectAnswer = $state<boolean>(true);
    let userAnswer = $state<string>('');
    let lastAnswer = $state<string>('');
    let answerArr = $state<string[]>();
    let isSolving = $state<boolean>(false);
    let quizEnds = $state<boolean>(false);
    let idx = $state<number>();

    let quizTranslation = $state<string>();
    let quizExample = $state<string>();

    $effect(() => {
        quizTranslation = quiz?.translation.replace(
            /"(.+?)"/,
            '<span class="highlight">$1</span>'
        );
        quizExample = quiz?.example.replace(
            /(______)/,
            '[<span class="highlight">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>]'
        );
    });

    function showAnswer() {
        isCorrectAnswer = false;
        quizMachine.guessWrongAnswer();
        answerArr = quizMachine.getAnswerArr();
        isSolving = false;
    }

    function nextQuiz() {
        if (isLevelTest) {
            const temp: Quiz | null = quizMachine.getNextQuizForLevelTest(
                quiz,
                isCorrectAnswer
            );
            if (temp == null) {
                quizEnds = true;
                return;
            } else {
                quiz = temp;
            }
        } else {
            quiz = quizMachine.getNextQuiz();
        }
        isSolving = true;
        isCorrectAnswer = true;
        idx = quizMachine.idx + 1;
        console.log(quizMachine.getQuizArr());
    }

    function checkAnswer() {
        if ((isCorrectAnswer = quizMachine.isCorrectAnswer(userAnswer))) {
            quizMachine.guessCorrectAnswer();
            quizEnds = quizMachine.quizEnds();
            answerArr = quizMachine.getAnswerArr();
            isSolving = false;
        }
        lastAnswer = userAnswer;
        userAnswer = '';
    }

    onMount(() => {
        quizMachine.init(reviewArr, vocaArr);
        nextQuiz();
        window.onkeydown = (e) => {
            if (e.key == 'Enter') {
                if (isSolving) {
                    checkAnswer();
                } else if (!quizEnds) {
                    nextQuiz();
                }
            }
        };
    });
</script>

{#if quiz !== undefined}
    <div id="quiz-info-div">
        <p>No. {idx}</p>
        <p>Level {Math.round(quiz.level * 100) / 100}</p>
    </div>

    <p>{@html quizExample}</p>
    <p>{@html quizTranslation}</p>

    <div id="answer-div">
        {#if isSolving}
            <div>
                <label for="answer">정답: </label>
                <!-- svelte-ignore a11y_autofocus -->
                <input type="text" bind:value={userAnswer} autofocus />
            </div>
            {#if !isCorrectAnswer}
                <p><span style:color="red">{lastAnswer}</span> 오답입니다.</p>
            {/if}
            <button onclick={showAnswer} id="pass-btn">PASS</button>
        {:else if !isSolving}
            <p>
                정답: <span
                    style:color={(() => {
                        if (isCorrectAnswer) {
                            return 'green';
                        } else {
                            return 'red';
                        }
                    })()}>{answerArr}</span
                >&nbsp;&nbsp;&nbsp;&nbsp;[{quiz.pronunciation}]
            </p>

            {#if !quizEnds}
                <button onclick={nextQuiz} id="next-btn">NEXT</button>
            {:else}
                <a href="/" id="return-btn">돌아가기</a>
            {/if}
        {/if}
    </div>
{/if}

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

    :global(.highlight) {
        background-color: rgb(230, 255, 230);
        /* border-radius: .5rem; */
        font-weight: bold;
        padding: 0.2rem 0.5rem;
    }

    #answer-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2.2rem;
        padding-top: 2rem;
        border-top: 0.15rem solid black;
        /* padding-bottom: 0.5rem;
        border-bottom: 0.1rem solid red; */
        /* margin: 1rem 0; */
        font-size: 3rem;

        & > div {
            display: flex;
            align-items: center;
        }

        input {
            font-family: SunBatang-Light;
            border: none;
            background-color: rgb(245, 245, 245);
            font-size: 2.5rem;
            padding: 0.8rem 1.6rem;
            width: 30rem;
            margin-left: 1rem;

            &:focus {
                outline: none;
            }
        }
    }

    #return-btn {
        color: black;
        text-decoration: none;
        width: fit-content;
    }

    #pass-btn,
    #next-btn,
    #return-btn {
        font-size: 3rem;
        font-weight: bold;
        padding: 0.8rem 2rem;
        border: none;
        font-family: SunBatang-Light;
        /* background-color: rgb(255, 240, 240); */
        background-color: rgb(255, 255, 200);
        box-shadow: 0 0.5rem 0.5rem rgb(220, 220, 220);

        &:hover {
            background-color: rgb(245, 245, 200);
        }
    }
</style>
