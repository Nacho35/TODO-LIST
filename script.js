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

	document.querySelectorAll("#list li").forEach((li) => {
		li.addEventListener("click", (event) => {
			if (
				event.target.tagName !== "BUTTON" &&
				event.target.tagName !== "INPUT"
			) {
				completeTask(li);
			}
		});
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
	const storedTasks = JSON.parse(localStorage.getItem("tasks"));
	if (storedTasks) {
		storedTasks.forEach((task) => {
			const li = document.createElement("li");
			li.innerHTML = `
        <span class="task-text">${task}</span>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Eliminar</button>
      `;
			list.appendChild(li);
		});
	}
}

// Agregar tarea
function addTask() {
	const inputTask = document.getElementById("inputTask");
	const list = document.getElementById("list");
	if (inputTask.value.trim() !== "") {
		const li = document.createElement("li");
		li.innerHTML = `
      <span class="task-text">${inputTask.value}</span>
      <button class="edit-button">Editar</button>
      <button class="delete-button">Eliminar</button>
    `;
		list.appendChild(li);
		inputTask.value = "";
		saveTasksToLocalStorage();
		showToast("info", "Tarea agregada con éxito");
	} else {
		showToast("error", "Por favor, ingresa una tarea");
	}
}

// Eliminar tarea
function deleteTask(button) {
	button.parentElement.remove();
	updateTasksInLocalStorage();
	showToast("info", "Tarea eliminada con éxito");
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
	const saveButton = document.createElement("button");
	saveButton.textContent = "Guardar";
	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancelar";

	saveButton.onclick = function () {
		const newText = editInput.value;
		if (newText.trim() !== "") {
			task.innerHTML = `
        <span class="task-text">${newText}</span>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Eliminar</button>
      `;
			saveTasksToLocalStorage();
			showToast("success", "Tarea editada con éxito");
		} else {
			showToast("error", "Por favor, ingresa una tarea");
		}
	};

	cancelButton.onclick = function () {
		task.innerHTML = `
      <span class="task-text">${textContent.textContent}</span>
      <button class="edit-button">Editar</button>
      <button class="delete-button">Eliminar</button>
    `;
	};

	task.appendChild(saveButton);
	task.appendChild(cancelButton);
}

// Marcar como completada
function completeTask(task) {
	const textContent = task.querySelector(".task-text");
	if (!textContent.classList.contains("completed")) {
		textContent.classList.add("completed");
		updateTasksInLocalStorage();
		showToast("info", "Tarea marcada como completada");
	} else {
		textContent.classList.remove("completed");
		updateTasksInLocalStorage();
		showToast("warning", "Tarea desmarcada como completada");
	}
}

// Vaciar lista de tareas
function clearTaskList() {
	const list = document.getElementById("list");
	list.innerHTML = "";
	localStorage.removeItem("tasks");
	showToast("warning", "Lista de tareas vaciada");
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
