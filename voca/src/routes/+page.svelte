<script lang="ts">
    import { signOut } from '@auth/sveltekit/client';
    import { getContext } from 'svelte';
    import Info from './info.svelte';

    const { data } = $props();
    const user: User = $derived(JSON.parse(data.user));

    let pageIdx: {idx: number} = getContext('pageIdx');
    pageIdx.idx = 1;
</script>

<Info {user} />
<p>현재 어휘 수준은 <b>{Math.round(user.level * 100) / 100}</b>이며,</p>
<p>지금까지 <b>{user.cnt}</b>개의 영단어를 외웠습니다.</p>
{#if user.cnt < 20}
    <p style:color="green">(레벨 테스트 진행 중)</p>
{/if}
<div>
<button onclick={() => signOut()}>로그아웃</button>

</div>
<p id="lastline-p"></p>

<style>
    #lastline-p {
        border-bottom: 0.15rem solid black;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
    }

    button {
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
</style>
