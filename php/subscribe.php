<?php
/**
 * Newsletter endpoint (starter stub). Responds with JSON: { "success": bool, "message": string }
 */
header('Content-Type: application/json');

$email = trim($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// TODO: store the subscriber.

echo json_encode(['success' => true, 'message' => 'Subscribed! Thank you for joining us.']);
