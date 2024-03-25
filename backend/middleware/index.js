document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("signup-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      signUp();
    });
});

function signUp() {
  const username = document.getElementById("username").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;

  // Client-side validation
  if (password !== confirm_password) {
    alert("Passwords do not match");
    return;
  }

  // Send data to server using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../backend/controller/server.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === "success") {
        // alert(response.message);
        localStorage.setItem("token", response.token);
        // Redirect user to login page
        window.location.href = "index.html";
      } else {
        if (response.message === "Username or email already exists") {
          document.getElementById("signup-message").classList.remove("hidden");
        } else if (
          response.message === "Password should be at least 12 characters long"
        ) {
          document
            .getElementById("password-requirements")
            .classList.remove("hidden");
        } else {
          alert("Error occurred while signing up: " + response.message);
        }
      }
    } else {
      alert("Error occurred while signing up");
    }
  };
  xhr.onerror = function () {
    alert("Error occurred while signing up");
  };
  xhr.send(
    `username=${encodeURIComponent(username)}&name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
      password
    )}`
  );
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      login();
    });
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send data to server using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../backend/controller/server.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Add a parameter to indicate that this is a login request
  const params = `login=true&username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log(xhr.responseText); // Log the response
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.status === "success") {
          localStorage.setItem("token", response.token);
          window.location.href = "index.html";
        } else {
          document.getElementById("login-message").classList.remove("hidden");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      alert("Error occurred while logging in");
    }
  };
  xhr.onerror = function () {
    alert("Error occurred while logging in");
  };
  xhr.send(params);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logout-text").addEventListener("click", function () {
    logout();
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("token")) {
    document.getElementById("profile-text").classList.add("block");
    document.getElementById("logout-text").classList.add("block");
    document.getElementById("login-text").classList.add("hidden");
    document.getElementById("signup-text").classList.add("hidden");
  }
});

// event listener for when the user is logged in then don't show the login button
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("token")) {
    document.getElementById("login-text").classList.add("block");
    document.getElementById("signup-text").classList.add("block");
    document.getElementById("profile-text").classList.add("hidden");
    document.getElementById("logout-text").classList.add("hidden");
  }
});

// Event listener for when the user is logged in then show the name of the user
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("token")) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../backend/controller/server.php", true);
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.status === "success") {
          document.getElementById("profile-text").textContent = response.name;
        }
      }
    };
    xhr.send();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("change-password-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      changePassword();
    });
});

function changePassword() {
  const old_password = document.getElementById("old_password").value;
  const new_password = document.getElementById("new_password").value;
  const confirm_new_password = document.getElementById(
    "confirm_new_password"
  ).value;

  // Client-side validation
  if (new_password !== confirm_new_password) {
    alert("Passwords do not match");
    return;
  }

  // Send data to server using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../backend/controller/change-password.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.status === "success") {
        alert(response.message);
        window.location.href = "login.html";
      } else {
        alert("Error occurred while changing password: " + response.message);
      }
    } else {
      alert("Error occurred while changing password");
    }
  };
  xhr.onerror = function () {
    alert("Error occurred while changing password");
  };
  xhr.send(
    `old_password=${encodeURIComponent(
      old_password
    )}&new_password=${encodeURIComponent(new_password)}`
  );
}
