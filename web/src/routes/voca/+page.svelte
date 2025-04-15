<script lang="ts">
    import { signOut } from '@auth/sveltekit/client';
    import { getContext } from 'svelte';
    import Info from './info.svelte';

    const { data } = $props();
    const user: User = $derived(JSON.parse(data.user));
    const reviewArr: Review[] = $derived(JSON.parse(data.reviewArr));
    $inspect(reviewArr);
    const toReviewCnt: number = $derived(
        reviewArr.reduce(
            (prev, review) =>
                new Date(review.reviewDate) <= new Date() ? prev + 1 : prev,
            0
        )
    );
    const reviewingCnt: number = $derived(
        reviewArr.reduce(
            (prev, review) => (review.reviewCnt <= 4 ? prev + 1 : prev),
            0
        )
    );
    const memorizedCnt: number = $derived(
        reviewArr.reduce(
            (prev, review) => (review.reviewCnt > 4 ? prev + 1 : prev),
            0
        )
    );

    const grad: number = $derived.by(() => {
        let prevLevel = 1;
        for (let history of user.historyArr.toReversed()) {
            if (new Date(history.date).getTime() > new Date().getTime() - 7*24*60*60*1000) {
                prevLevel = history.level;
            } else {
                break;
            }
        }

        const grad = (user.level - prevLevel)

        return Math.round(grad*100)/100;
    })

    const gradHtml: string = $derived.by(() => {
        if (grad > 0) {
            return `<span style="color: green">+${grad}</span>`;
        } else if (grad === 0) {
            return `<span style="color: gray">${grad}</span>`;
        } else {
            return `<span style="color: red">${grad}</span>`;
        }
    })

    let pageIdx: { idx: number } = getContext('pageIdx');
    pageIdx.idx = 1;
</script>

<Info {user} page={'main'}/>
<p>
    현재 어휘 수준은 <b>{Math.round(user.level * 100) / 100}({@html gradHtml})</b>이며, 총
    <b>{reviewArr.length}</b>개의 영단어를 공부했습니다.
</p>
<p>• <b>{toReviewCnt}</b>개의 영단어가 복습이 필요하며,</p>
<p>• <b>{reviewingCnt}</b>개의 영단어를 외워가는 중이며,</p>
<p>• <b>{memorizedCnt}</b>개의 영단어를 암기했습니다.</p>
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
    }

    div {
        display: flex;
        justify-content: right;
        align-items: center;
    }

    button {
        font-size: 2.2rem;
        font-weight: bold;
        padding: 0.4rem 1.6rem;
        border: none;
        /* background-color: rgb(255, 240, 240); */
        background-color: rgb(255, 255, 200);
        box-shadow: 0 0.3rem 0.5rem rgb(220, 220, 220);

        &:hover {
            background-color: rgb(245, 245, 200);
        }
    }

</style>
