import { setCookie, getCookie } from "./ultis.js"

$("#register").click(function () {
     const username = $("#username").val();
     const password = $("#password").val();
     const email = $("#email").val();
     const repassword = $("#repassword").val();
     if (password == repassword) {
          axios.post('http://localhost:8080/api/user', { email, username, password })
               .then(function (response) {
                    const success = response.data.success
                    const data = response.data.data
                    if (success) {
                         setCookie("username", username)
                         setCookie("accessToken", data.accessToken, 1)
                         setCookie("refreshToken", data.refreshToken, 1)
                         location.assign("./");
                    }
               })
     }
     else
          alert("Repassword ERR")

})