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

    document.getElementById('resumen-cantidades').innerText = `${totalProductos} pzas`;
    document.getElementById('resumen-total').innerText = `$${totalDinero.toFixed(2)}`;
}

function procesarPedido() {
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    
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
    const telefono = "5643804660"; 
    window.open(`https://wa.me{telefono}?text=${mensajeWhatsAppGlobal}`, '_blank');
    cerrarTicket();
}
// Contador de visitas automático usando CountAPI
function inicializarContador() {
    // Creamos una clave única basada en tu enlace para que no se mezcle con otras páginas
    const namespace = "marcoantonionet-tamales-lalito";
    const key = "visitas";
    
    fetch(`https://countapi.xyz{namespace}/${key}`)
        .then(res => res.json())
        .then(data => {
            const elemento = document.getElementById('contador-visitas');
            if (elemento) {
                // Formatea el número para que tenga comas (ej. 1,250 visitas)
                elemento.innerText = data.value.toLocaleString();
            }
        })
        .catch(err => {
            // Si el servidor del contador falla temporalmente, muestra un número estático elegante
            const elemento = document.getElementById('contador-visitas');
            if (elemento) elemento.innerText = "1";
        });
}

}

// Ejecuta la función en cuanto la página cargue por completo
window.addEventListener('DOMContentLoaded', inicializarContadorVisitas);
