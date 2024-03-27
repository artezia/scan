const codeReader = new ZXing.BrowserBarcodeReader();

const videoElement = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const searchButton = document.getElementById('searchButton');
const resultDiv = document.getElementById('result');
const rayonDiv = document.getElementById('rayon');
const eanInput = document.getElementById('eanInput');

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        codeReader
            .decodeFromInputVideoDevice(undefined, 'video')
            .then(result => {
                console.log(result);
                resultDiv.textContent = "Code-barres détecté: " + result.text;

                // Envoyer le code-barres au serveur pour obtenir les informations du produit
                fetch('https://miracle-feed.com/app-scan4/server/produit.php?ean=' + result.text)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la récupération des informations du produit.');
                        }
                        return response.json();
                    })
                    .then(product => {
                        displayProduct(product);
                    })
                    .catch(err => {
                        console.error(err);
                        rayonDiv.textContent = "Erreur lors de la récupération des informations du produit.";
                    });
            })
            .catch(err => {
                console.error(err);
                resultDiv.textContent = "Erreur lors de la lecture du code-barres.";
            });
    } catch (error) {
        console.error('Erreur lors de l\'accès à la webcam:', error);
        alert('Impossible d\'accéder à la webcam. Assurez-vous d\'autoriser l\'accès à la webcam et réessayez.');
    }
});

stopButton.addEventListener('click', () => {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach(track => track.stop());
});

searchButton.addEventListener('click', () => {
    const ean = eanInput.value.trim();
    if (ean !== '') {
        fetch('https://miracle-feed.com/app-scan4/server/produit.php?ean=' + ean)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur HTTP, statut : ' + response.status);
                }
                return response.json();
            })
            .then(product => {
                displayProduct(product);
            })
            .catch(err => {
                console.error(err);
                rayonDiv.textContent = "Erreur lors de la récupération des informations du produit.";
            });
    }
});

function displayProduct(product) {
    resultDiv.innerHTML = `
        <p>ID produit: ${product.id}</p>
        <p>Nom: ${product.name}</p>
        <p>Description: ${product.description}</p>
        <p>Prix: ${product.price}</p>
        <p>Poids: ${product.weight}</p>
        <p>Stock restant: ${product.quantity}</p>
        <p>UPC: ${product.upc}</p>
        <img src="https://wexz9597.odns.fr/presta_test/${product.id_image}-large_default/${product.link_rewrite}.jpg" alt="Image du produit">
    `;
}
