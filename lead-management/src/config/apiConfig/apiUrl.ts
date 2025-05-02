// const base = "http://localhost:5050/api"
const base = "http://15.156.176.234:5050/api"

export const apiUrl = {
    base: base,

    user: `${base}/user`,
    role: `${base}/role`,
    permission: `${base}/permission`,

    login: `${base}/loginUser`,
    currentUser: `${base}/current`,
    register: `${base}/register`,
    logout: `${base}/logout`,
    addlead: `${base}/addlead`
}