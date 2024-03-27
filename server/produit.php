<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permettre l'accès à partir de n'importe quelle origine

$servername = "localhost";
$username = "wexz9597_presta-test1";
$password = "ZgSuiBb3O.qh";
$database = "wexz9597_presta-test";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $database);

// Vérification de la connexion
if ($conn->connect_error) {
    die(json_encode(array('error' => 'Échec de la connexion à la base de données')));
}

// Récupération du code-barres depuis la requête GET
$ean = $_GET['ean'] ?? '';

if (empty($ean)) {
    die(json_encode(array('error' => 'Code-barres manquant dans la requête')));
}

// Requête SQL pour récupérer les informations du produit
$sql = "SELECT name, description, color, height, width, length, depth, id_product, ean13, reference FROM ps_product WHERE ean13 = '$ean'";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $product = array();
    while($row = $result->fetch_assoc()) {
        $product['name'] = $row['name'];
        $product['description'] = $row['description'];
        $product['color'] = $row['color'];
        $product['dimensions'] = array(
            'height' => $row['height'],
            'width' => $row['width'],
            'length' => $row['length'],
            'depth' => $row['depth']
        );
        $product['id'] = $row['id_product'];
        $product['ean'] = $row['ean13'];
        $product['reference'] = $row['reference'];
    }

    echo json_encode($product);
} else {
    http_response_code(404);
    echo json_encode(array('error' => 'Produit non trouvé'));
}

// Fermer la connexion à la base de données
$conn->close();
?>
