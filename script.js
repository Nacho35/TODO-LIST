// Eventos
document.querySelector(".input-button").addEventListener("click", addTask);

window.onload = loadTasks;

document.addEventListener("DOMContentLoaded", () => {
	const list = document.getElementById("list");

	const observer = new MutationObserver(() => {
		document.querySelectorAll(".edit-button").forEach((button) => {
			button.addEventListener("click", () => editTask(button));
		});
		document.querySelectorAll(".delete-button").forEach((button) => {
			button.addEventListener("click", () => deleteTask(button));
		});
	});

	observer.observe(list, {
		childList: true,
		subtree: true,
	});

	document.querySelectorAll(".edit-button").forEach((button) => {
		button.addEventListener("click", () => editTask(button));
	});
	document.querySelectorAll(".delete-button").forEach((button) => {
		button.addEventListener("click", () => deleteTask(button));
	});

	document
		.querySelector(".clear-button")
		.addEventListener("click", clearTaskList);
});

// Funciones

// Mostrar toast
const toastContainer = document.getElementById("toast-container");
function showToast(type, message) {
	// Comprueba si ya hay un toast visible
	if (toastContainer.children.length > 0) {
		// Espera hasta que desaparezca el toast actual
		setTimeout(() => {
			showToast(type, message);
		}, 3000);
	} else {
		// Crea el nuevo toast
		const toast = document.createElement("div");
		toast.className = `toast ${type}`;
		toast.innerHTML = message;
		toastContainer.appendChild(toast);

		// Oculta el toast después de 3 segundos
		setTimeout(() => {
			toast.classList.add("hide");
			setTimeout(() => {
				toast.remove();
			}, 500);
		}, 3000);
	}
}

// Cargar tareas
function loadTasks() {
	const list = document.getElementById("list");
	const clearButton = document.getElementById("clear-button");
	const storedTasks = JSON.parse(localStorage.getItem("tasks"));

	if (storedTasks) {
		storedTasks.forEach((task, index) => {
			const li = document.createElement("li");
			const taskText = document.createElement("span");
			taskText.className = "task-text";
			taskText.textContent = task;

			// Verificar si la tarea está completada
			const completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
			if (completedTasks && completedTasks.includes(index)) {
				taskText.classList.add("completed");
			}

			li.appendChild(taskText);
			li.innerHTML += `
        <button class="edit-button">Edit</button>
        <button class="delete-button">Del</button>
      `;
			list.appendChild(li);
			li.addEventListener("click", (event) => {
				if (
					event.target.tagName !== "BUTTON" &&
					event.target.tagName !== "INPUT"
				) {
					completeTask(li);
				}
			});
		});

		// Mostrar botón "Clear" si hay tareas en la lista
		if (list.children.length > 0) {
			clearButton.style.display = "block";
		} else {
			clearButton.style.display = "none";
		}
	} else {
		clearButton.style.display = "none";
	}
}

// Agregar tarea
function addTask() {
	const inputTask = document.getElementById("inputTask");
	const list = document.getElementById("list");
	const clearButton = document.getElementById("clear-button");

	if (inputTask.value.trim() !== "") {
		const li = document.createElement("li");
		li.innerHTML = `
      <span class="task-text">${inputTask.value}</span>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Del</button>
    `;
		list.appendChild(li);
		li.addEventListener("click", (event) => {
			if (
				event.target.tagName !== "BUTTON" &&
				event.target.tagName !== "INPUT"
			) {
				completeTask(li);
			}
		});
		inputTask.value = "";
		saveTasksToLocalStorage();
		showToast("info", "Task successfully added");

		// Mostrar botón "Clear" si hay tareas en la lista
		if (list.children.length > 0) {
			clearButton.style.display = "block";
		}
	} else {
		showToast("error", "Please enter a task");
		clearButton.style.display = "none";
	}
}

