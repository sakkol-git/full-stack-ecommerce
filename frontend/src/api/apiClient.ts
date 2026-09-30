const BASE_URL = "http://localhost:8080"

export async function apiClient<T>(
    endpoint: string, 
    options?: RequestInit 
): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    },);
    if(!response.ok){
        throw new Error(
            `Request failed: ${response.status} ${response.statusText}`
        )
    }

    if(response.status== 204){
        return {} as T;
    }

    return response.json();

}