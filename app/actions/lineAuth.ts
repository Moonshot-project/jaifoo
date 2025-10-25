"use server";

interface LineAuthPayload {
    code: string;
}

interface LineAuthResponse {
    success: boolean;
    data?: {
        email: string;
        user_id: string;
        access_token: string;
    };
    error?: string;
}

export async function authenticateWithLine(
    code: string
): Promise<LineAuthResponse> {
    const API_URL = `${process.env.BACKEND_API_SERVER}/api/user/auth/line/`;
    const CLIENT_NAME = process.env.DEMO_USER_NAME;
    const API_SECRET = process.env.DEMO_WEB_API_TOKEN;

    if (!CLIENT_NAME || !API_SECRET) {
        return {
            success: false,
            error: "Configuration error: Missing API credentials",
        };
    }

    if (!code) {
        return {
            success: false,
            error: "LINE authorization code is missing",
        };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300_000);

        // Generate 16-character random requestUid
        const requestUid = Math.random().toString(36).substring(2, 18);

        console.log("Authenticating with LINE, code:", code);

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${CLIENT_NAME}:${API_SECRET}`)}`,
            requestUid: requestUid,
        };

        const payload: LineAuthPayload = { code };

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
                `LINE authentication failed (${res.status})`;
            return {
                success: false,
                error: `[${requestUid}] ${msg}`,
            };
        }

        const email = data?.email || null;
        const userId = data?.user_id || null;
        const accessToken = data?.access_token || null;

        if (!email || !userId || !accessToken) {
            const msg =
                data?.message ||
                "Incomplete authentication data received from LINE";
            return {
                success: false,
                error: `[${requestUid}] ${msg}`,
            };
        }

        return {
            success: true,
            data: {
                email,
                user_id: userId,
                access_token: accessToken,
            },
        };
    } catch (err: any) {
        const requestUid = Math.random().toString(36).substring(2, 18);
        if (err?.name === "AbortError") {
            return {
                success: false,
                error: `[${requestUid}] Request timed out. Please try again.`,
            };
        }
        return {
            success: false,
            error: `[${requestUid}] ${
                err instanceof Error
                    ? err.message
                    : "LINE authentication failed"
            }`,
        };
    }
}

export async function getLineAuthUrl(): Promise<{
    success: boolean;
    url?: string;
    error?: string;
}> {
    const channelId = process.env.LINE_CHANNEL_ID;
    const redirectUri = process.env.LINE_REDIRECT_URI;

    if (!channelId || !redirectUri) {
        return {
            success: false,
            error: "LINE OAuth configuration is missing",
        };
    }

    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: channelId,
        redirect_uri: redirectUri,
        state: state,
        scope: "profile openid email",
    });

    const authUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

    return {
        success: true,
        url: authUrl,
    };
}
