"use server";

interface AuthPayload {
    user_name: string;
    stress_score: number;
    happiness_score: number;
}

interface AuthResponse {
    success: boolean;
    data?: {
        access_token: string;
        user_name: string;
        user_id?: string;
        user_demo_id?: string;
        stress_score: number;
        happiness_score: number;
    };
    error?: string;
}

export async function authenticateUser(
    payload: AuthPayload,
): Promise<AuthResponse> {
    const API_URL = `${process.env.BACKEND_API_SERVER}/api/user/auth/api-key/`;
    const CLIENT_NAME = process.env.DEMO_USER_NAME;
    const API_SECRET = process.env.DEMO_WEB_API_TOKEN;

    if (!CLIENT_NAME || !API_SECRET) {
        return {
            success: false,
            error: "Configuration error: Missing API credentials",
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300_000);

        // Generate 16-character random requestUid
        const requestUid = Math.random().toString(36).substring(2, 18);

        console.log("Authenticating user with payload:", payload);

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${CLIENT_NAME}:${API_SECRET}`)}`,
            requestUid: requestUid,
        };

        const res = await fetch(API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let data: any = null;
        const isJson = res.headers
            .get("content-type")
            ?.includes("application/json");
        data = isJson ? await res.json() : { message: await res.text() };

        if (!res.ok) {
            const msg =
                data?.message ||
                data?.error ||
                `Authentication failed (${res.status})`;
            return {
                success: false,
                error: `[${requestUid}] ${msg}`,
            };
        }

        const token = data?.data?.access_token || data?.access_token || null;

        if (!token) {
            const msg = data?.message || "No access token received";
            return {
                success: false,
                error: `[${requestUid}] ${msg}`,
            };
        }

        const userName =
            data?.data?.user_name ?? data?.user_name ?? payload.user_name;
        const userId =
            data?.data?.user_demo_id ??
            data?.data?.user_id ??
            data?.user_demo_id ??
            data?.user_id ??
            null;
        const stress = data?.data?.stress_score ?? payload.stress_score;
        const happy = data?.data?.happiness_score ?? payload.happiness_score;

        return {
            success: true,
            data: {
                access_token: token,
                user_name: userName,
                user_id: userId,
                user_demo_id: userId,
                stress_score: stress,
                happiness_score: happy,
            },
        };
    } catch (err: any) {
        if (err?.name === "AbortError") {
            return {
                success: false,
                error: `[${requestUid}] Request timed out. Please try again.`,
            };
        }
        return {
            success: false,
            error: `[${requestUid}] ${err instanceof Error ? err.message : "Authentication failed"}`,
        };
    }
}
