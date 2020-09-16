<?php
/*
This script designed for check Node aviable by socket connection.
This is far from the best way to check.
*/

function validateIP($ip){
    return inet_pton($ip) !== false;
}

function printSuccess($header, $msg) {
    exit('<br><div class="alert alert-success" role="alert"><strong>'.$header.'</strong> '.$msg.'</div>');
}

function printDanger($header, $msg) {
    exit('<br><div class="alert alert-danger" role="alert"><strong>'.$header.'</strong> '.$msg.'</div>');
}

$ip = $_GET['ip'];
$port = intval($_GET['port']);

if (!isset($ip) || !isset($port)) {
    printDanger('Error!', 'Please, specify IP/Port params.');
}
if (empty($ip)) {
    printDanger('Error!', 'Please, specify IP.');
}
if (empty($port)) {
    printDanger('Error!', 'Please, specify port.');
}

if (!validateIP($ip)) {
    printDanger('Error!', 'Invalid ip.');
}
if (strlen(inet_pton($ip)) == 16) {
    $ip = "[".$ip."]";
}

if (!is_int($port)) {
    printDanger('Error!', 'Invalid port.');
}

if ($port < 1 || $port > 65535) {
    printDanger('Error!', 'Please, specify Port. Valid values between 1 and 65535.');
}

$connection = @fsockopen($ip, $port, $errno, $errstr, 3);

if (is_resource($connection))
{
    printSuccess('Well done!', 'Port is open.');

    fclose($connection);
}

else
{
    printDanger('Error!', 'Can\'t connect to the server.<br>Is node running? Or firewall may blocking the connection. This needs to be fixed.<br>You can execute this: <div class="highlight"><pre><code>sudo ufw allow '.$port.'/tcp</code></pre></div>Links:<br><a href="https://cloud.google.com/vpc/docs/using-firewalls" target="_blank">Firewall guide for Google Cloud</a><br><a href="https://linuxize.com/post/how-to-setup-a-firewall-with-ufw-on-ubuntu-18-04/" target="_blank">Firewall guide for ufw</a>');
}

?>