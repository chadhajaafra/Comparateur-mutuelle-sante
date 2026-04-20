import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 > Date.now()) {
            return {
                id: decoded.sub,
                email: decoded.email,
                firstName: decoded.firstName,
                role:
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    decoded.role,
            };
        } else {
            localStorage.clear();
            return null;
        }
    } catch {
        localStorage.clear();
        return null;
    }
}