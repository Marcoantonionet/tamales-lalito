const PRECIO_UNITARIO = 20;
const PRODUCTOS_CONFIG = {
    'tamal_rajas': 'Tamal de Rajas con Queso',
    'tamal_verdes': 'Tamal Verde',
    'tamal_dulces': 'Tamal Dulce (Rosa)',
    'tamal_pina': 'Tamal de Piña',
    'tamal_zarzamora': 'Tamal de Zarzamora',
    'atole_chocolate': 'Atole de Chocolate',
    'atole_arroz': 'Atole de Arroz con Leche',
    'atole_champurrado': 'Champurrado'
};

let mensajeWhatsAppGlobal = ""; 

function changeQty(id, change) {
    const input = document.getElementById(id);
    if (!input) return;
    let currentVal = parseInt(input.value) || 0;
    currentVal += change;
    if (currentVal < 0) currentVal = 0;
    input.value = currentVal;
    updateTotal();
}

function updateTotal() {
    const inputs = document.querySelectorAll('.qty-input');
    let totalProductos = 0;

    inputs.forEach(input => {
        let val = parseInt(input.value) || 0;
        if (val < 0) {
            val = 0;
            input.value = 0;
        }
        totalProductos += val;
    });

    const totalDinero = totalProductos * PRECIO_UNITARIO;

    const resCant = document.getElementById('resumen-cantidades');
    const resTotal = document.getElementById('resumen-total');
    
    if (resCant) resCant.innerText = `${totalProductos} pzas`;
    if (resTotal) resTotal.innerText = `$${totalDinero.toFixed(2)}`;
}

function procesarPedido() {
    const nombreInput = document.getElementById('nombre');
    const direccionInput = document.getElementById('direccion');
    
    if (!nombreInput || !direccionInput) return;
    
    const nombre = nombreInput.value.trim();
    const direccion = direccionInput.value.trim();
    
    if (!nombre || !direccion) {
        alert("Por favor, llena tu nombre y dirección antes de continuar.");
        return;
    }

    let listaTicketHtml = "";
    let textoProductosMensaje = "";
    let totalProductos = 0;

    for (const [id, nombreProd] of Object.entries(PRODUCTOS_CONFIG)) {
        const input = document.getElementById(id);
        if (input) {
            const cant = parseInt(input.value) || 0;
            if (cant > 0) {
                const subtotal = cant * PRECIO_UNITARIO;
                listaTicketHtml += `<li><span>${cant}x ${nombreProd}</span> <span>$${subtotal.toFixed(2)}</span></li>`;
                textoProductosMensaje += `- ${cant}x ${nombreProd}\n`;
                totalProductos += cant;
            }
        }
    }

    if (totalProductos === 0) {
        alert("Por favor, añade al menos un tamal o atole a tu pedido.");
        return;
    }

    const totalDinero = totalProductos * PRECIO_UNITARIO;

    document.getElementById('ticket-nombre').innerText = nombre;
    document.getElementById('ticket-direccion').innerText = direccion;
    document.getElementById('ticket-productos').innerHTML = listaTicketHtml;
    document.getElementById('ticket-total').innerText = `$${totalDinero.toFixed(2)}`;

    let mensaje = `*Nuevo Pedido - Tamales Lalito*\n\n`;
    mensaje += `*Cliente:* ${nombre}\n`;
    mensaje += `*Dirección:* ${direccion}\n\n`;
    mensaje += `*Detalle del Pedido:*\n${textoProductosMensaje}\n`;
    mensaje += `*Total a pagar:* $${totalDinero.toFixed(2)}`;
    
    mensajeWhatsAppGlobal = encodeURIComponent(mensaje);
    document.getElementById('modal-ticket').style.display = 'flex';
}

function cerrarTicket() {
    document.getElementById('modal-ticket').style.display = 'none';
}

function confirmarYEnviar() {
    const telefono = "5545784476"; 
    window.open(`https://wa.me{telefono}?text=${mensajeWhatsAppGlobal}`, '_blank');
    cerrarTicket();
}

