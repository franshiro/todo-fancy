$(document).ready(function () {
    loadTodo()
    readyFn()
    $('[data-toggle="tooltip"]').tooltip()
});

function readyFn(){
    hideButton()
}


function hideButton(){
   let token = localStorage.getItem('token')
    if(token){
        $('#newTodo').append(`
            <button class="add-new-todo" data-toggle="modal" data-target="#addTodo">
                <i class="fas fa-plus"></i>
                    ADD TO-DO
            </button>
        `)
        $('#buttonSignOutLogin').empty()
        $('#buttonSignOutLogin').append(`
            <button type="button" id="buttonSignOut" class="buttonLogoutLogin" onclick="signOut()">Sign Out</button>
        `)
    }
    else{
        $('#newTodo').empty()
        $('#buttonSignOutLogin').empty()
        $('#buttonSignOutLogin').append(`
        <button type="button" id="buttonLogin" class="buttonLogoutLogin" data-toggle="modal" data-target="#modalLogin">
                    Login
        </button>
        `)
    }
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method : 'POST',
        url : `http://localhost:3000/signin/google`,
        data : {
            googleToken : id_token
        }
    })
    .done(data => {
        localStorage.setItem('token', data.token)
        loadTodo()
        readyFn()
    })
    .fail(err => {
        console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    if(auth2){
        auth.signOut()
        .then(function() {
            localStorage.removeItem('token')
            readyFn()
            loadTodo()
        })
    } else {
        console.log('User signed out.');
        localStorage.removeItem('token')
        readyFn()
        loadTodo()
    }
}

function signin(){
    $.ajax({
        method : 'POST',
        url : `http://localhost:3000/signin`,
        data : {
            email : $('#loginEmail').val(),
            password : $('#loginPassword').val()
        }
    })
    .done(response => {
        if(response.token){
            localStorage.setItem('token', response.token)
            loadTodo()
            readyFn()
        }
    })
    .fail(err => {
        console.log(err)
    })
}

function signup(){
    $.ajax({
        method : 'POST',
        url : `http://localhost:3000/signup`,
        data : {
            email : $('#registerEmail').val(),
            password : document.getElementById('registerPassword').value,
            name : $('#registerName').val()
        }
    })
    .done(response => {
        
    })
    .fail(err => {
        $('#isiWeb').empty()
        $('#isiWeb').append(`
            <div class="alert alert-danger" role="alert" id="emailtaken">
                  Email already used, try another email      
            </div>
        `)
    })
   
}

function loadTodo(){
    $.ajax({
        method : 'GET',
        url : `http://localhost:3000/users/showall`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(response => {
        $('#isiWeb').empty()
        response.todo.forEach(list => {
            let finish = ""
            if(list.isFinish === true){
                finish = "alert alert-success"
            }
            else{
                finish = "alert alert-dark"
            }
            $('#isiWeb').append(`
                 <div class="${finish}" role="alert" align="center" onclick="getInfo('${list._id}')" data-toggle="modal" data-target="#detailTodo">
                     ${list.title}
                </div> 
            `)
        })
    })
    .fail(err => {
        console.log(err)
        $('#isiWeb').empty()
        $('#isiWeb').append(`
            <div class="alert alert-danger" role="alert" id="emailtaken">
                  Pleace Login First    
            </div>
        `)
    })
}

function addTodo(){
    $.ajax({
        method : 'POST',
        url : `http://localhost:3000/todos/add`,
        headers : {
            token : localStorage.getItem('token')
        },
        data : {
            title : $('#todoTitle').val(),
            description : $('#todoDescription').val(),
            dueDate : $('#datepicker').val()
        }
    })
    .done(response => {
        loadTodo()
    })
    .fail(err => {
        console.log(err)
       
    })
}

function getInfo(id){
    $.ajax({
        method : 'GET',
        url : `http://localhost:3000/todos/showOne/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(response => {
        // console.log(response)
        let date = response.todo.dueDate
        let newDate =""
        for(let i = 0; i < date.length; i++){
            if(date[i] !== "T"){
                newDate += date[i]
            }
            else{
                break;
            }
        }
        let value = 'Finish'
        if(response.todo.isFinish === true){
            value = 'Finish'
        }
        else{
            value = 'Not Yet'
        }
        // console.log(newDate)
        $('#updateTodo').empty()
        $('#updateTodo').append(`
        <form class="seminor-login-form">
        <div class="form-group">
            <input type="name" id="detailTitle" class="form-control" value="${response.todo.title}" required autocomplete="off">
            <label class="form-control-placeholder" for="name">Title</label>
        </div>
        <div class="form-group">
            <input type="name" id="detailDescription" class="form-control" value="${response.todo.description}"  required autocomplete="off">
            <label class="form-control-placeholder" for="name">Description</label>
        </div>
        <div class="form-group">
            Due date : 
            <input type="date" " id="detailDate" width="276" value="${newDate}"/>
        </div>    
        <div class="form-group">
        <label for="exampleFormControlSelect1">isFinish : ${value}</label>
        <div class="actionButton">
            <div class="btn-check-log">
                <button type="submit" class="btn-add-todo" onclick="updateTodo('${response.todo._id}')"  data-toggle="tooltip" title="Update Todo" data-dismiss="modal">
                    <span style="font-size:25px">
                        <i class="fas fa-wrench"></i>
                    </span>
                </button>
                <button type="submit" class="btn-add-todo" onclick="finishTodo('${response.todo._id}')" data-toggle="tooltip" title="Mark as Finish" data-dismiss="modal"> 
                    <span style="font-size:25px">
                        <i class="fas fa-calendar-check"></i>
                    </span>
                </button>
                <button type="submit" class="btn-add-todo" onclick="unfinishTodo('${response.todo._id}')" data-toggle="tooltip" title="Mark as Unfinish" data-dismiss="modal">
                    <span style="font-size:25px">
                        <i class="fas fa-undo-alt"></i>
                    </span>
                </button>
                <button type="submit" class="btn-add-todo" onclick="deleteTodo('${response.todo._id}')" data-toggle="tooltip" title="Delete Todo" data-dismiss="modal">
                    <span style="font-size:25px">
                        <i class="fas fa-trash-alt"></i>
                    </span>
                </button>
            </div>
        </div>
    </form>
        `)
    })
    .fail(err => {
        console.log(err)
       
    })
}

function updateTodo(id){
    $.ajax({
        method : 'PUT',
        url : `http://localhost:3000/todos/update/${id}`,
        headers : {
            token : localStorage.getItem('token')
        },
        data : {
            title : $('#detailTitle').val(),
            description : $('#detailDescription').val(),
            dueDate : $('#detailDate').val()
        }
    })
    .done(response => {
        loadTodo()
    })
    .fail(err => {
        console.log(err)
    })
}

function finishTodo(id){
    $.ajax({
        method : 'PATCH',
        url : `http://localhost:3000/todos/setFinish/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(response => {
        loadTodo()
    })
    .fail(err => {
        console.log(err)
    })
}

function unfinishTodo(id){
    $.ajax({
        method : 'PATCH',
        url : `http://localhost:3000/todos/setNotFinishYet/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(response => {
        loadTodo()
    })
    .fail(err => {
        console.log(err)
    })
}

function deleteTodo(id){
    $.ajax({
        method : 'DELETE',
        url : `http://localhost:3000/todos/delete/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
    .done(response => {
        loadTodo()
    })
    .fail(err => {
        console.log(err)
    })
}


