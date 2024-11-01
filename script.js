const deliveryList = document.getElementById('delivery-list');
const deliveries = [];

// Variables de suivi pour le bilan
let foodIzouaTotal = 0;
let foodMoiTotal = 0;
let deliveryIzouaTotal = 0;
let deliveryMoiTotal = 0;

// Gestion du formulaire d'ajout de livraison
document.getElementById('delivery-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    const deliveryZone = document.getElementById('delivery-zone').value;
    const foodAmount = parseInt(document.getElementById('food-amount').value, 10);
    const foodPayment = document.getElementById('food-payment').value;
    const startTime = new Date();

    const deliveryCost = getDeliveryCost(deliveryZone);
    
    const delivery = {
        clientName,
        clientPhone,
        deliveryZone,
        foodAmount,
        foodPayment,
        deliveryCost,
        startTime,
        endTime: null,
        duration: null
    };

    deliveries.push(delivery);
    addDeliveryToList(delivery);
    updateDailySummary(delivery);
    document.getElementById('delivery-form').reset();
});

function getDeliveryCost(zone) {
    switch(zone) {
        case "zone1": return 1000;
        case "zone2": return 1500;
        case "zone3": return 2000;
        default: return 0;
    }
}

function addDeliveryToList(delivery) {
    const deliveryItem = document.createElement('li');
    deliveryItem.classList.add('delivery-item');
    deliveryItem.innerHTML = `
        <strong>Client:</strong> ${delivery.clientName} (${delivery.clientPhone})<br>
        <strong>Zone:</strong> ${delivery.deliveryZone}<br>
        <strong>Montant Nourriture:</strong> ${delivery.foodAmount} FCFA<br>
        <strong>Paiement Nourriture:</strong> ${delivery.foodPayment}<br>
        <strong>Coût Livraison:</strong> ${delivery.deliveryCost} FCFA<br>
        <span class="delivery-time">Heure de départ: ${delivery.startTime.toLocaleTimeString()}</span><br>
        <button onclick="markAsDelivered(this, ${deliveries.indexOf(delivery)})">Marquer Livrée</button>
        <div class="duration" style="display:none;">Durée: <span class="delivery-duration"></span></div>
    `;
    deliveryList.appendChild(deliveryItem);
}

function markAsDelivered(button, index) {
    const endTime = new Date();
    deliveries[index].endTime = endTime;

    const duration = Math.round((endTime - deliveries[index].startTime) / 1000 / 60);
    deliveries[index].duration = duration;

    const deliveryItem = button.parentElement;
    deliveryItem.querySelector('.duration').style.display = "block";
    deliveryItem.querySelector('.delivery-duration').textContent = `${duration} min`;
    button.disabled = true;
}

function updateDailySummary(delivery) {
    if (delivery.foodPayment === "izoua") {
        foodIzouaTotal += delivery.foodAmount;
    } else if (delivery.foodPayment === "moi") {
        foodMoiTotal += delivery.foodAmount;
    }

    if (delivery.foodPayment === "izoua") {
        deliveryIzouaTotal += delivery.deliveryCost;
    } else if (delivery.foodPayment === "moi") {
        deliveryMoiTotal += delivery.deliveryCost;
    }

    // Mise à jour de l'interface
    document.getElementById('food-izoua-total').textContent = `${foodIzouaTotal} FCFA`;
    document.getElementById('food-moi-total').textContent = `${foodMoiTotal} FCFA`;
    document.getElementById('delivery-izoua-total').textContent = `${deliveryIzouaTotal} FCFA`;
    document.getElementById('delivery-moi-total').textContent = `${deliveryMoiTotal} FCFA`;
}
let selectedDeliveryIndex = null;

function markAsDelivered(button, index) {
    const endTime = new Date();
    deliveries[index].endTime = endTime;

    const duration = Math.round((endTime - deliveries[index].startTime) / 1000 / 60);
    deliveries[index].duration = duration;

    const deliveryItem = button.parentElement;
    deliveryItem.querySelector('.duration').style.display = "block";
    deliveryItem.querySelector('.delivery-duration').textContent = `${duration} min`;
    button.disabled = true;

    // Enregistrer l'index de la commande pour le mode de paiement
    selectedDeliveryIndex = index;

    // Afficher la fenêtre modale pour sélectionner le mode de paiement
    document.getElementById('payment-modal').style.display = 'flex';
}

function confirmPaymentMethod() {
    const paymentMethod = document.getElementById('payment-method').value;
    const delivery = deliveries[selectedDeliveryIndex];

    // Enregistrer le mode de paiement dans la commande
    delivery.deliveryPayment = paymentMethod;

    // Mettre à jour le bilan journalier
    updateDailySummary(delivery);

    // Masquer la fenêtre modale
    document.getElementById('payment-modal').style.display = 'none';

    // Réinitialiser l'index sélectionné
    selectedDeliveryIndex = null;
}

function updateDailySummary(delivery) {
    // Mode de paiement pour la nourriture
    if (delivery.foodPayment === "izoua") {
        foodIzouaTotal += delivery.foodAmount;
    } else if (delivery.foodPayment === "moi") {
        foodMoiTotal += delivery.foodAmount;
    }

    // Mode de paiement pour la livraison
    if (delivery.deliveryPayment === "izoua") {
        deliveryIzouaTotal += delivery.deliveryCost;
    } else if (delivery.deliveryPayment === "moi") {
        deliveryMoiTotal += delivery.deliveryCost;
    }

    // Mise à jour de l'interface
    document.getElementById('food-izoua-total').textContent = `${foodIzouaTotal} FCFA`;
    document.getElementById('food-moi-total').textContent = `${foodMoiTotal} FCFA`;
    document.getElementById('delivery-izoua-total').textContent = `${deliveryIzouaTotal} FCFA`;
    document.getElementById('delivery-moi-total').textContent = `${deliveryMoiTotal} FCFA`;
}
