
import { state } from "./state.js";
import { loadAllData } from "./dataService.js";

import {
    renderAll,
    renderOrderDetail,
    showError,
    clearError
} from "./view.js";

// Charger les données JSON
async function init() {
    try {
        clearError();

        const data = await loadAllData();

        state.customers = data.customers;
        state.products = data.products;
        state.orders = data.orders;

        // Afficher la page après le chargement des données
        renderAll();

    } catch (error) {
        console.error("Erreur dans l'application :", error);

        showError(
            "Impossible de charger les données. Vérifiez les fichiers JSON et leurs chemins."
        );
    }
}

// Gérer la recherche et les filtres
function setupEvents() {
    const searchInput = document.getElementById("search");
    const statusFilter = document.getElementById("status-filter");
    const categoryFilter = document.getElementById("category-filter");
    const ordersList = document.getElementById("orders-list");
    const orderDetail = document.getElementById("order-detail");

    // Recherche par nom du client
    searchInput.addEventListener("input", event => {
        state.search = event.target.value;
        orderDetail.innerHTML = "";
        renderAll();
    });

    // Filtrer par statut
    statusFilter.addEventListener("change", event => {
        state.status = event.target.value;
        orderDetail.innerHTML = "";
        renderAll();
    });

    // Filtrer par catégorie
    categoryFilter.addEventListener("change", event => {
        state.category = event.target.value;
        orderDetail.innerHTML = "";
        renderAll();
    });

    // Afficher le détail lorsqu'on clique sur un bouton
    ordersList.addEventListener("click", event => {
        const button = event.target.closest(".detail-btn");

        if (!button) {
            return;
        }

        renderOrderDetail(button.dataset.orderId);
    });
}

// Initialiser les événements puis lancer l'application
setupEvents();
init();
