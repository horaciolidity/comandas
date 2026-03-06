import React from 'react';
import useOrderStore from '../store/useOrderStore';
import { cn } from '../lib/utils';
import {
    Plus,
    Minus,
    ShoppingBag,
    Trash2,
    Check,
    ChevronRight,
    Search,
    LayoutGrid
} from 'lucide-react';

const MENU_ITEMS = [
    { id: 1, name: 'Combo Mega King', price: 15.50, cat: 'Burgers', img: '🍔' },
    { id: 2, name: 'Double Bacon BBQ', price: 12.00, cat: 'Burgers', img: '🥓' },
    { id: 3, name: 'Chicken Deluxe', price: 11.25, cat: 'Burgers', img: '🍗' },
    { id: 4, name: 'Pepperoni Lover', price: 18.00, cat: 'Pizza', img: '🍕' },
    { id: 5, name: 'Veggie Supreme', price: 16.50, cat: 'Pizza', img: '🥦' },
    { id: 6, name: 'Papas Cheddar XL', price: 7.00, cat: 'Sides', img: '🍟' },
    { id: 7, name: 'Coca Cola 1Lt', price: 4.50, cat: 'Drinks', img: '🥤' },
    { id: 8, name: 'Cerveza Patagonia', price: 6.00, cat: 'Drinks', img: '🍺' },
];

const CATS = ['Todos', 'Burgers', 'Pizza', 'Sides', 'Drinks'];

