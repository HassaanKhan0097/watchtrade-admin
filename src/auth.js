class Auth {
    getToken() {
        return localStorage.getItem("accessToken")
    }

    login(accessToken, cb) {
        localStorage.setItem("accessToken", accessToken)
        cb();
    }

    logout() {
        localStorage.removeItem("accessToken")
    }

    isAuthenticated() {
        return localStorage.getItem("accessToken")!=undefined ;
    }
}

export default new Auth();