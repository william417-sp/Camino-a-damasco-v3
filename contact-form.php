<?php
// Contact Form Handler for Iglesia Camino a Damasco
// Version 1.0.0

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$config = [
    'to_email' => 'info@caminoadamasco.com', // Change to your email
    'from_email' => 'noreply@caminoadamasco.com',
    'subject_prefix' => '[Iglesia Camino a Damasco] ',
    'max_message_length' => 1000,
    'required_fields' => ['name', 'email', 'message'],
    'honeypot_field' => 'website', // Hidden field to catch bots
];

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to send email
function send_email($to, $subject, $message, $headers) {
    return mail($to, $subject, $message, $headers);
}

// Function to log form submissions
function log_submission($data) {
    $log_entry = date('Y-m-d H:i:s') . " - " . json_encode($data) . "\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
}

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Check for honeypot (bot detection)
    if (!empty($_POST[$config['honeypot_field']])) {
        $response['message'] = 'Spam detected.';
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
    
    // Rate limiting (simple implementation)
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_limit_file)) {
        $last_submission = (int)file_get_contents($rate_limit_file);
        if ($current_time - $last_submission < 300) { // 5 minutes
            $response['message'] = 'Por favor, espera 5 minutos antes de enviar otro mensaje.';
            http_response_code(429);
            echo json_encode($response);
            exit;
        }
    }
    
    // Validate required fields
    foreach ($config['required_fields'] as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = ucfirst($field) . ' es requerido.';
        }
    }
    
    // Validate email
    if (!empty($_POST['email']) && !validate_email($_POST['email'])) {
        $response['errors']['email'] = 'Por favor, ingresa un email válido.';
    }
    
    // Validate message length
    if (!empty($_POST['message']) && strlen($_POST['message']) > $config['max_message_length']) {
        $response['errors']['message'] = 'El mensaje no puede exceder ' . $config['max_message_length'] . ' caracteres.';
    }
    
    // If no errors, process the form
    if (empty($response['errors'])) {
        
        // Sanitize inputs
        $name = sanitize_input($_POST['name']);
        $email = sanitize_input($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
        $message = sanitize_input($_POST['message']);
        $form_type = isset($_POST['form_type']) ? sanitize_input($_POST['form_type']) : 'contact';
        
        // Prepare email content
        $subject = $config['subject_prefix'] . ucfirst($form_type) . ' - ' . $name;
        
        $email_message = "
        <html>
        <head>
            <title>Nuevo mensaje de contacto</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0D47A1; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #0D47A1; }
                .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Iglesia Camino a Damasco</h2>
                    <p>Nuevo mensaje de " . ucfirst($form_type) . "</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <span class='label'>Nombre:</span> " . $name . "
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span> " . $email . "
                    </div>";
        
        if (!empty($phone)) {
            $email_message .= "
                    <div class='field'>
                        <span class='label'>Teléfono:</span> " . $phone . "
                    </div>";
        }
        
        $email_message .= "
                    <div class='field'>
                        <span class='label'>Mensaje:</span><br>
                        " . nl2br($message) . "
                    </div>
                    <div class='field'>
                        <span class='label'>Fecha:</span> " . date('Y-m-d H:i:s') . "
                    </div>
                    <div class='field'>
                        <span class='label'>IP:</span> " . $_SERVER['REMOTE_ADDR'] . "
                    </div>
                </div>
                <div class='footer'>
                    <p>Este mensaje fue enviado desde el sitio web de la Iglesia Camino a Damasco</p>
                </div>
            </div>
        </body>
        </html>";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $config['from_email'],
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email
        if (send_email($config['to_email'], $subject, $email_message, implode("\r\n", $headers))) {
            
            // Log successful submission
            log_submission([
                'type' => $form_type,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            
            // Update rate limit
            file_put_contents($rate_limit_file, $current_time);
            
            $response['success'] = true;
            $response['message'] = '¡Mensaje enviado exitosamente! Te contactaremos pronto.';
            
        } else {
            $response['message'] = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
        }
        
    } else {
        $response['message'] = 'Por favor, corrige los errores en el formulario.';
    }
    
} else {
    $response['message'] = 'Método no permitido.';
    http_response_code(405);
}

// Set content type
header('Content-Type: application/json');

// Return response
echo json_encode($response);
?>