export default function WaiterDashboard() {
    const [activeCat, setActiveCat] = React.useState('Todos');
    const [currentOrder, setCurrentOrder] = React.useState([]);
    const [tableNum, setTableNum] = React.useState('');
    const [showMobileCart, setShowMobileCart] = React.useState(false);

    const addOrder = useOrderStore((state) => state.addOrder);

    const filtered = activeCat === 'Todos' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.cat === activeCat);

    const updateQty = (item, delta) => {
        setCurrentOrder(curr => {
            const existing = curr.find(i => i.id === item.id);
            if (!existing && delta > 0) return [...curr, { ...item, quantity: 1 }];
            return curr.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0);
        });
    };

    const totals = currentOrder.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    const handleSend = () => {
        if (!tableNum || currentOrder.length === 0) return;
        addOrder(currentOrder, tableNum);
        setCurrentOrder([]);
        setTableNum('');
        setShowMobileCart(false);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-10">

            {/* Main Terminal Grid */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8 overflow-hidden min-w-0">

                {/* Categories Bar */}
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar shrink-0">
                    {CATS.map(c => (
                        <button
                            key={c}
                            onClick={() => setActiveCat(c)}
                            className={cn(
                                "px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all",
                                activeCat === c
                                    ? "bg-brand-yellow text-black shadow-xl shadow-brand-yellow/20 -translate-y-1"
                                    : "bg-surface-2 text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start pb-10">
                    {filtered.map(item => {
                        const inCart = currentOrder.find(i => i.id === item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => updateQty(item, 1)}
                                className={cn(
                                    "pos-card rounded-[2rem] p-6 lg:p-8 flex flex-col items-center text-center cursor-pointer relative overflow-hidden",
                                    inCart ? "border-brand-yellow/50 ring-2 ring-brand-yellow/20" : ""
                                )}
                            >
                                {inCart && (
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-brand-yellow text-black rounded-full flex items-center justify-center font-black text-xs animate-bounce">
                                        {inCart.quantity}
                                    </div>
                                )}
                                <div className="text-5xl lg:text-6xl mb-6 transform group-hover:scale-110 transition-transform">
                                    {item.img}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-tight leading-tight mb-2 h-10 line-clamp-2">
                                    {item.name}
                                </h3>
                                <span className="text-brand-yellow font-black text-xl lg:text-2xl">${item.price.toFixed(2)}</span>

                                {inCart && (
                                    <div className="mt-4 flex items-center gap-2 w-full pt-4 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => updateQty(item, -1)} className="flex-1 h-12 rounded-xl bg-surface-3 flex items-center justify-center hover:bg-brand-red transition-all">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => updateQty(item, 1)} className="flex-1 h-12 rounded-xl bg-surface-3 flex items-center justify-center hover:bg-brand-yellow hover:text-black transition-all">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* POS Checkout Sidebar (PC Only) */}
            <div className="hidden lg:flex w-[380px] flex-col bg-surface-1 border border-white/5 rounded-[2.5rem] p-8 shrink-0 h-full shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-yellow/10 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-brand-yellow" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic">Estado</h3>
                    </div>
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-2 flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-500 uppercase px-2">Mesa</span>
                        <input
                            type="number"
                            className="w-10 text-center bg-brand-yellow text-black font-black rounded-lg py-1 focus:outline-none"
                            value={tableNum}
                            onChange={(e) => setTableNum(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar mb-8">
                    {currentOrder.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                            <LayoutGrid className="w-20 h-20 mb-4" />
                            <p className="font-black uppercase text-sm">Selecciona productos</p>
                        </div>
                    ) : (
                        currentOrder.map(i => (
                            <div key={i.id} className="flex items-center gap-4 bg-surface-2 p-4 rounded-3xl group animate-slide-up">
                                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl">
                                    {i.img}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-black uppercase text-white leading-none mb-1">{i.name}</h4>
                                    <span className="text-xs font-bold text-brand-yellow">x{i.quantity} — ${(i.price * i.quantity).toFixed(2)}</span>
                                </div>
                                <button onClick={() => updateQty(i, -999)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-brand-red transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Total Orden</span>
                        <span className="text-5xl font-black italic tracking-tighter text-brand-yellow">${totals.toFixed(2)}</span>
                    </div>
                    <button
                        disabled={!tableNum || currentOrder.length === 0}
                        onClick={handleSend}
                        className={cn(
                            "pos-btn w-full h-20 rounded-[1.5rem] !text-lg",
                            tableNum && currentOrder.length > 0 ? "pos-btn-yellow" : "bg-surface-3 text-zinc-600 grayscale"
                        )}
                    >
                        Mandar a Cocina
                        <ChevronRight className="w-6 h-6 ml-2" />
                    </button>
                </div>
            </div>

            {/* Floating Mobile Order Button */}
            <div className="lg:hidden fixed bottom-24 right-6 left-6 z-50 pointer-events-none">
                <button
                    onClick={() => setShowMobileCart(true)}
                    className={cn(
                        "pos-btn w-full h-16 rounded-2xl pointer-events-auto shadow-2xl flex items-center justify-between px-6 transition-all",
                        currentOrder.length > 0 ? "bg-brand-yellow text-black" : "bg-zinc-800 text-zinc-500 scale-90 opacity-0"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6" />
                        <span className="font-black text-sm uppercase">{currentOrder.length} Items</span>
                    </div>
                    <span className="font-black text-lg">${totals.toFixed(2)}</span>
                </button>
            </div>

            {/* Mobile Cart Sheet */}
            {showMobileCart && (
                <div className="lg:hidden fixed inset-0 z-[100] flex flex-col animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowMobileCart(false)} />
                    <div className="mt-auto h-[80vh] bg-surface-1 rounded-t-[3rem] relative z-10 flex flex-col p-8 mobile-sheet border-t border-brand-yellow/30 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
                        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black uppercase italic">Revisar <span className="text-brand-yellow">Pedido</span></h3>
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-2 flex items-center gap-3">
                                <span className="text-[10px] font-black text-zinc-500 uppercase px-2">Mesa</span>
                                <input
                                    type="number"
                                    className="w-12 text-center bg-brand-yellow text-black font-black rounded-lg py-1"
                                    value={tableNum}
                                    onChange={(e) => setTableNum(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-8">
                            {currentOrder.map(i => (
                                <div key={i.id} className="flex items-center gap-4 bg-surface-2 p-5 rounded-[2rem] border border-white/5">
                                    <div className="text-3xl">{i.img}</div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black uppercase leading-none mb-1">{i.name}</h4>
                                        <span className="text-xs font-bold text-brand-yellow">x{i.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(i, -1)} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => updateQty(i, 1)} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">A pagar</span>
                                <span className="text-4xl font-black text-brand-yellow">${totals.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!tableNum}
                                className="pos-btn w-full h-16 rounded-2xl bg-brand-yellow text-black"
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
