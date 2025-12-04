<script>
    import Auth from "./Auth.svelte";
    import { api, setAccessToken } from "./api";

    let me = $state(null);

    async function loadMe() {
        try {
            const data = await api("/users/me");
            me = data;
        } catch {
            me = null;
        }
    }

    function handleAuthSuccess(token) {
        setAccessToken(token);
        loadMe();
    }
</script>

{#if !me}
    <Auth onAuthSuccess={handleAuthSuccess} />
{/if}