<?php
/**
 * Database connection
 * Default XAMPP MySQL credentials: username "root", blank password
 */

$host     = "localhost";
$username = "root";
$password = "";
$database = "swarali";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}