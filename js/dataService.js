
async function loadJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur de chargement : ${url}`);
    }

    return await response.json();
}

export async function loadAllData() {
    try {
        const [customers, products, orders] = await Promise.all([
            loadJSON("./data/customers.json"),
            loadJSON("./data/products.json"),
            loadJSON("./data/orders.json")
        ]);

        return { customers, products, orders };
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        throw error;
    }
}
