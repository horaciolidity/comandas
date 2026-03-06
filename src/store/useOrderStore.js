import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useOrderStore = create((set) => ({
    orders: [],
    history: [],

    addOrder: (items, tableNumber) => set((state) => ({
        orders: [
            ...state.orders,
            {
                id: uuidv4().slice(0, 8),
                tableNumber,
                items,
                status: 'pending',
                createdAt: new Date().toISOString(),
                total: items.reduce((acc, i) => acc + (i.price * i.quantity), 0)
            }
        ]
    })),

    updateOrderStatus: (orderId, status) => set((state) => {
        const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
        );

        // If delivered, move to history
        if (status === 'delivered') {
            const deliveredOrder = updatedOrders.find(o => o.id === orderId);
            return {
                orders: updatedOrders.filter(o => o.id !== orderId),
                history: [...state.history, { ...deliveredOrder, deliveredAt: new Date().toISOString() }]
            };
        }

        return { orders: updatedOrders };
    }),

    getStats: (state) => {
        const totalSales = state.history.reduce((acc, o) => acc + o.total, 0);
        const totalOrders = state.history.length;
        return { totalSales, totalOrders };
    },

    clearHistory: () => set({ history: [] }),
    clearOrders: () => set({ orders: [] }),
}));

export default useOrderStore;
