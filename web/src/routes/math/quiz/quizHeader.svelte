<script lang="ts">
    let { quizEngine } = $props();
</script>

<div id="quiz-info-div">
    <p>No. {quizEngine.quizCnt}</p>
    <div id="tags-div">
        <p class="tag" id="section-tag">{quizEngine.name}</p>
        {#if quizEngine.level > quizEngine.maxLevel}
            <p class="tag">단원 평가</p>
        {:else if quizEngine.practiceLevel > 0}
            <p class="tag">반복 학습</p>
            <p class="tag">{quizEngine.practiceLevel}단계</p>
        {:else}
            <p class="tag">{quizEngine.level}단계</p>
        {/if}
        <p class="tag">{quizEngine.score}점</p>
        <p class="tag" id="wrong-tag">{quizEngine.wrongCnt}개 틀림</p>
    </div>
</div>

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
</style>
