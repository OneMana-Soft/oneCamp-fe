export function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function checkAuthCookieExists(): boolean {
    return !!getCookie("Authorization");

}

export function checkRefreshCookieExists(): boolean {
    return !!getCookie("RefreshToken");
}