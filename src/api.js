let accessToken = null;

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function setAccessToken(token) {
    accessToken = token;
}

export function clearAuth() {
    accessToken = null;
}

export async function api(path, options={}) {
    const headers = {
        ...(options.headers || {}),
        "Content-type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: "include",
        headers
    });

    if (res.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) throw new Error("Unauthorized");
        
        const retryRes = await fetch(`${API_BASE}${path}`, {
            ...options,
            credentials: "include",
            headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`
            }
        });

        return handleResponse(retryRes);
    }

    return handleResponse(res);
}

async function handleResponse(res) {
    const data = await res.json().catch(()=>{});
    if (!res.ok) throw new Error(data.failed || "Request failed");
    return data;
};

async function refreshToken() {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return false;
    const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${refresh}`
        }
    });
    
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) return false;

    accessToken = data.access_token;

    localStorage.setItem("refreshToken", data.refresh_token);
    return true;
};

export async function loginRequest(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password)
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    if (!data.access_token) throw new Error("Access token not returned");
    accessToken = data.access_token;
    localStorage.setItem("refreshToken", data.refresh_token);
    return data.access_token;
}

export async function signupRequest(username, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({username, email, password}),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || "Sign up failed");

    const token = await loginRequest(username, password);
    return token;
}