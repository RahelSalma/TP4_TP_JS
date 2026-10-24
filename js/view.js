
import { state } from "./state.js";

import {
    getCustomer,
    getOrderTotal,
    getFilteredOrders,
    getOrderDetails
} from "./selectors.js";

// Formatage des prix en dirhams
function formatMAD(price) {
    return price.toLocaleString("fr-FR") + " DH";
}

// Protection des textes affichés dans le HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// Afficher une erreur
export function showError(message) {
    const errorBox = document.getElementById("error-message");

    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
}

// Masquer l'erreur
export function clearError() {
    const errorBox = document.getElementById("error-message");

    errorBox.textContent = "";
    errorBox.classList.add("d-none");
}

// Afficher les indicateurs
export function renderIndicators() {
    const container = document.getElementById("indicators");

    const totalAmount = state.orders.reduce(
        (sum, order) => sum + getOrderTotal(order),
        0
    );

    container.innerHTML = `
        <div class="col-6 col-lg-3">
            <div class="card p-3">
                <h3 class="h6 text-secondary">Clients</h3>
                <p class="h3">${state.customers.length}</p>
            </div>
        </div>

        <div class="col-6 col-lg-3">
            <div class="card p-3">
                <h3 class="h6 text-secondary">Produits</h3>
                <p class="h3">${state.products.length}</p>
            </div>
        </div>

        <div class="col-6 col-lg-3">
            <div class="card p-3">
                <h3 class="h6 text-secondary">Commandes</h3>
                <p class="h3">${state.orders.length}</p>
            </div>
        </div>

        <div class="col-6 col-lg-3">
            <div class="card p-3">
                <h3 class="h6 text-secondary">Montant total</h3>
                <p class="h4">${formatMAD(totalAmount)}</p>
            </div>
        </div>
    `;
}

// Afficher les commandes filtrées
export function renderOrders() {
    const container = document.getElementById("orders-list");
    const orders = getFilteredOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    Aucune commande trouvée.
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        const customer = getCustomer(order.customerId);

        let badgeClass = "text-bg-secondary";

        if (order.status === "Livree") {
            badgeClass = "text-bg-success";
        } else if (order.status === "En attente") {
            badgeClass = "text-bg-warning";
        } else if (order.status === "Annulee") {
            badgeClass = "text-bg-danger";
        }

        return `
            <tr>
                <td>${order.id}</td>
                <td>${escapeHTML(customer?.name ?? "Client inconnu")}</td>
                <td>${escapeHTML(order.date)}</td>
                <td>
                    <span class="badge ${badgeClass}">
                        ${escapeHTML(order.status)}
                    </span>
                </td>
                <td>${formatMAD(getOrderTotal(order))}</td>
                <td>
                    <button
                        class="btn btn-sm btn-primary detail-btn"
                        data-order-id="${order.id}">
                        Détail
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Afficher le détail d'une commande
export function renderOrderDetail(orderId) {
    const container = document.getElementById("order-detail");

    const order = state.orders.find(
        item => item.id === Number(orderId)
    );

    if (!order) {
        container.innerHTML = "<p>Commande introuvable.</p>";
        return;
    }

    const details = getOrderDetails(order);
    const customer = details.customer;

    const rows = details.items.map(item => `
        <tr>
            <td>${escapeHTML(item.product?.name ?? "Produit inconnu")}</td>
            <td>${item.product ? formatMAD(item.product.price) : "—"}</td>
            <td>${item.quantity}</td>
            <td>${formatMAD(item.subtotal)}</td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="card border-0 shadow-sm p-3 p-md-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h2 class="h4">Détail de la commande #${order.id}</h2>
                <button id="close-detail" class="btn btn-outline-secondary btn-sm">
                    Fermer
                </button>
            </div>

            <p><strong>Client :</strong>
                ${escapeHTML(customer?.name ?? "Client inconnu")}
            </p>

            <p><strong>Ville :</strong>
                ${escapeHTML(customer?.city ?? "Non précisée")}
            </p>

            <p><strong>Date :</strong> ${escapeHTML(order.date)}</p>

            <p><strong>Statut :</strong>
                ${escapeHTML(order.status)}
            </p>

            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>Produit</th>
                            <th>Prix unitaire</th>
                            <th>Quantité</th>
                            <th>Sous-total</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3" class="text-end">Total</th>
                            <th>${formatMAD(details.total)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    document.getElementById("close-detail").addEventListener("click", () => {
        container.innerHTML = "";
    });
}

// Fonction principale d'affichage
export function renderAll() {
    renderIndicators();
    renderOrders();
}
