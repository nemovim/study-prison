<script lang="ts">
    import Info from '../info.svelte';
    import QuizModule from './quizModule.svelte';

    const { data, form } = $props();

    const user = $derived(JSON.parse(data.user));

    const reviewArr = JSON.parse(data.reviewArr);
    const vocaArr = JSON.parse(data.vocaArr);
    const isLevelTest = data.isLevelTest;


</script>

{#if vocaArr.length === 0}
<Info user={user} />
<p>더 이상 외울 단어가 없습니다.</p>
{:else}
<QuizModule reviewArr={reviewArr} vocaArr={vocaArr} isLevelTest={isLevelTest}/>
{/if}

<style>
</style>