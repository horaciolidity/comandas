import React from 'react';
import useOrderStore from '../store/useOrderStore';
import {
    DollarSign,
    TrendingUp,
    Activity,
    Clock,
    ArrowUpRight,
    Filter,
    Download,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboard() {
    const history = useOrderStore((state) => state.history);

    const totalSales = history.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = history.length;
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    const cards = [
        { label: 'Bruto de Ventas', value: `$${totalSales.toFixed(2)}`, desc: '+12.5% vs ayer', icon: <DollarSign />, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
        { label: 'Pedidos Entregados', value: totalOrders, desc: '98% eficiencia', icon: <TrendingUp />, color: 'text-brand-red', bg: 'bg-brand-red/10' },
        { label: 'Ticket Promedio', value: `$${avgTicket.toFixed(2)}`, desc: 'Estable', icon: <Activity />, color: 'text-accent-green', bg: 'bg-accent-green/10' },
        { label: 'Tiempo de Preparación', value: '14m', desc: '-2m vs ayer', icon: <Clock />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    return (
        <div className="flex flex-col h-full gap-10 overflow-y-auto pr-2 custom-scrollbar pb-20">

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((c, idx) => (
                    <div key={idx} className="pos-card p-8 rounded-[2.5rem] flex flex-col gap-6 group hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110", c.bg, c.color)}>
                                {c.icon}
                            </div>
                            <div className="bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">Live</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-2">{c.label}</p>
                            <h4 className="text-4xl font-black text-white tracking-tighter mb-1">{c.value}</h4>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", c.bg, c.color)}>{c.desc}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-10">

                {/* Sales Log Table */}
                <div className="2xl:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Historial de <span className="text-brand-yellow">Caja</span></h3>
                        <div className="flex gap-3">
                            <button className="p-3 bg-surface-2 rounded-xl text-zinc-500 hover:text-white"><Filter className="w-5 h-5" /></button>
                            <button className="p-3 bg-surface-2 rounded-xl text-zinc-500 hover:text-white"><Download className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="pos-card rounded-[2.5rem] overflow-hidden border-white/5 bg-surface-1/50 backdrop-blur-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Transacción</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Timestamp</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Mesa</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Monto Final</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.length === 0 ? (
                                    <tr><td colSpan="4" className="px-10 py-24 text-center text-zinc-600 font-bold uppercase italic tracking-widest text-sm opacity-20">No se registran ventas</td></tr>
                                ) : (
                                    [...history].reverse().map(order => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/5 text-brand-yellow">
                                                        ID
                                                    </div>
                                                    <span className="font-mono text-xs text-white/50 tracking-widest">#{order.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white">{format(new Date(order.deliveredAt), 'HH:mm:ss')}</span>
                                                    <span className="text-[10px] text-zinc-600 font-bold">{format(new Date(order.deliveredAt), 'dd MMMM yyyy', { locale: es })}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="px-4 py-2 bg-surface-2 rounded-2xl text-xs font-black text-zinc-400 group-hover:text-white transition-colors">
                                                    MESA {order.tableNumber}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className="text-2xl font-black text-brand-yellow italic tracking-tighter">${order.total.toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* High Performance Products */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Hot <span className="text-brand-red">Items</span></h3>
                    <div className="pos-card rounded-[2.5rem] bg-brand-red/5 border-brand-red/10 p-10 space-y-8">
                        <div className="space-y-6">
                            {history.length === 0 ? (
                                <div className="py-20 text-center text-zinc-700 italic font-black uppercase tracking-widest">Esperando Ventas</div>
                            ) : (
                                Object.values(history.flatMap(o => o.items).reduce((acc, item) => {
                                    if (!acc[item.id]) acc[item.id] = { ...item, q: 0 };
                                    acc[item.id].q += item.quantity;
                                    return acc;
                                }, {}))
                                    .sort((a, b) => b.q - a.q)
                                    .slice(0, 5)
                                    .map((item, id) => (
                                        <div key={item.id} className="flex items-center gap-6 group">
                                            <div className="w-16 h-16 bg-surface-2 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:scale-110">
                                                {item.img}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-end mb-2">
                                                    <h5 className="text-xs font-black uppercase tracking-tight text-white">{item.name}</h5>
                                                    <span className="text-xs font-black text-brand-red">{item.q} packs</span>
                                                </div>
                                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-red rounded-full" style={{ width: `${Math.min(100, (item.q / totalOrders) * 60)}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <button className="pos-btn w-full h-16 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:border-white/20">
                                Exportar Reporte Mensual
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
