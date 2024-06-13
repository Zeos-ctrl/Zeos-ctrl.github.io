<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING);
    $lastname = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if ($firstname && $lastname && $email && $subject && $message) {
        $to = 'contact@zeos.systems';
        $email_subject = "New Contact Form Submission: $subject";
        $email_body = "You have received a new message from $firstname $lastname.\n\n".
                      "Here are the details:\n".
                      "Name: $firstname $lastname\n".
                      "Email: $email\n\n".
                      "Message:\n$message";
        $headers = "From: $email\n";
        $headers .= "Reply-To: $email";

        if (mail($to, $email_subject, $email_body, $headers)) {
            echo "Message sent successfully!";
        } else {
            echo "Failed to send the message. Please try again later.";
        }
    } else {
        echo "Invalid input. Please ensure all fields are filled out correctly.";
    }
} else {
    echo "Invalid request method.";
}
?>
