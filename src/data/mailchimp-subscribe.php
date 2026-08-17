<?php
/**
 * Quiz email + Mailchimp sync — Guides Digitaux
 */

define('MC_API_KEY', getenv('MAILCHIMP_API_KEY') ?: '');
define('MC_DC', getenv('MAILCHIMP_SERVER_PREFIX') ?: 'us15');
define('MC_LIST_ID', getenv('MAILCHIMP_LIST_ID') ?: 'dea5255730');

define('MAIL_FROM_EMAIL', 'contact@guides-digitaux.com');
define('MAIL_FROM_NAME', 'Guides Digitaux');
define('MAIL_REPLY_TO', 'contact@guides-digitaux.com');

$allowed_origins = ['https://guides-digitaux.com', 'https://www.guides-digitaux.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

header('Access-Control-Allow-Origin: ' . (in_array($origin, $allowed_origins, true) ? $origin : '*'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

$email = trim($data['email'] ?? '');
$profile = strtoupper(trim($data['profile'] ?? ''));

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalide']);
    exit;
}

if (!in_array($profile, ['A', 'B', 'C'], true)) {
    $profile = 'B';
}

$profileLabels = [
    'A' => 'quiz-profil-A',
    'B' => 'quiz-profil-B',
    'C' => 'quiz-profil-C',
];

$emailTemplates = [
    'A' => [
        'subject' => '🎉 Ton résultat : tu es prête à te lancer !',
        'preheader' => 'Tu as le bon profil pour te lancer avec une feuille de route claire.',
        'title' => 'Ton résultat : tu es prête à te lancer',
        'intro' => 'Tu viens de terminer le quiz et les résultats sont sans appel : tu as le profil de la fonceuse.',
        'body' => '<p>Salut,</p>
<p>Tu viens de terminer le quiz et les résultats sont sans appel : tu as le profil de la fonceuse. 🚀</p>
<p>Tu as la motivation, tu es prête à y consacrer le temps nécessaire, et la technique ne te fait pas peur (ou en tout cas, ça ne t’arrête pas). Tu as compris qu’un site internet professionnel est la clé pour ne plus dépendre uniquement du bouche-à-oreille.</p>
<p>Il ne te manque qu’une seule chose : une feuille de route claire pour éviter de perdre 3 semaines sur des détails techniques ou de bloquer sur du jargon.</p>
<p>C’est exactement pour ça que j’ai créé ma formation WordPress. Pas de blabla, on va droit au but pour que ton site soit en ligne et opérationnel rapidement.</p>
<p><a href="https://guides-digitaux.com/formation-wordpress" style="color:#0E9594;font-weight:bold;">👉 Découvrir le programme de la formation WordPress</a></p>
<p>À très vite,<br>Stéphanie</p>',
    ],
    'B' => [
        'subject' => '💙 Ton résultat : tu peux le faire, vraiment.',
        'preheader' => 'Tu peux avancer sereinement avec une méthode simple et pas à pas.',
        'title' => 'Ton résultat : tu peux le faire, vraiment',
        'intro' => 'Tu viens de terminer le quiz et voici ton profil : tu es prête à te lancer, même si quelques doutes persistent.',
        'body' => '<p>Bonjour,</p>
<p>Tu viens de terminer le quiz et voici ton profil : tu es prête à te lancer, même si quelques doutes persistent.</p>
<p>Laisse-moi te dire une chose : c’est complètement normal. Créer un site internet pour son activité peut sembler impressionnant quand on n’est pas "du métier". On a peur de faire une fausse manip, de perdre du temps ou de se retrouver bloquée devant un écran noir.</p>
<p>Mais bonne nouvelle : tu as TOUT ce qu’il faut pour y arriver.</p>
<p>Ce qu’il te faut, ce n’est pas un diplôme en informatique. C’est simplement un guide pas à pas, qui te parle avec des mots simples, sans jargon technique.</p>
<p>J’ai conçu ma formation WordPress exactement pour ça : pour te prendre par la main, à ton rythme, jusqu’à ce que tu sois fière de cliquer sur "Publier".</p>
<p><a href="https://guides-digitaux.com/formation-wordpress" style="color:#0E9594;font-weight:bold;">👉 Découvrir la méthode pas à pas, sans stress</a></p>
<p>Prends soin de toi,<br>Stéphanie</p>',
    ],
    'C' => [
        'subject' => '👣 Ton résultat : commence par là, c\'est plus simple qu\'il n\'y paraît.',
        'preheader' => 'Commence petit, simplement, avec la bonne première étape.',
        'title' => 'Ton résultat : commence par là',
        'intro' => 'Tu viens de terminer le quiz et ton profil est très clair : tu as besoin d’y aller un petit pas après l’autre.',
        'body' => '<p>Bonjour,</p>
<p>Tu viens de terminer le quiz et ton profil est très clair : tu as besoin d’y aller un petit pas après l’autre.</p>
<p>C’est tout à fait compréhensible. Entre ton activité d’artisane et tes journées bien remplies, l’idée de créer un site internet complet ressemble peut-être à une montagne infranchissable pour le moment.</p>
<p>Ma recommandation pour toi ? Oublie le site web pour quelques semaines.</p>
<p>Pour commencer à être vue sur internet sans stress et sans y passer tes nuits, il existe un outil magique et gratuit : Google Business Profile (la fiche qui te permet d’apparaître sur Google Maps).</p>
<p>C’est comme un "mini-site" qui travaille pour toi localement. C’est rapide à mettre en place et ça ne demande aucune compétence technique.</p>
<p><a href="https://guides-digitaux.com/" style="color:#0E9594;font-weight:bold;">👉 Découvrir mon guide pour maîtriser Google My Business</a></p>
<p>On commence par là ?</p>
<p>À bientôt,<br>Stéphanie</p>',
    ],
];

$selectedTemplate = $emailTemplates[$profile];
$emailSent = sendResultEmail($email, $selectedTemplate);
$mailchimpSync = syncMailchimpMember($email, $profile, $profileLabels[$profile]);

$success = $emailSent['success'] && $mailchimpSync['success'];
$statusCode = $success ? 200 : 500;

if ($emailSent['success'] || $mailchimpSync['success']) {
    $statusCode = 200;
}

http_response_code($statusCode);

echo json_encode([
    'success' => $success,
    'email_sent' => $emailSent['success'],
    'mailchimp_synced' => $mailchimpSync['success'],
    'profile' => $profile,
    'message' => buildUserMessage($emailSent['success'], $mailchimpSync['success']),
    'error' => buildErrorMessage($emailSent, $mailchimpSync),
    'details' => [
        'email' => $emailSent['message'],
        'mailchimp' => $mailchimpSync['message'],
    ],
], JSON_UNESCAPED_UNICODE);

function buildUserMessage($emailSent, $mailchimpSynced)
{
    if ($emailSent && $mailchimpSynced) {
        return 'Email envoye et contact synchronise avec Mailchimp.';
    }

    if ($emailSent) {
        return 'Email envoye, mais la synchronisation Mailchimp a echoue.';
    }

    if ($mailchimpSynced) {
        return 'Contact synchronise avec Mailchimp, mais l\'email n\'a pas pu etre envoye.';
    }

    return null;
}

function buildErrorMessage(array $emailSent, array $mailchimpSync)
{
    if ($emailSent['success'] && $mailchimpSync['success']) {
        return null;
    }

    $errors = [];

    if (!$emailSent['success']) {
        $errors[] = $emailSent['message'];
    }

    if (!$mailchimpSync['success']) {
        $errors[] = $mailchimpSync['message'];
    }

    return implode(' ', array_filter($errors));
}

function sendResultEmail($toEmail, array $template)
{
    $subject = $template['subject'];
    $html = renderEmailHtml($template);
    $text = renderEmailText($template);

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . formatMailbox(MAIL_FROM_NAME, MAIL_FROM_EMAIL),
        'Reply-To: ' . MAIL_REPLY_TO,
    ];

    $sent = mail($toEmail, encodeHeader($subject), $html, implode("\r\n", $headers));

    if (!$sent) {
        return [
            'success' => false,
            'message' => 'L\'envoi de l\'email a echoue.',
        ];
    }

    return [
        'success' => true,
        'message' => 'Email envoye avec succes.',
        'text_fallback' => $text,
    ];
}

function syncMailchimpMember($email, $profile, $tag)
{
    $subscriberHash = md5(strtolower($email));
    $mcUrl = 'https://' . MC_DC . '.api.mailchimp.com/3.0/lists/' . MC_LIST_ID . '/members/' . $subscriberHash;
    $payload = json_encode([
        'email_address' => $email,
        'status_if_new' => 'subscribed',
        'status' => 'subscribed',
        'merge_fields' => ['PROFIL' => $profile],
        'tags' => [$tag],
    ]);

    $ch = curl_init($mcUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'PUT',
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Basic ' . base64_encode('anystring:' . MC_API_KEY),
        ],
        CURLOPT_TIMEOUT => 10,
    ]);

    $response = curl_exec($ch);

    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);

        return [
            'success' => false,
            'message' => 'Erreur Mailchimp: ' . ($error ?: 'connexion impossible.'),
        ];
    }

    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (in_array($status, [200, 201], true)) {
        return [
            'success' => true,
            'message' => 'Contact synchronise avec Mailchimp.',
        ];
    }

    $mcData = json_decode($response, true);

    return [
        'success' => false,
        'message' => $mcData['detail'] ?? 'Erreur inconnue lors de la synchronisation Mailchimp.',
    ];
}

