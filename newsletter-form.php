<?php
// Newsletter Subscription Handler for Iglesia Camino a Damasco
// Version 1.0.0

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$config = [
    'to_email' => 'newsletter@caminoadamasco.com', // Change to your newsletter email
    'from_email' => 'noreply@caminoadamasco.com',
    'subject_prefix' => '[Newsletter] ',
    'honeypot_field' => 'website',
    'newsletter_file' => 'newsletter_subscribers.txt',
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

// Function to check if email already exists
function email_exists($email, $file) {
    if (!file_exists($file)) {
        return false;
    }
    
    $subscribers = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($subscribers as $subscriber) {
        $data = json_decode($subscriber, true);
        if ($data && isset($data['email']) && strtolower($data['email']) === strtolower($email)) {
            return true;
        }
    }
    return false;
}

// Function to add subscriber
function add_subscriber($email, $file) {
    $subscriber_data = [
        'email' => $email,
        'date' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'],
        'status' => 'active'
    ];
    
    $line = json_encode($subscriber_data) . "\n";
    return file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
}

// Function to send welcome email
function send_welcome_email($email) {
    $subject = 'Bienvenido al Boletín de la Iglesia Camino a Damasco';
    
    $message = "
    <html>
    <head>
        <title>Bienvenido al Boletín</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0D47A1; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
            .bible-verse { font-style: italic; color: #666; text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>¡Bienvenido!</h2>
                <p>Iglesia Camino a Damasco</p>
            </div>
            <div class='content'>
                <h3>¡Gracias por suscribirte a nuestro boletín!</h3>
                <p>Ahora recibirás:</p>
                <ul>
                    <li>📅 Actualizaciones semanales sobre eventos</li>
                    <li>📖 Reflexiones y mensajes inspiradores</li>
                    <li>🙏 Peticiones de oración especiales</li>
                    <li>🎵 Información sobre servicios y ministerios</li>
                    <li>💝 Oportunidades de servicio y voluntariado</li>
                </ul>
                
                <div class='bible-verse'>
                    <p><strong>Salmo 37:4</strong><br>
                    \"Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.\"</p>
                </div>
                
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                
                <p>Bendiciones,<br>
                <strong>Equipo de la Iglesia Camino a Damasco</strong></p>
            </div>
            <div class='footer'>
                <p>Iglesia Camino a Damasco | Ave. Casiano Cepeda, Rio Grande, Puerto Rico</p>
                <p>Tel: 787-552-4294 | Email: info@caminoadamasco.com</p>
                <p><a href='#' style='color: #CFB997;'>Cancelar suscripción</a></p>
            </div>
        </div>
    </body>
    </html>";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Iglesia Camino a Damasco <' . $config['from_email'] . '>',
        'Reply-To: info@caminoadamasco.com',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($email, $subject, $message, implode("\r\n", $headers));
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
    
    // Rate limiting
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_limit_file = 'newsletter_rate_limit_' . md5($ip) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_limit_file)) {
        $last_submission = (int)file_get_contents($rate_limit_file);
        if ($current_time - $last_submission < 300) { // 5 minutes
            $response['message'] = 'Por favor, espera 5 minutos antes de intentar suscribirte de nuevo.';
            http_response_code(429);
            echo json_encode($response);
            exit;
        }
    }
    
    // Validate email
    if (empty($_POST['email'])) {
        $response['errors']['email'] = 'El email es requerido.';
    } elseif (!validate_email($_POST['email'])) {
        $response['errors']['email'] = 'Por favor, ingresa un email válido.';
    }
    
    // If no errors, process the subscription
    if (empty($response['errors'])) {
        
        $email = sanitize_input($_POST['email']);
        
        // Check if email already exists
        if (email_exists($email, $config['newsletter_file'])) {
            $response['message'] = 'Este email ya está suscrito a nuestro boletín.';
        } else {
            
            // Add subscriber
            if (add_subscriber($email, $config['newsletter_file'])) {
                
                // Send welcome email
                send_welcome_email($email);
                
                // Update rate limit
                file_put_contents($rate_limit_file, $current_time);
                
                $response['success'] = true;
                $response['message'] = '¡Te has suscrito exitosamente! Revisa tu email para confirmar.';
                
            } else {
                $response['message'] = 'Error al procesar la suscripción. Por favor, inténtalo de nuevo.';
            }
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
