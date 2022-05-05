import { setCookie, getCookie, isLoggedIn, getNewToken, checkToken } from "./ultis.js"
const username = getCookie('username')
const TodoListId = $("#idTodo").text().trim()

function isChecked(ele) {
     $(ele).find(".form-check-label").css("text-decoration", "line-through")
     $(ele).removeClass("bg-primary");
     $(ele).addClass("bg-danger");
     $(ele).find(".form-check-input").removeClass("bg-primary")
     $(ele).find(".form-check-input").addClass("bg-danger")
}
function unchecked(ele) {
     $(ele).find(".form-check-label").css("text-decoration", "none")
     $(ele).addClass("bg-primary");
     $(ele).removeClass("bg-danger");
     $(ele).find(".form-check-input").removeClass("bg-danger")
}

function addEventCreateTask() {
     $(".inpNameTDL").on("keypress", function (e) {
          if (e.keyCode == "13") {
               const content = $(".inpNameTDL").val().trim()
               createTask(content, TodoListId)
          }
     })
}
function addEventRemoveTask(data) {
     let task = $(`[idTask='${data.id}']`)
     task.find('.rm').click(async function () {
          let accessToken = getCookie("accessToken")
          let refreshToken = getCookie("refreshToken")
          let token = await checkToken(accessToken, refreshToken)
          if (token)
               setCookie("accessToken", token)
          axios({
               method: 'post',
               url: 'http://localhost:8080/api/task/delete',
               data,
               headers: { 'Authorization': `Bearer ${token}` }
          })
               .then(function (response) {
                    let success = response.data.success
                    if (success)
                         task.remove()
               })
     })
}
function addEventChangeTask(data) {
     let task = $(`[idTask='${data.id}']`)
     $(task).change(async function () {
          if (task.find("input[type='checkbox']")[0].checked)
               data.checked = true
          else
               data.checked = false
          let accessToken = getCookie("accessToken")
          let refreshToken = getCookie("refreshToken")
          let token = await checkToken(accessToken, refreshToken)
          if (token)
               setCookie("accessToken", token)
          axios({
               method: 'post',
               url: 'http://localhost:8080/api/task/update',
               data,
               headers: { 'Authorization': `Bearer ${token}` }
          })
               .then(function (response) {
                    let success = response.data.success
                    let data = response.data.data
                    if (success && data)
                         if (data.checked)
                              isChecked(task)
                         else
                              unchecked(task)
               })
     })
}
function getTodoHtml(data) {
     let todo = `<p class="text-center text-primary fs-4">${data.name}<p><input id="inpContent" type="text" class="inpNameTDL form-control fs-5 bg-primary bg-opacity-10" placeholder="Add Task" value="" /></p>`
     todo = todo + `<ul class="list-group fs-5"> </ul>`
     todo = `<div idTodo="${data.id}" class="border boder-primary mb-3">${todo}</div>`
     return $.parseHTML(todo)
}
function getTaskHtml(data) {
     if (data.checked)
          data.checked = "checked"
     else
          data.checked = ""
     let task = `<input class="form-check-input" ${data.checked} type="checkbox">`
     task = task + `<label class="form-check-label ms-2" style="overflow:hidden; max-width:750px; white-space: nowrap;"> ${data.content} </label>`
     task = task + `<div class="mx-auto "></div><button class="btn btn-outline-primary rm"><i class="bi bi-trash "></i></button>`
     task = `<div class="nav">${task}</div>`;
     task = $.parseHTML(`<li idTask="${data.id}" class="list-group-item bg-primary bg-opacity-10 bg-primary task fs-5" >${task}</li>`)
     return task
}
function addTask(data) {
     $(`.list-group`).append(getTaskHtml(data))
     addEventRemoveTask(data)
     addEventChangeTask(data)
}
async function loadTodo(id) {
     let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
     axios({
          method: 'post',
          url: 'http://localhost:8080/api/todo/detail',
          data: { id },
          headers: { 'Authorization': `Bearer ${token}` }
     })
          .then(function (response) {
               let success = response.data.success
               let data = response.data.data
               if (success && data) {
                    let { todo, task } = data
                    $("#Todo").append(getTodoHtml(todo))
                    task.map(function (ele) {
                         addTask(ele)
                         let task = $(`[idTask='${ele.id}']`)
                         if (ele.checked)
                              isChecked(task)
                         else
                              unchecked(task)
                    })
                    addEventCreateTask()
               }
          })
          .catch(function (error) {
               loadTodo(id)
          })
}
async function createTask(content, TodoListId) {
     let accessToken = getCookie("accessToken")
     let refreshToken = getCookie("refreshToken")
     let token = await checkToken(accessToken, refreshToken)
     if (token)
          setCookie("accessToken", token)
     axios({
          method: 'post',
          url: 'http://localhost:8080/api/task/create',
          data: { content, TodoListId },
          headers: { 'Authorization': `Bearer ${token}` }
     })
          .then(function (response) {
               let success = response.data.success
               let data = response.data.data
               if (success && data)
                    addTask(data)
          })

}

if (isLoggedIn()) {
     $("#name").text(`${username}`)
     $("#btn-login").text(`Logout`)
     loadTodo(TodoListId)
}