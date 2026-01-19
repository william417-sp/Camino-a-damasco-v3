<?php
// Prayer Request Form Handler for Iglesia Camino a Damasco
// Version 1.0.0

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$config = [
    'to_email' => 'prayer@caminoadamasco.com', // Change to your prayer team email
    'from_email' => 'noreply@caminoadamasco.com',
    'subject_prefix' => '[Petición de Oración] ',
    'max_message_length' => 2000,
    'required_fields' => ['name', 'request'],
    'honeypot_field' => 'website',
];

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to send email
function send_email($to, $subject, $message, $headers) {
    return mail($to, $subject, $message, $headers);
}

// Function to log prayer requests
function log_prayer_request($data) {
    $log_entry = date('Y-m-d H:i:s') . " - PRAYER - " . json_encode($data) . "\n";
    file_put_contents('prayer_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
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
    $rate_limit_file = 'prayer_rate_limit_' . md5($ip) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_limit_file)) {
        $last_submission = (int)file_get_contents($rate_limit_file);
        if ($current_time - $last_submission < 600) { // 10 minutes for prayer requests
            $response['message'] = 'Por favor, espera 10 minutos antes de enviar otra petición de oración.';
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
    
    // Validate message length
    if (!empty($_POST['request']) && strlen($_POST['request']) > $config['max_message_length']) {
        $response['errors']['request'] = 'La petición no puede exceder ' . $config['max_message_length'] . ' caracteres.';
    }
    
    // If no errors, process the form
    if (empty($response['errors'])) {
        
        // Sanitize inputs
        $name = sanitize_input($_POST['name']);
        $request = sanitize_input($_POST['request']);
        $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
        $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
        $urgent = isset($_POST['urgent']) ? 'Sí' : 'No';
        
        // Prepare email content
        $subject = $config['subject_prefix'] . $name;
        
        $email_message = "
        <html>
        <head>
            <title>Nueva Petición de Oración</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0D47A1; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #0D47A1; }
                .prayer-request { background-color: #fff; padding: 15px; border-left: 4px solid #0D47A1; margin: 15px 0; }
                .urgent { background-color: #ffebee; border-left-color: #f44336; }
                .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
                .bible-verse { font-style: italic; color: #666; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>🙏 Iglesia Camino a Damasco</h2>
                    <p>Nueva Petición de Oración</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <span class='label'>Nombre:</span> " . $name . "
                    </div>";
        
        if (!empty($email)) {
            $email_message .= "
                    <div class='field'>
                        <span class='label'>Email:</span> " . $email . "
                    </div>";
        }
        
        if (!empty($phone)) {
            $email_message .= "
                    <div class='field'>
                        <span class='label'>Teléfono:</span> " . $phone . "
                    </div>";
        }
        
        $email_message .= "
                    <div class='field'>
                        <span class='label'>Urgente:</span> " . $urgent . "
                    </div>
                    <div class='field'>
                        <span class='label'>Fecha:</span> " . date('Y-m-d H:i:s') . "
                    </div>
                    
                    <div class='prayer-request" . ($urgent === 'Sí' ? ' urgent' : '') . "'>
                        <h3>Petición de Oración:</h3>
                        " . nl2br($request) . "
                    </div>
                    
                    <div class='bible-verse'>
                        <p><strong>Mateo 18:20</strong><br>
                        \"Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.\"</p>
                    </div>
                    
                    <div class='field'>
                        <span class='label'>IP:</span> " . $_SERVER['REMOTE_ADDR'] . "
                    </div>
                </div>
                <div class='footer'>
                    <p>Esta petición de oración fue enviada desde el sitio web de la Iglesia Camino a Damasco</p>
                    <p>Nuestro equipo de oración se compromete a orar por esta petición</p>
                </div>
            </div>
        </body>
        </html>";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $config['from_email'],
            'Reply-To: ' . ($email ?: $config['from_email']),
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email
        if (send_email($config['to_email'], $subject, $email_message, implode("\r\n", $headers))) {
            
            // Log prayer request
            log_prayer_request([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'urgent' => $urgent,
                'ip' => $_SERVER['REMOTE_ADDR'],
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            
            // Update rate limit
            file_put_contents($rate_limit_file, $current_time);
            
            $response['success'] = true;
            $response['message'] = '¡Petición de oración enviada! Nuestro equipo de oración orará por ti.';
            
        } else {
            $response['message'] = 'Error al enviar la petición. Por favor, inténtalo de nuevo.';
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
