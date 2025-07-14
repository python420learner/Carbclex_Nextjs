// utils/getSessionId.js
export function getSessionId() {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'SESSION') return value;
    }
    return null;
}
