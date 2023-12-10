window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  const nameInput = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-to-do-form");
  const userName = localStorage.getItem("userName") || "";
  nameInput.value = userName;
  nameInput.addEventListener("change", (event) => {
    localStorage.setItem("userName", event.target.value);
  });

  newTodoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const todo = {
      content: event.target.elements.content.value,
      category: event.target.elements.category.value,
      done: false,
      dateCreated: new Date().getTime(),
    };
    if (todo.content === "") {
      alert("Enter a to-do item!");
      return;
    }
    if (todo.category === "") {
      alert("Select a category!");
      return;
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    event.target.reset();

    showToDoList();
  });
  showToDoList();
});

const showToDoList = () => {
  const todoList = document.querySelector("#to-do-list");
  todoList.innerHTML = "";
  todos.sort((a, b) => b.dateCreated - a.dateCreated);
  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("to-do-item");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const content = document.createElement("div");
    const actions = document.createElement("div");
    const edit = document.createElement("button");
    const deleteBtn = document.createElement("button");
    input.type = "checkbox";
    input.setAttribute("autocomplete", "off");
    input.checked = todo.done;
    span.classList.add("bubble");
    if (todo.category == "personal") {
      span.classList.add("personal");
    } else {
      span.classList.add("business");
    }

    content.classList.add("to-do-content");
    actions.classList.add("actions");
    edit.classList.add("edit");
    deleteBtn.classList.add("delete");

    content.innerHTML = `<input type="text" value='${todo.content}' readonly />`;
    edit.innerHTML = "Edit";
    deleteBtn.innerHTML = "Delete";
    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteBtn);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);
    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add("done");
    }
    input.addEventListener("click", (e) => {
      todo.done = e.target.checked;
      localStorage.setItem("todos", JSON.stringify(todos));
      if (todo.done) {
        todoItem.classList.add("done");
      } else {
        todoItem.classList.remove("done");
      }
    });
    edit.addEventListener("click", (e) => {
      const input = content.querySelector("input");
      input.removeAttribute("readonly");
      edit.innerHTML = "Save";
      todoItem.classList.remove("done");
      input.focus();
      edit.addEventListener("click", (e) => {
        if (input.value === "") {
          alert("Todo item cannot be empty");
          return;
        } else {
          input.setAttribute("readonly", true);
          edit.innerHTML = "Edit";
          edit.style.opacity = "1";
          todo.content = input.value;
          localStorage.setItem("todos", JSON.stringify(todos));
          showToDoList();
        }
      });
    });
    deleteBtn.addEventListener("click", (e) => {
      const deleteModal = document.querySelector(".modal-overlay");
      deleteModal.classList.add("open-modal");
      document.body.style.overflow = "hidden";
      const confirmDeleteItem = document.querySelector("#yes");
      const rejectDeleteItem = document.querySelector("#no");
      confirmDeleteItem.addEventListener("click", () => {
        todos = todos.filter((t) => t != todo);
        localStorage.setItem("todos", JSON.stringify(todos));
        document.body.style.overflow = "";
        deleteModal.classList.remove("open-modal");
        showToDoList();
      });
      rejectDeleteItem.addEventListener("click", () => {
        deleteModal.classList.remove("open-modal");
        document.body.style.overflow = "";
        showToDoList();
      });
    });
  });
};
