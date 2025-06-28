function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function addUser() {
  const input = document.getElementById("username");
  const name = input.value.trim();
  if (name) {
    const users = getUsers();
    users.push({ name, todos: [] });
    setUsers(users);
    input.value = "";
    displayUsers();
    alert(`User "${name}" created successfully!`);
  } else {
    alert("Please enter a username");
  }
}

function removeUser() {
  let users = getUsers();
  if (users.length > 0) {
    const removedUser = users.pop().name;
    setUsers(users);
    displayUsers();
    alert(`User "${removedUser}" removed!`);
  } else {
    alert("No users to remove");
  }
}

function clearUsers() {
  localStorage.removeItem("users");
  displayUsers();
  alert("All users cleared!");
}

function displayUsers() {
  const users = getUsers();
  const list = document.getElementById("userList");
  list.innerHTML = "";

  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
                    <span>${user.name}</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${index})">
                        Delete
                    </button>
                `;
    list.appendChild(li);
  });
}

function deleteUser(index) {
  const users = getUsers();
  const deletedUser = users[index].name;
  users.splice(index, 1);
  setUsers(users);
  displayUsers();
  alert(`User "${deletedUser}" deleted!`);
}
window.onload = displayUsers;
