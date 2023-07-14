document.addEventListener('DOMContentLoaded', function() {
    if (!window.openDatabase) {
      alert('Web SQL Database is not supported in this browser.');
      return;
    }
  
    var db = openDatabase('mydbm', '1.0', 'My Database', 2 * 1024 * 1024);
  
    createTable();
  
    var userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', addUser);
  
    fetchUsers();
  
    function createTable() {
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name, email, city)');
      });
    }
  
    function addUser(event) {
      event.preventDefault();
  
      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var cityInput = document.getElementById('city');
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var city = cityInput.value.trim();
  
      if (name === '' || email === '' || city === '') {
        alert('Please enter a name, email, and city.');
        return;
      }
  
      db.transaction(function(tx) {
        tx.executeSql('INSERT INTO users (name, email, city) VALUES (?, ?, ?)', [name, email, city], function() {
          nameInput.value = '';
          emailInput.value = '';
          cityInput.value = '';
          fetchUsers();
        });
      });
    }
  
    function fetchUsers() {
      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM users', [], function(tx, result) {
          var userList = document.getElementById('userList');
          userList.innerHTML = '';
  
          var rows = result.rows;
          for (var i = 0; i < rows.length; i++) {
            var user = rows.item(i);
            var row = document.createElement('tr');
            row.innerHTML = '<td>' + user.name + '</td>' +
              '<td>' + user.email + '</td>' +
              '<td>' + user.city + '</td>' +
              '<td><button onclick="editUser(' + user.id + ')">Edit</button></td>' +
              '<td><button onclick="deleteUser(' + user.id + ')">Delete</button></td>';
            userList.appendChild(row);
          }
        });
      });
    }
  
    window.editUser = function(id) {
      var newName = prompt('Enter a new name:');
      var newEmail = prompt('Enter a new email:');
      var newCity = prompt('Enter a new city:');
  
      if (newName === null || newName.trim() === '' || newEmail === null || newEmail.trim() === '' || newCity === null || newCity.trim() === '') {
        return; // Cancelled or empty input
      }
  
      db.transaction(function(tx) {
        tx.executeSql('UPDATE users SET name = ?, email = ?, city = ? WHERE id = ?', [newName, newEmail, newCity, id], function() {
          fetchUsers();
        });
      });
    };
  
    window.deleteUser = function(id) {
      db.transaction(function(tx) {
        tx.executeSql('DELETE FROM users WHERE id = ?', [id], function() {
          fetchUsers();
        });
      });
    }
  });
  