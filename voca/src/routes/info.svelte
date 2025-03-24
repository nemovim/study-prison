<script lang="ts">
    const { user, page } = $props();

    const version = '1.0.1';

    function parse_time() {
        const y = new Date().getFullYear();
        const m = new Date().getMonth() + 1;
        const d = new Date().getDate();
        return `${y}/${m}/${d}`;
    }
</script>

<div id="info-div">
    {#if page === 'main'}
    <p>{user.email}</p>
    {:else if page === 'add'}
    <p>v. {version}</p>
    {/if}
    <p>{parse_time()}</p>

</div>

<style>
    #info-div {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        padding-bottom: 0.5rem;
        border-bottom: solid 0.15rem black;
        margin-bottom: 1rem;
        font-size: 2rem;
    }
</style>
