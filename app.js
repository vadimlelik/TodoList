class TodoList {
	constructor() {
		// Основные элементы
		this.todos = JSON.parse(localStorage.getItem('todos')) || []
		this.todoInput = document.getElementById('todoInput')
		this.todoList = document.getElementById('todoList')
		this.addButton = document.getElementById('addTodo')

		// Добавляем базовые обработчики событий
		this.addButton.addEventListener('click', () => this.addTodo())
		this.todoInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.addTodo()
		})

		// Отображаем список при запуске
		this.renderTodos()
	}

	// Сохранение в localStorage
	saveTodos() {
		localStorage.setItem('todos', JSON.stringify(this.todos))
	}

	// Добавление новой задачи
	addTodo() {
		const todoText = this.todoInput.value.trim()
		if (todoText) {
			const todo = {
				id: Date.now(),
				text: todoText,
				completed: false,
			}
			this.todos.push(todo)
			this.saveTodos()
			this.renderTodos()
			this.todoInput.value = ''
		}
	}

	// Удаление задачи
	deleteTodo(id) {
		this.todos = this.todos.filter((todo) => todo.id !== id)
		this.saveTodos()
		this.renderTodos()
	}

	// Переключение статуса задачи
	toggleTodo(id) {
		this.todos = this.todos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, completed: !todo.completed }
			}
			return todo
		})
		this.saveTodos()
		this.renderTodos()
	}

	// Отображение задач
	renderTodos() {
		this.todoList.innerHTML = ''

		this.todos.forEach((todo) => {
			const li = document.createElement('li')
			li.className = `todo-item ${todo.completed ? 'completed' : ''}`

			// Чекбокс
			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = todo.completed
			checkbox.addEventListener('change', () => this.toggleTodo(todo.id))

			// Текст задачи
			const span = document.createElement('span')
			span.textContent = todo.text

			// Кнопка удаления
			const deleteButton = document.createElement('button')
			deleteButton.textContent = 'Удалить'
			deleteButton.className = 'delete-btn'
			deleteButton.addEventListener('click', () => this.deleteTodo(todo.id))

			// Собираем элемент
			li.appendChild(checkbox)
			li.appendChild(span)
			li.appendChild(deleteButton)
			this.todoList.appendChild(li)
		})
	}
}

// Инициализация приложения
const todoList = new TodoList()