// Al iniciar la aplicación, ocultar botón "Clear"
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("clear-button").style.display = "none";

	// Al iniciar la aplicación, verificar tareas y mostrar/ocultar botón "Clear"
	document.addEventListener("DOMContentLoaded", function () {
		const list = document.getElementById("list");
		const clearButton = document.getElementById("clear-button");

		// Verificar si hay tareas en la lista al cargar la página
		if (list.children.length > 0) {
			clearButton.style.display = "block";
		} else {
			clearButton.style.display = "none";
		}
	});
});

// Eliminar tarea
function deleteTask(button) {
	const task = button.parentElement;
	const completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
	const tasks = JSON.parse(localStorage.getItem("tasks"));

	if (task.parentNode !== null) {
		const index = Array.prototype.indexOf.call(task.parentNode.children, task);

		if (completedTasks && completedTasks.includes(index)) {
			const newIndex = completedTasks.indexOf(index);
			if (newIndex !== -1) {
				completedTasks.splice(newIndex, 1);
				localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
			}
		}

		tasks.splice(index, 1);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	task.remove();
	updateTasksInLocalStorage();
	showToast("info", "Task successfully deleted");

	// Mostrar botón "Clear" si hay tareas en la lista
	const list = document.getElementById("list");
	const clearButton = document.getElementById("clear-button");
	if (list.children.length > 0) {
		clearButton.style.display = "block";
	} else {
		clearButton.style.display = "none";
	}
}

// Editar tarea
function editTask(button) {
	const task = button.parentElement;
	const textContent = task.querySelector(".task-text");
	const editInput = document.createElement("input");
	editInput.type = "text";
	editInput.value = textContent.textContent;
	task.innerHTML = "";
	task.appendChild(editInput);

	const buttonContainer = document.createElement("div");
	buttonContainer.className = "button-container";

	const saveButton = document.createElement("button");
	saveButton.textContent = "Save";
	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";

	saveButton.onclick = function () {
		const newText = editInput.value;
		if (newText.trim() !== "") {
			task.innerHTML = `
        <span class="task-text">${newText}</span>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Del</button>
      `;
			saveTasksToLocalStorage();
			showToast("success", "Task successfully edited");
		} else {
			showToast("error", "Please enter a task");
		}
	};

	cancelButton.onclick = function () {
		task.innerHTML = `
      <span class="task-text">${textContent.textContent}</span>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Del</button>
    `;
	};

	buttonContainer.appendChild(saveButton);
	buttonContainer.appendChild(cancelButton);
	task.appendChild(buttonContainer);
}

// Marcar como completada
function completeTask(task) {
	const textContent = task.querySelector(".task-text");
	const index = Array.prototype.indexOf.call(task.parentNode.children, task);

	if (!textContent.classList.contains("completed")) {
		textContent.classList.add("completed");
		const completedTasks =
			JSON.parse(localStorage.getItem("completedTasks")) || [];
		completedTasks.push(index);
		localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
		showToast("info", "Task marked as completed");
	} else {
		textContent.classList.remove("completed");
		const completedTasks = JSON.parse(localStorage.getItem("completedTasks"));
		const newIndex = completedTasks.indexOf(index);
		if (newIndex !== -1) {
			completedTasks.splice(newIndex, 1);
		}
		localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
		showToast("warning", "Task unmarked as completed");
	}
	updateTasksInLocalStorage();
}

// Vaciar lista de tareas
function clearTaskList() {
	const list = document.getElementById("list");
	list.innerHTML = "";
	localStorage.removeItem("tasks");
	localStorage.removeItem("completedTasks");
	showToast("warning", "Task list emptied");
}

// Guardar tareas en localStorage
function saveTasksToLocalStorage() {
	const list = document.getElementById("list");
	const tasks = Array.from(list.children).map((task) => {
		const input = task.querySelector("input");
		return input ? input.value : task.querySelector(".task-text").textContent;
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Actualizar tareas en localStorage
function updateTasksInLocalStorage() {
	saveTasksToLocalStorage();
}
