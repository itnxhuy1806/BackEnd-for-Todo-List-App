function getCookie(cname) {
     let name = cname + "=";
     let decodedCookie = decodeURIComponent(document.cookie);
     let ca = decodedCookie.split(";");
     for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == " ") {
               c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
               return c.substring(name.length, c.length);
          }
     }
     return "";
}
function setCookie(cname, cvalue, exdays = 30) {
     const d = new Date();
     d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
     let expires = "expires=" + d.toUTCString();
     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function isLoggedIn(username) {
     if (username != "")
          return true
     return false
}
async function getNewToken(reToken) {
     let newToken
     await axios({
          method: 'POST',
          url: 'http://localhost:8080/api/token',
          headers: {'Authorization': `Bearer ${reToken}`}
     })
          .then(function (response) {
               let success = response.data.success
               let data = response.data.data
               if (success && data)
                    newToken = data.accessToken
               else
                    location.assign("http://localhost:8080/login");
          })
     return newToken
}

async function checkToken(token, reToken) {
     let newToken
     await axios({
          method: 'get',
          url: 'http://localhost:8080/api/checktoken',
          headers: {'Authorization': `Bearer ${token}`}
     })
          .then(function (response) {
               newToken = token
          })
          .catch(function (error) {
               if (error.response.data.data.name == "TokenExpiredError")
                    newToken = getNewToken(reToken)
          })
     return newToken
}

export { getCookie, setCookie, isLoggedIn, checkToken, getNewToken }
