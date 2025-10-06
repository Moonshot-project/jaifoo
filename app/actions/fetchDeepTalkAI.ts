"use server";

export interface ReflectionMessage {
    header: string;
    messages: string;
    inputGuide: string;
    options: {
        id: string;
        label: string;
        icon: string;
    };
    userInput: string | null;
}

export interface DeepTalkRequest {
    reflectionMessages: ReflectionMessage[];
}

export interface DeepTalkResponseData {
    header: string;
    messages: string;
    inputGuide: string;
    options: {
        id: string;
        label: string;
        icon: string;
    };
    userInput: string | null;
    image_file?: string;
}

export interface DeepTalkResponse {
    code: number;
    status: string;
    success: boolean;
    message: string;
    requestId: string;
    timestamp: string;
    data: DeepTalkResponseData;
    errors?: any;
    warnings?: any;
    debug?: {
        processingTime: string;
        serverInstance: string;
    };
}

export async function fetchDeepTalkAI(
    payload: DeepTalkRequest,
    token: string
): Promise<DeepTalkResponse> {
    const API_URL = `${process.env.BACKEND_API_SERVER}/api/model/deep-talk/`;
    const TIMEOUT = Number(process.env.MAXIMUM_API_TIMEOUT) || 300000;

    if (!token) {
        throw new Error("Authentication error: Missing JWT token");
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const isJson = res.headers
            .get("content-type")
            ?.includes("application/json");
        const data = isJson ? await res.json() : { message: await res.text() };

        if (!res.ok) {
            throw new Error(
                data?.message || data?.error || `Request failed (${res.status})`
            );
        }

        return data as DeepTalkResponse;
    } catch (err: any) {
        if (err?.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
        }
        throw new Error(
            err instanceof Error ? err.message : "DeepTalk fetch failed"
        );
    }
}
