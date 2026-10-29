<?php
/**
 * Job application endpoint (starter stub).
 * Called via AJAX from assets/js/main.js — set DEMO_MODE = false there to use it.
 * Must always respond with JSON: { "success": bool, "message": string }
 */
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$position   = trim($_POST['position'] ?? '');
$name       = trim($_POST['name'] ?? '');
$email      = trim($_POST['email'] ?? '');
$phone      = trim($_POST['phone'] ?? '');
$experience = trim($_POST['experience'] ?? '');
$message    = trim($_POST['message'] ?? '');

if ($name === '' || $phone === '' || $experience === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields correctly.']);
    exit;
}

$resume = $_FILES['resume'] ?? null;
$allowed = ['pdf', 'doc', 'docx'];
$ext = strtolower(pathinfo($resume['name'] ?? '', PATHINFO_EXTENSION));
if (!$resume || $resume['error'] !== UPLOAD_ERR_OK || !in_array($ext, $allowed, true) || $resume['size'] > 5 * 1024 * 1024) {
    echo json_encode(['success' => false, 'message' => 'Please attach a PDF or Word resume up to 5 MB.']);
    exit;
}

// TODO: move the upload out of the web root (move_uploaded_file) and email HR (e.g. PHPMailer).

echo json_encode(['success' => true, 'message' => 'Thank you! Your application has been received. Our team will contact you soon.']);
