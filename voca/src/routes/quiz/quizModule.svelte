<script lang="ts">
    import QuizMachine from '$lib/modules/quizMachine.svelte.js';
    import { onMount } from 'svelte';

    const { reviewArr, vocaArr, isLevelTest } = $props();

    // $inspect(reviewArr, vocaArr);

    const quizMachine = new QuizMachine();

    let quiz = $state<Quiz>();
    let isCorrectAnswer = $state<boolean>(true);
    let wrongCnt = $state<number>(-1);
    let userAnswer = $state<string>('');
    let lastAnswer = $state<string>('');
    let answerArr = $state<string[]>();
    let isSolving = $state<boolean>(false);
    let isWating = $state<boolean>(false);
    let quizEnds = $state<boolean>(false);
    let idx = $state<number>();
    let reviewCnt = $state<number | null>(null);
    let nextReview = $state<string | null>(null);
    let oxRate = $state<number>(0);

    let quizTranslation = $derived<string>(
        quiz?.translation.replace(
            /"(.+?)"/,
            `<span class="highlight">$1<span>${quiz?.meaning || ''}</span></span>`
        ) || ''
    );
    let quizExample = $derived<string>(
        quiz?.example.replace(
            /(______)/,
            '[<span class="highlight">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>]'
        ) || ''
    );

    async function showAnswer() {
        isWating = true;
        if (userAnswer !== '' && !confirm('정말로 답을 보시겠습니까?')) {
            isWating = false;
            return true;
        }
        isSolving = false;
        isCorrectAnswer = false;
        userAnswer = '';
        answerArr = quizMachine.getAnswerArr();
        await quizMachine.guessWrongAnswer();
        nextReview = quizMachine.getReviewDateName();
        reviewCnt = null;
        isWating = false;
    }

    function nextQuiz() {
        isWating = true;
        if (isLevelTest) {
            const temp: Quiz | null = quizMachine.getNextQuizForLevelTest(
                quiz,
                isCorrectAnswer
            );
            if (temp == null) {
                quizEnds = true;
                isWating = false;
                return;
            } else {
                quiz = temp;
            }
        } else {
            quiz = quizMachine.getNextQuiz();
        }
        reviewCnt = quizMachine.getReview().reviewCnt;
        oxRate = quizMachine.getOXRate();
        nextReview = null;
        isSolving = true;
        isCorrectAnswer = true;
        idx = quizMachine.idx + 1;
        isWating = false;
        // console.log(quizMachine.getQuizArr());
    }

    async function checkAnswer() {
        isWating = true;
        const answerCheckResult = quizMachine.isCorrectAnswer(userAnswer);
        isCorrectAnswer = answerCheckResult['result'];
        wrongCnt = answerCheckResult['diff'];
        if (isCorrectAnswer) {
            isSolving = false;
            if (!isLevelTest) {
                quizEnds = quizMachine.quizEnds();
            }
            answerArr = quizMachine.getAnswerArr();
            await quizMachine.guessCorrectAnswer();
            nextReview = quizMachine.getReviewDateName();
            reviewCnt = null;
        }
        lastAnswer = userAnswer;
        userAnswer = '';
        isWating = false;
    }

    function returnToMain() {
        window.location.href = '/';
    }

    onMount(() => {
        console.log(reviewArr);
        console.log(vocaArr);
        quizMachine.init(reviewArr, vocaArr);
        nextQuiz();
        window.onkeydown = async (e) => {
            if (e.key == 'Enter') {
                e.preventDefault();
                if (!isWating) {
                    if (isSolving) {
                        await checkAnswer();
                    } else if (!quizEnds) {
                        nextQuiz();
                    }
                }
            }
        };
    });
</script>

{#if quiz !== undefined}
    <div id="quiz-info-div">
        <p>No. {idx}</p>
        <div id="tags-div">
            {#if !isLevelTest}
                {#if reviewCnt != null}
                    {#if reviewCnt === -1}
                        <p class="tag">새로운 단어</p>
                    {:else if reviewCnt === 0}
                        <p class="tag">방금 틀린 단어</p>
                    {:else}
                        <p class="tag">{reviewCnt}번째 복습</p>
                    {/if}
                {/if}
                <p class="tag {nextReview ? '' : 'hidden'}">
                    {nextReview} 뒤 복습
                </p>
            {/if}
            <p class="tag">
                정답률: {Math.round(oxRate * 100) / 100}%
            </p>

            <p class="tag">Level {Math.round(quiz.level * 100) / 100}</p>
        </div>
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
                <div style:display="flex">
                    {#if wrongCnt > 0 && wrongCnt <= 2}
                        <p style:color="red">{lastAnswer}</p>
                        <p id="wrong-cnt-p">{wrongCnt}문자 차이!</p>
                    {:else}
                        <p style:color="red">{lastAnswer}</p>
                        <p id="wrong-p">틀렸습니다.</p>
                    {/if}
                </div>
            {/if}
            <div id="btn-div">
                <button onclick={showAnswer} id="pass-btn">패스</button>
                <button onclick={checkAnswer} id="answer-btn">확인</button>
            </div>
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

            {#if !isWating}
                {#if !quizEnds}
                    <button onclick={nextQuiz} id="next-btn">다음</button>
                {:else}
                    <a data-sveltekit-reload href="/" id="return-btn"
                        >돌아가기</a
                    >
                    <!-- <button id="return-btn" onclick={returnToMain}
                        >돌아가기</button
                    > -->
                {/if}
            {:else}
                <button id="loading-btn">로딩중</button>
            {/if}
        {/if}
    </div>
{:else if quizEnds}
    <p>더 이상 외울 단어가 없습니다.</p>
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
        position: relative;

        :global(span) {
            font-size: 1.5rem;
            width: max-content;
            min-width: 100%;
            left: 0;
            text-align: center;
            top: -1.5rem;
            position: absolute;
        }
    }

    :global(#wrong-p) {
        // display: block;
        // position: relative;
        font-size: 2rem;
        margin-left: 1rem;
        // left: 0;
        color: red;
        font-weight: bold;
    }

    :global(#wrong-cnt-p) {
        // display: block;
        // position: relative;
        font-size: 2rem;
        margin-left: 1rem;
        // left: 0;
        color: limegreen;
        font-weight: bold;
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
        text-decoration: none;
        color: black;
    }

    #pass-btn {
        margin-right: 1rem;
        background-color: rgb(255, 220, 220) !important;
    }

    #answer-btn {
        background-color: rgb(220, 255, 220) !important;
    }

    #pass-btn,
    #answer-btn,
    #next-btn,
    #return-btn,
    #loading-btn {
        font-size: 2.2rem;
        font-weight: bold;
        padding: 0.4rem 1.6rem;
        border: none;
        font-family: SunBatang-Light;
        /* background-color: rgb(255, 240, 240); */
        background-color: rgb(255, 255, 200);
        box-shadow: 0 0.3rem 0.5rem rgb(220, 220, 220);

        &:hover {
            background-color: rgb(245, 245, 200);
        }
    }

    #tags-div {
        display: flex;
    }

    .tag {
        font-size: 1.8rem;
        font-weight: bold;
        padding: 0.4rem 1.6rem;
        border: none;
        font-family: SunBatang-Light;
        /* background-color: rgb(255, 240, 240); */
        background-color: rgb(235, 235, 255);
        box-shadow: 0 0.3rem 0.5rem rgb(220, 220, 220);
        margin: 0 0.5rem;
        position: relative;
        top: -0.5rem;
    }
</style>
