const todoList = document.querySelector('.todo-list');
const form = document.querySelector('.form');
const taskInput = document.querySelector('.task-input');
const clearButton = document.querySelector('.clear-button');

const SAVE_LOC = 'task.lists';
const tasks = JSON.parse(localStorage.getItem(SAVE_LOC)) || [];
const save = () => {
  localStorage.setItem(SAVE_LOC, JSON.stringify(tasks));
};

class NewTask {
    constructor(description, index) {
      this.description = description;
      this.completed = false;
      this.index = index;
    }
  }

const removeTodo = (button, listItem) => {
    button.parentElement.remove();
    const ind = tasks.indexOf(listItem);
    tasks.splice(ind, 1);
    for (let i = ind; i < tasks.length; i += 1) {
      tasks[i].index -= 1;
    }
    save();
  };
  
  const clearList = (list) => {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  };

  const render = (tasks) => {
    clearList(todoList);
    tasks.forEach((task) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-item');
      todoList.appendChild(listItem);
  
      const div = document.createElement('div');
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('id', `${task.index}`);
      checkbox.classList.add('task-status');
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', (e) => {
        const ind = tasks.indexOf(task);
        tasks[ind].completed = e.target.checked;
        save();
      });
  
      div.appendChild(checkbox);
      const editInput = document.createElement('input');
      const delBtn = document.createElement('button');
  
      const label = document.createElement('label');
      label.classList.add('task-desc');
      label.textContent = task.description;
      label.setAttribute('for', `${task.index}`);
      div.appendChild(label);
  
      const button = document.createElement('button');
      button.innerHTML = '&#8942;';
      button.classList.add('more-icon');
      button.addEventListener('click', () => {
        button.classList.add('disappear');
        listItem.classList.add('yellow-tag');
        delBtn.classList.remove('disappear');
        label.classList.add('disappear');
        editInput.classList.remove('disappear');
      });
  
      delBtn.innerHTML = '&#128465;';
      delBtn.classList.add('more-icon');
      delBtn.classList.add('del-btn');
      delBtn.classList.add('disappear');
      delBtn.addEventListener('click', () => {
        delBtn.classList.remove('disappear');
        removeTodo(delBtn, task);
      });
  
      editInput.type = 'text';
      editInput.classList.add('edit-input');
      editInput.classList.add('disappear');
      editInput.value = task.description;
  
      editInput.addEventListener('change', (e) => {
        const ind = tasks.indexOf(task);
        tasks[ind].description = e.target.value;
  
        editInput.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            save();
            window.location.reload();
          }
        });
  
        document.addEventListener('click', (e) => {
          const desc = Array.from(listItem.querySelectorAll('*'));
          if (!desc.includes(e.target)) {
            save();
            window.location.reload();
          }
        });
      });
  
      listItem.appendChild(div);
      listItem.appendChild(editInput);
      listItem.appendChild(button);
      listItem.appendChild(delBtn);
    });
  };
  
  const saveRender = () => {
    save();
    render(tasks);
  };




form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskDesc = taskInput.value;
  const index = tasks.length;
  if (taskDesc == null || taskDesc === '') return;
  const createTask = new NewTask(taskDesc, index);
  tasks.push(createTask);
  taskInput.value = null;

  saveRender();
});


clearButton.addEventListener('click', () => {
  const newlist = tasks.filter((element) => element.completed === true);
  newlist.forEach((element) => {
    if (tasks.includes(element)) {
      tasks.splice(tasks.indexOf(element), 1);
    }
  });
  let i = 1;
  tasks.forEach((element) => {
    element.index = i;
    i += 1;
  });
  todoList.innerHTML = '';
  for (let i = 1; i <= tasks.length; i += 1) {
    tasks.forEach((listItem) => {
      if (listItem.index === i) {
        save();
      }
    });
  }
  render(tasks);
});
render(tasks);