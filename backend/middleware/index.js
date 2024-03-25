document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signup-form').addEventListener('submit', function (event) {
        event.preventDefault();
        signUp();
    });
});

function signUp() {
    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    // Client-side validation
    if (password !== confirm_password) {
        alert("Passwords do not match");
        return;
    }

    // Send data to server using AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../backend/controller/server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === "success") {
                // alert(response.message);
                localStorage.setItem('token', response.token);
                // Redirect user to login page
                window.location.href = 'login.html';
            } else {
                if (response.message === "Username or email already exists") {
                    document.getElementById('signup-message').classList.remove('hidden');
                } else if (response.message === "Password should be at least 12 characters long") {
                    document.getElementById('password-requirements').classList.remove('hidden');
                } else {
                    alert('Error occurred while signing up: ' + response.message);
                }
            }
        } else {
            alert('Error occurred while signing up');
        }
    };
    xhr.onerror = function () {
        alert('Error occurred while signing up');
    };
    xhr.send(`username=${encodeURIComponent(username)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
}
