let currentUserIndex = -1;
        window.onload = function() {
            loadUserSelect();
        };

        function getUsers() {
            const users = localStorage.getItem("users");
            return users ? JSON.parse(users) : [];
        }

        function loadUserSelect() {
            const users = getUsers();
            const select = document.getElementById("userSelect");
            select.innerHTML = '<option value="">Select a user</option>';
            
            users.forEach((user, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = user.name;
                select.appendChild(option);
            });
        }

        function loadUserTodos() {
            const select = document.getElementById("userSelect");
            currentUserIndex = select.value === "" ? -1 : parseInt(select.value);
            displayTodos();
        }

        function getCurrentUserTodos() {
            if (currentUserIndex === -1) return [];
            const users = getUsers();
            return users[currentUserIndex].todos;
        }

        function saveCurrentUserTodos(todos) {
            if (currentUserIndex === -1) return;
            const users = getUsers();
            users[currentUserIndex].todos = todos;
            localStorage.setItem("users", JSON.stringify(users));
        }

        function addTodo() {
            if (currentUserIndex === -1) {
                alert("Please select a user first");
                return;
            }
            
            const input = document.getElementById("todoInput");
            const text = input.value.trim();
            if (text) {
                const todos = getCurrentUserTodos();
                todos.push({
                    id: Date.now(),
                    text,
                    completed: false
                });
                saveCurrentUserTodos(todos);
                input.value = "";
                displayTodos();
                alert('Task added successfully!');
            } else {
                alert('Please enter a task');
            }
        }

        function toggleTodo(id) {
            const todos = getCurrentUserTodos();
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveCurrentUserTodos(todos);
                displayTodos();
                const status = todo.completed ? 'completed' : 'marked active';
                alert(`Task "${todo.text}" ${status}`);
            }
        }

        function deleteTodo(id) {
            const todos = getCurrentUserTodos();
            const todoIndex = todos.findIndex(t => t.id === id);
            if (todoIndex !== -1) {
                const deletedTask = todos[todoIndex].text;
                todos.splice(todoIndex, 1);
                saveCurrentUserTodos(todos);
                displayTodos();
                alert(`Task "${deletedTask}" deleted!`);
            }
        }

        function displayTodos(filter = 'all') {
            if (currentUserIndex === -1) {
                document.getElementById("todoList").innerHTML = "";
                return;
            }
            
            let todos = getCurrentUserTodos();
            
            if (filter === 'active') {
                todos = todos.filter(todo => !todo.completed);
            } else if (filter === 'completed') {
                todos = todos.filter(todo => todo.completed);
            }
            
            const list = document.getElementById("todoList");
            list.innerHTML = "";
            
            if (todos.length === 0) {
                list.innerHTML = '<li class="list-group-item text-muted">No tasks found</li>';
                return;
            }
            
            todos.forEach(todo => {
                const li = document.createElement("li");
                li.className = `list-group-item d-flex align-items-center ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="form-check-input me-3" ${todo.completed ? 'checked' : ''} 
                           onclick="toggleTodo(${todo.id})">
                    <span class="task-text flex-grow-1">${todo.text}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${todo.id})">
                        Delete
                    </button>
                `;
                list.appendChild(li);
            });
        }

        function filterTodos(filter) {
            displayTodos(filter);
        }