function renderEmailHtml(array $template)
{
    $preheader = htmlspecialchars($template['preheader'], ENT_QUOTES, 'UTF-8');
    $title = htmlspecialchars($template['title'], ENT_QUOTES, 'UTF-8');
    $intro = htmlspecialchars($template['intro'], ENT_QUOTES, 'UTF-8');
    $body = $template['body'];

    return '<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . $title . '</title>
</head>
<body style="margin:0;padding:0;background:#FDF6EA;font-family:Arial,sans-serif;color:#562C2C;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . $preheader . '</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FDF6EA;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#FFFCF5;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#0E9594;padding:24px 32px;color:#FFFCF5;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">
              Guides Digitaux
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:32px;line-height:1.1;font-family:Arial,sans-serif;">' . $title . '</h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#8A6A5A;">' . $intro . '</p>
              <div style="font-size:16px;line-height:1.7;color:#562C2C;">' . $body . '</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#F5DFBB;font-size:13px;line-height:1.6;color:#562C2C;">
              Tu recois cet email car tu as demande ton resultat via le quiz Guides Digitaux.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

function renderEmailText(array $template)
{
    $parts = [
        $template['title'],
        '',
        $template['intro'],
        '',
        trim(strip_tags(str_replace(['</p>', '<br>', '<br/>', '<br />'], "\n", $template['body']))),
        '',
        'Guides Digitaux',
    ];

    return implode("\n", $parts);
}

function formatMailbox($name, $email)
{
    return sprintf('"%s" <%s>', addslashes($name), $email);
}

function encodeHeader($value)
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}
