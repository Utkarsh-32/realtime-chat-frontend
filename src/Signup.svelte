<script>
    let username = $state("");
    let email = $state("");
    let password = $state("");
    let error = $state("");
    let success = $state("");

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    async function signup() {
        error = "";
        success = "";

        if (!username.trim() || !password.trim() || !email.trim()) {
            error = "Username, Password  and Email are required";
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({username, email, password})
            });

            const data = await res.json();

            if (!res.ok) {
                error = data.detail || "Signup failed";
                return;
            }

            success = "Signup successful! Please login";
            username = "";
            password = "";
        } catch (err) {
            error = "Network error. Please try again"
        }
    }
</script>

<div class="auth-box">
    <h2>Sign Up</h2>

    <input
        class="input"
        placeholder="Username"
        bind:value={username}
    />

    <input
        class="input"
        placeholder="Email"
        bind:value={email}
    />

    <input
        class="input"
        type="password"
        placeholder="Password"
        bind:value={password}
    />

    <button class="button" onclick={signup}>
        Sign Up
    </button>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if success}
        <div class="success">{success}</div>
    {/if}
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
        gap: 24px;
    }

    .input {
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #374151;
        background: #0f172a;
        color: inherit;
    }

    .button {
        margin-top: 24px;
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: #2563eb;
        color: white;
        cursor: pointer;
        font-size: 14px;
    }

    .error {
        font-size: 14px;
        color: #f87171;
    }

    .success {
        font-size: 14px;
        color: #4ade80;
    }
</style>