import React from 'react';
import WaiterDashboard from './components/WaiterDashboard';
import KitchenDashboard from './components/KitchenDashboard';
import AdminDashboard from './components/AdminDashboard';
import {
  ShoppingBag,
  ChefHat,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = React.useState('waiter');

  const NavItem = ({ id, icon: Icon, label, activeColor }) => (
    <button
      onClick={() => setView(id)}
      className={cn(
        "flex flex-col lg:flex-row items-center gap-2 lg:gap-4 px-4 py-3 lg:px-6 lg:py-4 rounded-3xl transition-all duration-300 group",
        view === id
          ? `bg-surface-3 lg:${activeColor} text-white`
          : "text-zinc-500 hover:text-white"
      )}
    >
      <div className={cn(
        "p-2 rounded-2xl transition-all",
        view === id ? "bg-brand-red lg:bg-transparent" : "group-hover:bg-surface-3"
      )}>
        <Icon className={cn("w-6 h-6 lg:w-5 lg:h-5")} />
      </div>
      <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{label}</span>
      {view === id && <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-white ml-auto" />}
    </button>
  );

  return (
    <div className="h-screen w-screen bg-brand-dark overflow-hidden flex flex-col lg:flex-row font-sans">

      {/* PC Side Navigation */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-surface-1 border-r border-white/5 p-6 shrink-0">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center rotate-3 shadow-xl">
            <span className="text-2xl font-black text-black">F</span>
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Fast<span className="text-brand-yellow">Resto</span></h1>
            <span className="text-[10px] font-black text-brand-red uppercase tracking-widest mt-1 block">POS System v1.0</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <NavItem id="waiter" icon={ShoppingBag} label="Mozo / POS" activeColor="bg-brand-yellow" />
          <NavItem id="kitchen" icon={ChefHat} label="Monitor Cocina" activeColor="bg-brand-red" />
          <NavItem id="admin" icon={BarChart3} label="Dashboard" activeColor="bg-zinc-800" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
          <button className="flex items-center gap-4 px-6 py-4 rounded-3xl text-zinc-500 hover:text-white hover:bg-surface-2 transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Config</span>
          </button>
          <div className="bg-surface-2 p-4 rounded-[2rem] flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-black">
                <UserCircle className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-white">Admin 01</span>
                <span className="text-[8px] font-bold text-zinc-500">CONECTADO</span>
              </div>
            </div>
            <button className="text-zinc-500 hover:text-brand-red">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        {/* Top Header - Contextual */}
        <header className="h-16 lg:h-24 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg lg:text-3xl font-black uppercase italic tracking-tighter">
              {view === 'waiter' && <><span className="text-brand-yellow">Nueva</span> Comanda</>}
              {view === 'kitchen' && <><span className="text-brand-red">Monitor</span> Cocina</>}
              {view === 'admin' && <>Finanzas & <span className="text-brand-yellow">Stats</span></>}
            </h2>
            <span className="text-[8px] lg:text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              Restaurante La Casona • {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-4 bg-surface-2 px-6 py-3 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Servidor OK</span>
            </div>
            <button className="lg:hidden w-10 h-10 flex items-center justify-center bg-surface-2 rounded-xl">
              <Bell className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden px-4 lg:px-10 pb-20 lg:pb-10">
          <div className="h-full animate-pos-in">
            {view === 'waiter' && <WaiterDashboard />}
            {view === 'kitchen' && <KitchenDashboard />}
            {view === 'admin' && <AdminDashboard />}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-1 border-t border-white/5 flex items-center justify-around px-2 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => setView('waiter')} className={cn("flex-1 flex flex-col items-center gap-1", view === 'waiter' ? "text-brand-yellow" : "text-zinc-600")}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Venta</span>
        </button>
        <button onClick={() => setView('kitchen')} className={cn("flex-1 flex flex-col items-center gap-1", view === 'kitchen' ? "text-brand-red" : "text-zinc-600")}>
          <ChefHat className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Cocina</span>
        </button>
        <button onClick={() => setView('admin')} className={cn("flex-1 flex flex-col items-center gap-1", view === 'admin' ? "text-white" : "text-zinc-600")}>
          <BarChart3 className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Stats</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 text-zinc-600">
          <Settings className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Admin</span>
        </button>
      </nav>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-yellow/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
