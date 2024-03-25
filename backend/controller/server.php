<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '/Applications/XAMPP/xamppfiles/htdocs/vitcevents/backend/controller/vendor/autoload.php';

use Firebase\JWT\JWT;

// Function to generate JWT token
function generateJWT($user_id) {
    $key = "shaad_hero"; 
    $payload = array(
        "user_id" => $user_id,
        "iat" => time(),
        "exp" => time() + (60*60)
    );
    return JWT::encode($payload, $key);
}

// Function to check password strength
function isPasswordStrong($password, $username) {
    // Check if password is at least 12 characters long
    if (strlen($password) < 12) {
        return false;
    }

    // Check if password contains at least one number
    if (!preg_match('/\d/', $password)) {
        return false;
    }

    // Check if password contains at least one special character
    if (!preg_match('/[!@#$%^&*()_+\-=[\]{};\'":\\|,.<>\/?]+/', $password)) {
        return false;
    }

    // Check if password contains at least one uppercase letter
    if (!preg_match('/[A-Z]/', $password)) {
        return false;
    }

    // Check if password contains at least one lowercase letter
    if (!preg_match('/[a-z]/', $password)) {
        return false;
    }

    // Check if password does not contain spaces
    if (preg_match('/\s/', $password)) {
        return false;
    }

    // Check if password does not contain unicode characters or emoji
    if (preg_match('/[\x{0080}-\x{FFFF}]/u', $password)) {
        return false;
    }

    // Check if password is not the name of the user itself
    if (strtolower($password) === strtolower($username)) {
        return false;
    }

    // Check if password is not the word "password"
    if (strtolower($password) === 'password') {
        return false;
    }

    // Check if password is not the word "123456"
    if ($password === '123456') {
        return false;
    }

    return true;
}

// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'event_management';

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Sign Up
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check if username or email already exists
    $check_query = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
    $result = $conn->query($check_query);
    if ($result && $result->num_rows > 0) {
        echo json_encode(array("status" => "error", "message" => "Username or email already exists"));
        return; 
    }

    // Check password strength
    if (!isPasswordStrong($password, $username)) {
        echo json_encode(array("status" => "error", "message" => "Password should be at least 12 characters long"));
        return; 
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user data into the database
    $sql = "INSERT INTO users (username, name, email, password) VALUES ('$username', '$name', '$email', '$hashed_password')";

    if ($conn->query($sql) === TRUE) {
        // Generate JWT token
        $user_id = $conn->insert_id;
        $jwt_token = generateJWT($user_id);
        echo json_encode(array("status" => "success", "message" => "User signed up successfully", "token" => $jwt_token));
    } else {
        echo json_encode(array("status" => "error", "message" => "Error occurred while signing up: " . $conn->error));
    }
}

// Close connection
$conn->close();
?>
