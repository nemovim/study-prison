<script lang="ts">
    import { enhance } from '$app/forms';
    import Info from '../info.svelte';

    const { data, form } = $props();
    const user = $derived(JSON.parse(data.user));
    let voca = $derived(JSON.parse(form?.voca || '{}'));
    let isCreating = $state<boolean>(false);
</script>

<Info {user} />

<article>
    <div>
        <form
            method="POST"
            use:enhance={() => {
                isCreating = true;

                return async ({ update }) => {
                    await update();
                    isCreating = false;
                };
            }}
        >
            <div>
                <label for="word-input">영단어: </label>
                <input type="text" name="word" id="word-input" />
            </div>
            <div>
                <label for="meaning-input">한국어 뜻: </label>
                <input type="text" name="meaning" id="meaning-input" />
            </div>
            <div>
                <label for="overwrite-checkbox">덮어 씌우기: </label>
                <input
                    type="checkbox"
                    name="overwrite"
                    id="overwrite-checkbox"
                />
            </div>
            <button>추가</button>
        </form>
    </div>
    <div>
        {#if isCreating}
            <p>Loading...</p>
        {:else if form?.success && Object.keys(voca).length !== 0}
            <p>단어가 추가되었습니다.</p>
            <p>레벨: {voca.level}</p>
            <p>예문: {voca.example}</p>
            <p>번역: {voca.translation}</p>
            <p>발음: {voca.pronunciation}</p>
        {:else if form?.success === false}
            <p>단어 추가에 실패했습니다.</p>
            <p>{form?.error}</p>
        {/if}
    </div>
</article>

<style>

    article {
        display: flex;
        border-bottom: 0.15rem solid black;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        justify-content: space-between;
    }

    article > div {
        width: 49%;
    }

    article > div > p {
        font-size: 3rem;
        margin: 1.2rem 0;
        padding-bottom: 0.6rem;
        border-bottom: 0.1rem solid red;
    }

    form > div {
        margin: 1.2rem 0;
        padding-bottom: 0.6rem;
        border-bottom: 0.1rem solid red;
    }

    label {
        font-size: 3rem;
    }

    #overwrite-checkbox {
        width: fit-content;
    }

    input {
        font-family: SunBatang-Light;
        border: none;
        background-color: rgb(245, 245, 245);
        font-size: 2.5rem;
        padding: 0.6rem 1.2rem;
        width: 30rem;
        margin-left: 1rem;
    }

    input:focus {
        outline: none;
    }

    button {
        font-size: 2.5rem;
        font-weight: bold;
        padding: 0.8rem 2rem;
        border: none;
        font-family: SunBatang-Light;
        /* background-color: rgb(255, 240, 240); */
        background-color: rgb(255, 255, 200);
        box-shadow: 0 0.5rem 0.5rem rgb(220, 220, 220);
        margin: 1.2rem 0;
    }

    button:hover {
        background-color: rgb(245, 245, 200);
    }
</style>
