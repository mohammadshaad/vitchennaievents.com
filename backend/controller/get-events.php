<?php
require_once '/Applications/XAMPP/xamppfiles/htdocs/vitcevents/backend/controller/vendor/autoload.php';

use Firebase\JWT\JWT;

// Function to verify JWT token
function verifyJWT($token)
{
    $key = "shaad_hero";
    try {
        $decoded = JWT::decode($token, $key, array('HS256'));
        return $decoded->user_id;
    } catch (Exception $e) {
        return null;
    }
}

// Database connection
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'event_management';

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die ("Connection failed: " . $conn->connect_error);
}

// Fetch events from the database
$sql = "SELECT * FROM events";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $events = array();
    while ($row = $result->fetch_assoc()) {
        $events[] = array(
            'event_id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'image_url' => $row['image_url'],
            'event_date' => $row['date'],
            'time' => $row['time'],
            'location' => $row['location'],
        );
    }
    echo json_encode(array("status" => "success", "events" => $events));
} else {
    echo json_encode(array("status" => "error", "message" => "No events found"));
}

// Close connection
$conn->close();
?>
