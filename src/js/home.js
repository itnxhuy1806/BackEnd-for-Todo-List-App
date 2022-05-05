import { setCookie, getCookie, isLoggedIn, getNewToken, checkToken } from "./ultis.js"
const username = getCookie('username')

function addEventRemoveTodo(data) {
     $(`p[idTodo='${data.id}']`).find('.rm').click(function () {
          deleteTodo(data)
     })
}

async function deleteTodo(data) {
     let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
     axios({
          method: "post",
          url: 'http://localhost:8080/api/todo/delete',
          data,
          headers: { 'Authorization': `Bearer ${token}` }
     })
          .then(function (response) {
               let success = response.data.success
               if (success)
                    $(`p[idTodo='${data.id}']`).remove()
          })
}
function addTodo(data) {
     let todo = `<button class="btn btn-outline-primary rm"><i class="bi bi-trash "></i></button>`
     todo = $.parseHTML(`<p idTodo="${data.id}"><a class="mx-5 fs-2" href="./todo/${data.id}"> ${data.name}</a>${todo}</p>`)
     $("#ListTodo").append(todo)
     addEventRemoveTodo(data)
}

async function createTodo(name) {
     let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
     axios({
          method: 'post',
          url: 'http://localhost:8080/api/todo/create',
          data: { name },
          headers: { 'Authorization': `Bearer ${token}` }
     })
          .then(function (response) {
               let success = response.data.success
               let data = response.data.data
               if (success && data) {
                    data.name = name
                    addTodo(data)
               }
          })
}

async function loadAllTodoList() {
     let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
     axios({
          method: 'post',
          url: 'http://localhost:8080/api/todo/all',
          headers: { 'Authorization': `Bearer ${token}` }
     })
          .then(function (response) {
               let success = response.data.success
               let data = response.data.data
               if (success && data != [])
                    data.map(function (ele) {
                         addTodo(ele)
                    })
          })
          .catch(function (err) {
               loadAllTodoList()
          })
}
if (isLoggedIn(username)) {
     loadAllTodoList()
     $("#name").text(`${username}`)
     $("#btn-login").text(`Logout`)
     $("#btnAddTDL").click(function () {
          const name = $('#inputNameTDL').val().trim()
          createTodo(name)
     })
}