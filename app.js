class TodoList {
	constructor() {
		this.todos = JSON.parse(localStorage.getItem('todos')) || []
		this.todoInput = document.getElementById('todoInput')
		this.todoCategory = document.getElementById('todoCategory')
		this.addButton = document.getElementById('addTodo')
		this.todoList = document.getElementById('todoList')
		this.todoCount = document.getElementById('todoCount')
		this.clearCompletedBtn = document.getElementById('clearCompleted')
		this.sortSelect = document.getElementById('sortSelect')
		this.currentFilter = 'all'

		// Add Todo Events
		this.addButton.addEventListener('click', () => this.addTodo())
		this.todoInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.addTodo()
		})

		// Filter Events
		document.querySelectorAll('.filter-btn').forEach((btn) => {
			btn.addEventListener('click', () => {
				document.querySelector('.filter-btn.active').classList.remove('active')
				btn.classList.add('active')
				this.currentFilter = btn.dataset.filter
				this.renderTodos()
			})
		})

		// Clear Completed Event
		this.clearCompletedBtn.addEventListener('click', () =>
			this.clearCompleted()
		)

		// Sort Event
		this.sortSelect.addEventListener('change', () => this.renderTodos())

		this.renderTodos()
	}

	saveTodos() {
		localStorage.setItem('todos', JSON.stringify(this.todos))
		this.updateTodoCount()
	}

	updateTodoCount() {
		const activeCount = this.todos.filter((todo) => !todo.completed).length
		this.todoCount.textContent = `${activeCount} item${
			activeCount !== 1 ? 's' : ''
		} left`
	}

	addTodo() {
		const todoText = this.todoInput.value.trim()
		if (todoText) {
			const todo = {
				id: Date.now(),
				text: todoText,
				completed: false,
				category: this.todoCategory.value,
				createdAt: new Date().toISOString(),
			}

			this.todos.push(todo)
			this.saveTodos()
			this.renderTodos()
			this.todoInput.value = ''
		}
	}

	deleteTodo(id) {
		this.todos = this.todos.filter((todo) => todo.id !== id)
		this.saveTodos()
		this.renderTodos()
	}

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

	editTodo(id, newText) {
		this.todos = this.todos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, text: newText }
			}
			return todo
		})
		this.saveTodos()
		this.renderTodos()
	}

	clearCompleted() {
		this.todos = this.todos.filter((todo) => !todo.completed)
		this.saveTodos()
		this.renderTodos()
	}

	getFilteredAndSortedTodos() {
		let filteredTodos = [...this.todos]

		// Apply filter
		switch (this.currentFilter) {
			case 'active':
				filteredTodos = filteredTodos.filter((todo) => !todo.completed)
				break
			case 'completed':
				filteredTodos = filteredTodos.filter((todo) => todo.completed)
				break
		}

		// Apply sort
		filteredTodos.sort((a, b) => {
			const dateA = new Date(a.createdAt)
			const dateB = new Date(b.createdAt)
			return this.sortSelect.value === 'dateAsc' ? dateA - dateB : dateB - dateA
		})

		return filteredTodos
	}

	renderTodos() {
		this.todoList.innerHTML = ''
		const filteredTodos = this.getFilteredAndSortedTodos()

		filteredTodos.forEach((todo) => {
			const li = document.createElement('li')
			li.className = `todo-item ${todo.completed ? 'completed' : ''}`

			// Checkbox for toggle
			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = todo.completed
			checkbox.addEventListener('change', () => this.toggleTodo(todo.id))

			// Category badge
			const category = document.createElement('span')
			category.className = `todo-category ${todo.category}`
			category.textContent = todo.category

			// Todo text
			const todoText = document.createElement('span')
			todoText.className = 'todo-text'
			todoText.textContent = todo.text

			// Edit button
			const editBtn = document.createElement('button')
			editBtn.className = 'edit-btn'
			editBtn.textContent = 'Edit'
			editBtn.addEventListener('click', () => {
				const isEditing = todoText.contentEditable === 'true'
				if (isEditing) {
					todoText.contentEditable = 'false'
					todoText.classList.remove('editing')
					editBtn.textContent = 'Edit'
					this.editTodo(todo.id, todoText.textContent)
				} else {
					todoText.contentEditable = 'true'
					todoText.classList.add('editing')
					todoText.focus()
					editBtn.textContent = 'Save'
				}
			})

			// Delete button
			const deleteBtn = document.createElement('button')
			deleteBtn.className = 'delete-btn'
			deleteBtn.textContent = 'Delete'
			deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id))

			// Append all elements
			li.appendChild(checkbox)
			li.appendChild(category)
			li.appendChild(todoText)
			li.appendChild(editBtn)
			li.appendChild(deleteBtn)

			this.todoList.appendChild(li)
		})

		this.updateTodoCount()
	}
}

// Initialize TodoList
const todoList = new TodoList()
