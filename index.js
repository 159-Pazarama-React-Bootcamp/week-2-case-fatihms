// DOM tanımlamaları
const todoContainerDOM = document.getElementById("todoContainer");
const inputNameContainerDOM = document.getElementById("inputNameContainer");
const inputNameDOM = document.getElementById("inputName");
const darkModeDOM = document.getElementById("darkMode");
const userNameDOM = document.getElementById("userName");
const backPageButtonDOM = document.getElementById("backPageButton");
const inputTodoDOM = document.getElementById("inputTodo");

// Sayfa açıldığında önceden todo kullanılmış mı kontrol edilir
// Eğer önceden kullanıdı ise kullanıcı tercihleri ekrana yansır
// ve isim isteme alanı gizlenir, todo alanı ekranı yansır
window.onload = function () {
  if (localStorage.getItem("name") === null) {
    inputNameContainerDOM.style.display = "block";
    userNameDOM.innerHTML = "TODO APP";
  } else {
    inputNameContainerDOM.style.display = "none";
    todoContainerDOM.style.display = "block";
    backPageButton.style.display = "block";
    userInfoLoad();
    fetchTodos();
  }
  darkMode();
};

// Kullanıcı bilgileri ekrana taşınır
const userInfoLoad = () => {
  userNameDOM.innerHTML = "Merhaba, " + localStorage.getItem("name");
};

// Dark-Light modu yüklenir
const darkMode = () => {
  darkModeDOM.checked =
    localStorage.getItem("darkmode") === "true" ? true : false;
  if (localStorage.getItem("darkmode") === "true") {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    document.body.style.transition = "all 0.5s";
  } else {
    document.body.style.backgroundColor = "#30475e";
    document.body.style.color = "white";
    document.body.style.transition = "all 0.5s";
  }
};

// Kullanıcıdan isim alındığı sayfaya geri dönülür
const backPage = () => {
  localStorage.removeItem("name");
  window.location.href = "index.html";
};

// dark-light modu listener
darkModeDOM.addEventListener("change", () => {
  if (darkModeDOM.checked === true) {
    localStorage.setItem("darkmode", true);
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    document.body.style.transition = "all 0.5s";
  } else {
    localStorage.setItem("darkmode", false);
    document.body.style.backgroundColor = "#30475e";
    document.body.style.color = "white";
    document.body.style.transition = "all 0.5s";
  }
});

// CRUD işlemleri

// fetch işlemi
async function fetchTodos() {
  const response = await fetch(
    "https://61c378639cfb8f0017a3eb9c.mockapi.io/todos"
  );
  todoList(await response.json());
}

// Todo ekleme
function addTodo() {
  if (inputTodoDOM.value.length > 3) {
    const todoContent = inputTodoDOM.value;
    const todo = {
      content: todoContent,
      isCompleted: false,
    };
    fetch("https://61c378639cfb8f0017a3eb9c.mockapi.io/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then((response) => fetchTodos());
  } else {
    alert("Lütfen üç karakterden fazla bir todo giriniz!");
  }
}

// Todo silme
const deleteTodo = (id) => {
  fetch(`https://61c378639cfb8f0017a3eb9c.mockapi.io/todos/${id}`, {
    method: "DELETE",
  }).then((response) => fetchTodos());
};

// Todo tamamlandı
const completedTodo = (id, checked) => {
  fetch(`https://61c378639cfb8f0017a3eb9c.mockapi.io/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCompleted: !checked,
    }),
  }).then((response) => fetchTodos());
};

// todo içeriği değiştirme
const changeTodo = (id) => {
  let todoContent = document.getElementById(`todoContent${id}`);

  fetch(`https://61c378639cfb8f0017a3eb9c.mockapi.io/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: todoContent.value,
    }),
  }).then((response) => console.log(response));

  let editButton = document.getElementById(`editButton${id}`);
  let saveButton = document.getElementById(`saveButton${id}`);
  saveButton.style.display = "none";
  editButton.style.display = "block";
  todoContent.setAttribute("readonly", "readonly");
};

// todo görüntülenir
// kullanıcı tercihleri yüklenir
// todo'lar listenenir
const todoDisplay = () => {
  if (inputNameDOM.value !== "") {
    inputNameContainerDOM.style.display = "none";
    todoContainerDOM.style.display = "block";
    backPageButton.style.display = "block";
    localStorage.setItem("name", inputNameDOM.value);
    userInfoLoad();
    fetchTodos();
  } else {
    alert("Lütfen isminizi giriniz!");
  }
};

// edit butonu gizlenir, kaydet butonu gelir
// input edit odaklanır
const hideEditButton = (id) => {
  let editButton = document.getElementById(`editButton${id}`);
  let saveButton = document.getElementById(`saveButton${id}`);
  editButton.style.display = "none";
  saveButton.style.display = "block";
  let todoContent = document.getElementById(`todoContent${id}`);
  todoContent.removeAttribute("readonly");
  todoContent.focus();
  const length = todoContent.value.length;
  todoContent.setSelectionRange(length, length);
};

// todo'lar listenenir
const todoList = (todos) => {
  todos.length < 6
    ? (todoContainerDOM.childNodes[3].style.height = "auto")
    : (todoContainerDOM.childNodes[3].style.height = "400px");
  let todoItem = "";
  todos.forEach((todo) => {
    todoItem += `
        <div class="todoItem">
            <div class="todoItem-left"> 
                <div class="todoItem-complete"><input type="checkbox" onclick="completedTodo(${
                  todo.id
                }, ${todo.isCompleted});" ${
      todo.isCompleted ? "checked" : ""
    }></div>
            <div class="todoItem-name">
              <input 
                type="text" 
                class="todoItem-text" 
                id="todoContent${todo.id}"
                style="${
                  todo.isCompleted
                    ? "text-decoration:line-through"
                    : "text-decoration:none"
                }"
                value="${todo.content}"
                readonly>
            </div>
            </div> 
            <div class="todoItem-control">
                <button class="todoItem-control-button save" id="saveButton${
                  todo.id
                }" onclick="changeTodo(${todo.id})">
                    <i class="fa fa-save fa-2x"></i>
                </button>
                <button class="todoItem-control-button edit" id="editButton${
                  todo.id
                }" onclick="hideEditButton(${todo.id})">
                    <i class="fa fa-edit fa-2x"></i>
                </button>
                <button class="todoItem-control-button delete" onclick="deleteTodo(${
                  todo.id
                })">
                    <i class="fa fa-trash fa-2x"></i>
                </button>
            </div>
        </div>
    `;
  });
  todoContainerDOM.childNodes[3].innerHTML = todoItem;
};
