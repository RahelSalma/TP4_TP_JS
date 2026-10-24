
import { state } from "./state.js";

export function getCustomer(customerId) {
    return state.customers.find(
        customer => customer.id === customerId
    );
}

export function getProduct(productId) {
    return state.products.find(
        product => product.id === productId
    );
}

export function getOrderTotal(order) {
    let total = 0;

    order.items.forEach(item => {
        const product = getProduct(item.productId);

        if (product) {
            total += product.price * item.quantity;
        }
    });

    return total;
}

export function getOrderDetails(order) {
    const customer = getCustomer(order.customerId);

    const items = order.items.map(item => {
        const product = getProduct(item.productId);

        return {
            product,
            quantity: item.quantity,
            subtotal: product
                ? product.price * item.quantity
                : 0
        };
    });

    return {
        order,
        customer,
        items,
        total: getOrderTotal(order)
    };
}

export function getFilteredOrders() {
    return state.orders.filter(order => {
        const customer = getCustomer(order.customerId);

        const matchesSearch = customer
            ? customer.name.toLowerCase().includes(
                state.search.toLowerCase()
            )
            : false;

        const matchesStatus =
            !state.status || order.status === state.status;

        const matchesCategory =
            !state.category ||
            order.items.some(item => {
                const product = getProduct(item.productId);

                return product &&
                    product.category === state.category;
            });

        return matchesSearch &&
            matchesStatus &&
            matchesCategory;
    });
}
