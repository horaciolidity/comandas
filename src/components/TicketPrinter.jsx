import React from 'react';
import { ShoppingBag, Printer, ChefHat } from 'lucide-react';

export default function TicketPrinter({ order }) {
    const handlePrint = () => {
        const printContent = document.getElementById(`ticket-${order.id}`);
        const win = window.open('', '', 'width=400,height=600');
        win.document.write(`
      <html>
        <head>
          <title>Ticket Mesa ${order.tableNumber}</title>
          <style>
            @page { size: 80mm 200mm; margin: 0; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              width: 80mm; 
              padding: 10px; 
              margin: 0 auto;
              color: black;
              background: white;
            }
            .header { text-align: center; border-bottom: 2px dashed black; padding-bottom: 10px; margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; }
            .total { border-top: 2px dashed black; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px solid #ccc; padding-top: 10px; }
            .badge { background: black; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>FAST RESTO POS</h3>
            <p>ORDEN: #${order.id.slice(0, 5).toUpperCase()}</p>
            <div class="badge">Mesa: ${order.tableNumber}</div>
            <p>${new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
          <div class="content">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            TOTAL: $${order.total?.toFixed(2) || (order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0)).toFixed(2)}
          </div>
          <div class="footer">
            *** COPIA COCINA ***<br>
            ¡Buen Provecho!
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
        win.document.close();
    };

    return (
        <button
            onClick={handlePrint}
            className="pos-btn bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl flex items-center gap-2 group transition-all"
        >
            <Printer className="w-5 h-5 group-hover:scale-110" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Imprimir Ticket</span>
        </button>
    );
}
