<?php
// Donation Form Handler for Iglesia Camino a Damasco
// Version 1.0.0

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$config = [
    'to_email' => 'donations@caminoadamasco.com', // Change to your donations email
    'from_email' => 'noreply@caminoadamasco.com',
    'subject_prefix' => '[Donación] ',
    'honeypot_field' => 'website',
    'donations_file' => 'donations_log.txt',
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

// Function to log donation
function log_donation($data) {
    $log_entry = date('Y-m-d H:i:s') . " - DONATION - " . json_encode($data) . "\n";
    file_put_contents($config['donations_file'], $log_entry, FILE_APPEND | LOCK_EX);
}

// Function to generate receipt
function generate_receipt($donation_data) {
    $receipt_number = 'RCP-' . date('Ymd') . '-' . substr(md5($donation_data['email'] . time()), 0, 6);
    
    $receipt_html = "
    <html>
    <head>
        <title>Recibo de Donación - Iglesia Camino a Damasco</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0D47A1; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .receipt-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .field { margin-bottom: 10px; display: flex; justify-content: space-between; }
            .label { font-weight: bold; color: #0D47A1; }
            .amount { font-size: 1.2em; font-weight: bold; color: #0D47A1; }
            .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
            .bible-verse { font-style: italic; color: #666; text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Iglesia Camino a Damasco</h2>
                <p>Recibo de Donación</p>
            </div>
            <div class='content'>
                <div class='receipt-details'>
                    <h3>Detalles de la Donación</h3>
                    <div class='field'>
                        <span class='label'>Número de Recibo:</span>
                        <span>{$receipt_number}</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Fecha:</span>
                        <span>" . date('Y-m-d H:i:s') . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Donante:</span>
                        <span>" . $donation_data['name'] . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span>" . $donation_data['email'] . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Tipo de Donación:</span>
                        <span>" . ucfirst($donation_data['type']) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Método de Pago:</span>
                        <span>" . ucfirst($donation_data['method']) . "</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Monto:</span>
                        <span class='amount'>$" . number_format($donation_data['amount'], 2) . "</span>
                    </div>";
    
    if (!empty($donation_data['instructions'])) {
        $receipt_html .= "
                    <div class='field'>
                        <span class='label'>Instrucciones:</span>
                        <span>" . $donation_data['instructions'] . "</span>
                    </div>";
    }
    
    $receipt_html .= "
                </div>
                
                <div class='bible-verse'>
                    <p><strong>2 Corintios 9:7</strong><br>
                    \"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.\"</p>
                </div>
                
                <p><strong>Nota:</strong> Este recibo es válido para deducciones fiscales. Guarda este documento para tus registros.</p>
            </div>
            <div class='footer'>
                <p>Iglesia Camino a Damasco | Ave. Casiano Cepeda, Rio Grande, Puerto Rico</p>
                <p>Tel: 787-552-4294 | Email: info@caminoadamasco.com</p>
            </div>
        </div>
    </body>
    </html>";
    
    return $receipt_html;
}

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => [],
    'receipt_number' => null
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
    $rate_limit_file = 'donation_rate_limit_' . md5($ip) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_limit_file)) {
        $last_submission = (int)file_get_contents($rate_limit_file);
        if ($current_time - $last_submission < 300) { // 5 minutes
            $response['message'] = 'Por favor, espera 5 minutos antes de hacer otra donación.';
            http_response_code(429);
            echo json_encode($response);
            exit;
        }
    }
    
    // Validate required fields
    $required_fields = ['name', 'email', 'amount', 'type', 'method'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = ucfirst($field) . ' es requerido.';
        }
    }
    
    // Validate email
    if (!empty($_POST['email']) && !validate_email($_POST['email'])) {
        $response['errors']['email'] = 'Por favor, ingresa un email válido.';
    }
    
    // Validate amount
    if (!empty($_POST['amount']) && (!is_numeric($_POST['amount']) || $_POST['amount'] <= 0)) {
        $response['errors']['amount'] = 'Por favor, ingresa un monto válido.';
    }
    
    // If no errors, process the donation
    if (empty($response['errors'])) {
        
        // Sanitize inputs
        $name = sanitize_input($_POST['name']);
        $email = sanitize_input($_POST['email']);
        $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
        $address = isset($_POST['address']) ? sanitize_input($_POST['address']) : '';
        $amount = floatval($_POST['amount']);
        $type = sanitize_input($_POST['type']);
        $method = sanitize_input($_POST['method']);
        $instructions = isset($_POST['instructions']) ? sanitize_input($_POST['instructions']) : '';
        $anonymous = isset($_POST['anonymous']) ? 'Sí' : 'No';
        
        // Prepare donation data
        $donation_data = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'amount' => $amount,
            'type' => $type,
            'method' => $method,
            'instructions' => $instructions,
            'anonymous' => $anonymous,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        // Generate receipt
        $receipt_html = generate_receipt($donation_data);
        $receipt_number = 'RCP-' . date('Ymd') . '-' . substr(md5($email . time()), 0, 6);
        
        // Prepare email content
        $subject = $config['subject_prefix'] . $type . ' - $' . number_format($amount, 2) . ' - ' . $name;
        
        $email_message = "
        <html>
        <head>
            <title>Nueva Donación Recibida</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0D47A1; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 20px; }
                .donation-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; color: #0D47A1; }
                .amount { font-size: 1.5em; font-weight: bold; color: #0D47A1; }
                .footer { background-color: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>💰 Nueva Donación Recibida</h2>
                    <p>Iglesia Camino a Damasco</p>
                </div>
                <div class='content'>
                    <div class='donation-details'>
                        <h3>Detalles de la Donación</h3>
                        <div class='field'>
                            <span class='label'>Donante:</span> " . $name . "
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
        
        if (!empty($address)) {
            $email_message .= "
                        <div class='field'>
                            <span class='label'>Dirección:</span> " . $address . "
                        </div>";
        }
        
        $email_message .= "
                        <div class='field'>
                            <span class='label'>Tipo:</span> " . ucfirst($type) . "
                        </div>
                        <div class='field'>
                            <span class='label'>Método:</span> " . ucfirst($method) . "
                        </div>
                        <div class='field'>
                            <span class='label'>Monto:</span>
                            <span class='amount'>$" . number_format($amount, 2) . "</span>
                        </div>
                        <div class='field'>
                            <span class='label'>Anónimo:</span> " . $anonymous . "
                        </div>
                        <div class='field'>
                            <span class='label'>Fecha:</span> " . date('Y-m-d H:i:s') . "
                        </div>
                        <div class='field'>
                            <span class='label'>IP:</span> " . $_SERVER['REMOTE_ADDR'] . "
                        </div>";
        
        if (!empty($instructions)) {
            $email_message .= "
                        <div class='field'>
                            <span class='label'>Instrucciones:</span><br>
                            " . nl2br($instructions) . "
                        </div>";
        }
        
        $email_message .= "
                    </div>
                </div>
                <div class='footer'>
                    <p>Esta donación fue procesada desde el sitio web de la Iglesia Camino a Damasco</p>
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
        
        // Send notification email
        if (send_email($config['to_email'], $subject, $email_message, implode("\r\n", $headers))) {
            
            // Send receipt to donor
            $receipt_subject = 'Recibo de Donación - Iglesia Camino a Damasco';
            $receipt_headers = [
                'MIME-Version: 1.0',
                'Content-type: text/html; charset=UTF-8',
                'From: Iglesia Camino a Damasco <' . $config['from_email'] . '>',
                'Reply-To: info@caminoadamasco.com',
                'X-Mailer: PHP/' . phpversion()
            ];
            
            send_email($email, $receipt_subject, $receipt_html, implode("\r\n", $receipt_headers));
            
            // Log donation
            log_donation($donation_data);
            
            // Update rate limit
            file_put_contents($rate_limit_file, $current_time);
            
            $response['success'] = true;
            $response['message'] = '¡Donación procesada exitosamente! Recibirás un recibo por email.';
            $response['receipt_number'] = $receipt_number;
            
        } else {
            $response['message'] = 'Error al procesar la donación. Por favor, inténtalo de nuevo.';
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
