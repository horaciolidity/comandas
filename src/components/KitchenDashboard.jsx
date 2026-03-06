import React from 'react';
import useOrderStore from '../store/useOrderStore';
import { cn } from '../lib/utils';
import {
    Flame,
    Clock,
    ChevronRight,
    ChefHat,
    Timer,
    LayoutGrid,
    BellRing
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import TicketPrinter from './TicketPrinter';

export default function KitchenDashboard() {
    const allOrders = useOrderStore((state) => state.orders);
    const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

    const orders = React.useMemo(() =>
        allOrders.filter((o) => o.status !== 'delivered'),
        [allOrders]
    );

    const getStatusMeta = (status) => {
        switch (status) {
            case 'pending': return {
                label: 'Por Cocinar',
                color: 'text-brand-red',
                bg: 'bg-brand-red/10',
                border: 'border-brand-red/40',
                btn: 'bg-brand-red text-white shadow-brand-red/30',
                next: 'preparing',
                action: 'Iniciar'
            };
            case 'preparing': return {
                label: 'En Preparación',
                color: 'text-brand-yellow',
                bg: 'bg-brand-yellow/10',
                border: 'border-brand-yellow/40',
                btn: 'bg-brand-yellow text-black shadow-brand-yellow/30',
                next: 'ready',
                action: 'Finalizar'
            };
            case 'ready': return {
                label: '¡Para Entrega!',
                color: 'text-accent-green',
                bg: 'bg-accent-green/10',
                border: 'border-accent-green/40',
                btn: 'bg-accent-green text-white shadow-accent-green/30',
                next: 'delivered',
                action: 'Entregado'
            };
            default: return {};
        }
    };

    return (
        <div className="flex flex-col h-full gap-8">
            {/* Header Info */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-brand-red rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-red/30 animate-pulse">
                        <Flame className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">Kitchen <span className="text-brand-yellow">Fire</span> Monitor</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-red uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-brand-red" /> {orders.length} pedidos activos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex gap-6">
                    <div className="bg-surface-2 p-5 rounded-[2rem] border border-white/5 flex flex-col items-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase mb-1">Carga Actual</span>
                        <span className="text-2xl font-black text-white">{orders.length > 5 ? 'ALTA 🔥' : 'NORMAL'}</span>
                    </div>
                    <div className="bg-surface-2 p-4 rounded-[1.5rem] border border-white/5 flex items-center gap-4">
                        <BellRing className="w-6 h-6 text-brand-yellow" />
                        <button className="pos-btn bg-zinc-800 px-6 py-2 rounded-xl text-[10px]">Historial</button>
                    </div>
                </div>
            </div>

            {/* KDS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-20 content-start">
                {orders.length === 0 ? (
                    <div className="col-span-full h-[50vh] flex flex-col items-center justify-center opacity-10">
                        <ChefHat className="w-32 h-32 mb-6" />
                        <h4 className="text-2xl font-black uppercase italic tracking-widest">Cocina en Silencio</h4>
                    </div>
                ) : (
                    orders.map(order => {
                        const meta = getStatusMeta(order.status);
                        return (
                            <div key={order.id} className={cn("pos-card flex flex-col rounded-[2.5rem] overflow-hidden group", meta.border)}>
                                {/* Card Header */}
                                <div className={cn("p-6 flex items-center justify-between", meta.bg)}>
                                    <div>
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">ORDEN #{order.id.slice(0, 4)}</span>
                                        <h4 className="text-4xl font-black text-white tracking-tighter">MESA {order.tableNumber}</h4>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <TicketPrinter order={order} />
                                            <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-[10px] font-black text-brand-yellow uppercase">
                                                <Timer className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(order.createdAt), { locale: es })}
                                            </div>
                                        </div>
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest", meta.color)}>{meta.label}</span>
                                    </div>
                                </div>

                                {/* Items list */}
                                <div className="flex-1 p-6 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-surface-3 p-4 rounded-2xl border border-white/5 group-hover:bg-zinc-800/80 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 flex items-center justify-center bg-brand-yellow text-black rounded-lg font-black text-sm">{item.quantity}</span>
                                                <p className="font-black text-sm text-white uppercase tracking-tight">{item.name}</p>
                                            </div>
                                            <span className="text-2xl">{item.img}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Footer */}
                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={() => updateOrderStatus(order.id, meta.next)}
                                        className={cn("pos-btn w-full py-5 rounded-[1.5rem] text-sm !tracking-[0.2em]", meta.btn)}
                                    >
                                        {meta.action}
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </button>
                                </div>

                                {/* Progress Bar Decor */}
                                <div className="h-1.5 w-full bg-white/5">
                                    <div
                                        className={cn("h-full transition-all duration-1000", meta.btn.split(' ')[0])}
                                        style={{ width: order.status === 'pending' ? '33%' : order.status === 'preparing' ? '66%' : '100%' }}
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
