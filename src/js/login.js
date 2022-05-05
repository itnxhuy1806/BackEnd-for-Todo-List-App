import { setCookie, getCookie, checkToken, getNewToken } from "./ultis.js"

async function logout() {
    let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
    axios({
        method: "POST",
        url: 'http://localhost:8080/api/user/logout',
        headers: {'Authorization': `Bearer ${token}`}
    })
        .then(function (response) {
            let success = response.data.success
            if (success) {
                setCookie("username", "",-1)
                setCookie("accessToken", "",-1)
                setCookie("refreshToken","",-1)
            }
        })
}

logout()

$("#login").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();
    axios.post('http://localhost:8080/api/user/login', { username, password })
        .then(function (response) {
            let success = response.data.success
            let data = response.data.data
            if (success) {
                setCookie("username", username)
                setCookie("accessToken", data.accessToken)
                setCookie("refreshToken", data.refreshToken)
                location.assign("./");
            }
        })
})