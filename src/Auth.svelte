<script>
    import { loginRequest, signupRequest } from "./api";

    let mode = $state("login");
    let username = $state("");
    let email = $state("");
    let password = $state("");
    let error = $state("");

    let { onAuthSuccess = () => {} } = $props();

    async function handleSubmit() {
        error = "";

        if (!username.trim() || !password.trim()) {
            error = "Username and Password required";
            return;
        }

        try {
            if (mode === "signup") {
                const token = await signupRequest(username, email, password);
                onAuthSuccess(token)
            } else {
                const token = await loginRequest(username, password);
                onAuthSuccess(token);
            }
        } catch (e) {
            error = e.message;
        }
    }
</script>

<div class="auth-box">
    <h2>{mode==="signup" ? "Sign Up": "Login"}</h2>

    <input
        class="input"
        placeholder="Username"
        bind:value={username}
    />

    {#if mode === "signup"}
        <input
            class="input"
            placeholder="Email"
            bind:value={email}
        />
    {/if}

    <input
        class="input"
        placeholder="Password"
        type="password"
        bind:value={password}
    />

    <button class="button" onclick={handleSubmit}>
        {mode === "signup" ? "Sign Up" : "Login"}
    </button>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    <div class="toggle">
        {#if mode === "signup"}
            <span>Already have an account ? Login</span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_missing_attribute -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <a onclick={() => (mode = "login")}>Login</a>
        {:else}
            <span>Don't have an account? Sign Up</span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_missing_attribute -->
            <a onclick={() => (mode = "signup")}>Sign Up</a>
        {/if}
    </div>
</div>


<style>
  .auth-box {
    max-width: 640px;
    min-height: fit-content;
    margin: 80px auto;
    padding: 20px;
    border: 1px solid #374151;
    border-radius: 10px;
    background: #1e293b;
    color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input {
    padding: 18px;
    border-radius: 6px;
    border: 1px solid #374151;
    background: #0f172a;
    color: inherit;
  }

  .button {
    margin-top: 56px;
    padding: 20px;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }

  .error {
    color: #f87171;
    font-size: 14px;
  }

  .toggle {
    font-size: 14px;
    text-align: center;
  }

  a {
    color: #60a5fa;
    cursor: pointer;
    margin-left: 6px;
  }
</style>
