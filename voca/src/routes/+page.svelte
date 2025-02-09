<script lang="ts">
    import Info from './info.svelte';

    const { data } = $props();
    const user: User = $derived(JSON.parse(data.user));

</script>

<Info user={user} />
<p>현재 어휘 수준은 <b>{Math.round(user.level * 100) / 100}</b>이며,</p>
<p>지금까지 <b>{user.cnt}</b>개의 영단어를 외웠습니다.</p>
<p id="lastline-p"></p>


<style>
    #lastline-p {
        border-bottom: 0.15rem solid black;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
    }
</style>
