<?php
/**
 * Contact form endpoint (starter stub).
 * Called via AJAX from assets/js/main.js — set DEMO_MODE = false there to use it.
 * Must always respond with JSON: { "success": bool, "message": string }
 */
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $service === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

// TODO: save to database and/or send email (e.g. PHPMailer).

echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been sent. We will get back to you shortly.']);
