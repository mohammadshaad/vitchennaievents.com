<?php
// Include necessary files and libraries
require_once '/Applications/XAMPP/xamppfiles/htdocs/vitcevents/backend/controller/vendor/autoload.php';
use Firebase\JWT\JWT;

// Function to retrieve user data
function getUserData()
{
    // Check if a valid JWT token is provided in the request headers
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$token) {
        return array("status" => "error", "message" => "JWT token is missing");
    }

    // Decode and verify the JWT token
    $key = "shaad_hero";
    try {
        $decoded_token = JWT::decode($token, $key, array('HS256'));

        // Retrieve user data from the database based on the user_id in the JWT token
        $user_id = $decoded_token->user_id;

        // Database connection parameters
        $host = 'localhost';
        $username = 'root';
        $password = '';
        $database = 'event_management';

        // Create a new MySQLi connection
        $conn = new mysqli($host, $username, $password, $database);

        // Check connection
        if ($conn->connect_error) {
            return array("status" => "error", "message" => "Database connection failed: " . $conn->connect_error);
        }

        // Prepare and execute a query to retrieve user data
        $stmt = $conn->prepare("SELECT name FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if user data was retrieved successfully
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $user_name = $row['name'];
            return array("status" => "success", "name" => $user_name);
        } else {
            return array("status" => "error", "message" => "User not found in the database");
        }

        // Close the database connection
        $conn->close();
    } catch (Exception $e) {
        return array("status" => "error", "message" => "Invalid JWT token");
    }
}

// Fetch user data and return JSON response
$user_data_response = getUserData();
echo json_encode($user_data_response);
?>