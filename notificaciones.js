// ==================== SISTEMA DE NOTIFICACIONES ====================

// Estructura de una notificación
// {
//     id: "notif_123456",
//     eventoId: "evt_001",
//     titulo: "VAN VAN - Concierto Especial",
//     mensaje: "en 30 minutos",
//     direccion: "Pabellón Cuba, Calle 23",
//     fecha: "2025-01-15T18:00:00",
//     leida: false,
//     tipo: "recordatorio" // "recordatorio" o "anticipacion"
// }

let notificaciones = [];
let permisoNotificaciones = false;
let intervaloNotificaciones = null;

// Cargar notificaciones guardadas
function cargarNotificaciones() {
    const guardadas = localStorage.getItem('notificaciones');
    if (guardadas) {
        notificaciones = JSON.parse(guardadas);
    } else {
        notificaciones = [];
    }
    actualizarContadorNotificaciones();
}

// Guardar notificaciones
function guardarNotificaciones() {
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    actualizarContadorNotificaciones();
}

// Solicitar permiso para notificaciones del navegador
async function solicitarPermisoNotificaciones() {
    if (!("Notification" in window)) {
        console.log("Este navegador no soporta notificaciones");
        return false;
    }
    
    if (Notification.permission === "granted") {
        permisoNotificaciones = true;
        return true;
    }
    
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        permisoNotificaciones = permission === "granted";
        if (permisoNotificaciones) {
            console.log("✅ Permiso de notificaciones concedido");
        }
        return permisoNotificaciones;
    }
    
    return false;
}

// Enviar notificación del navegador
function enviarNotificacionNavegador(titulo, cuerpo, eventoId) {
    if (!permisoNotificaciones) return;
    
    const options = {
        body: cuerpo,
        icon: "resources/aguacero_cuba_logo_trasnparente.png",
        badge: "resources/aguacero_cuba_logo_trasnparente.png",
        tag: eventoId,
        requireInteraction: false,
        silent: false
    };
    
    const notification = new Notification(titulo, options);
    
    notification.onclick = function() {
        window.focus();
        window.location.href = `detallesEvento.html?id=${eventoId}`;
        notification.close();
    };
}

// Agregar notificación a la lista
function agregarNotificacion(evento, tipo, minutosAntes) {
    // Verificar si ya existe una notificación similar para este evento
    const yaExiste = notificaciones.some(n => n.eventoId === evento.id && n.tipo === tipo);
    if (yaExiste) return;
    
    const ahora = new Date();
    const fechaEvento = new Date(evento.fechaInicio);
    let mensaje = "";
    let fechaNotificacion = new Date(fechaEvento);
    
    if (tipo === "anticipacion") {
        fechaNotificacion.setDate(fechaEvento.getDate() - 7);
        mensaje = `📅 en 7 días · ${evento.sede || "Ver ubicación"}`;
    } else {
        fechaNotificacion.setMinutes(fechaEvento.getMinutes() - minutosAntes);
        if (minutosAntes === 30) {
            mensaje = `⏰ en 30 minutos · ${evento.sede || "Ver ubicación"}`;
        } else if (minutosAntes === 60) {
            mensaje = `⏰ en 1 hora · ${evento.sede || "Ver ubicación"}`;
        } else {
            mensaje = `⏰ próximamente · ${evento.sede || "Ver ubicación"}`;
        }
    }
    
    // Si la fecha de notificación ya pasó, no agregar
    if (ahora > fechaNotificacion) return;
    
    const nuevaNotificacion = {
        id: `notif_${Date.now()}_${evento.id}`,
        eventoId: evento.id,
        titulo: evento.nombre,
        mensaje: mensaje,
        direccion: evento.ubicacion || evento.direccion || "Ubicación no especificada",
        fecha: fechaNotificacion.toISOString(),
        leida: false,
        tipo: tipo
    };
    
    notificaciones.push(nuevaNotificacion);
    guardarNotificaciones();
    
    // Programar notificación del navegador
    const tiempoHastaNotif = fechaNotificacion.getTime() - ahora.getTime();
    if (tiempoHastaNotif > 0 && tiempoHastaNotif < 7 * 24 * 60 * 60 * 1000) {
        setTimeout(() => {
            enviarNotificacionNavegador(
                `🎭 ${evento.nombre}`,
                mensaje,
                evento.id
            );
        }, tiempoHastaNotif);
    }
}

// Generar notificaciones para todos los eventos futuros
function generarNotificacionesParaEventos() {
    const usuario = getUsuarioActual();
    if (!usuario) return;
    
    const preferenciasNotificacion = usuario.preferenciasNotificacion || {
        sieteDias: true,
        treintaMinutos: true,
        unaHora: false
    };
    
    const eventos = getEventosFuturos();
    const preferenciasUsuario = usuario.preferencias || [];
    
    eventos.forEach(evento => {
        // Solo notificar si el evento está en las preferencias del usuario
        if (preferenciasUsuario.length > 0 && !preferenciasUsuario.includes(evento.categoria)) {
            return;
        }
        
        if (preferenciasNotificacion.sieteDias) {
            agregarNotificacion(evento, "anticipacion", 7 * 24 * 60);
        }
        if (preferenciasNotificacion.treintaMinutos) {
            agregarNotificacion(evento, "recordatorio", 30);
        }
        if (preferenciasNotificacion.unaHora) {
            agregarNotificacion(evento, "recordatorio", 60);
        }
    });
}

// Limpiar notificaciones antiguas (más de 30 días)
function limpiarNotificacionesAntiguas() {
    const ahora = new Date();
    const treintaDiasAtras = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const notificacionesFiltradas = notificaciones.filter(n => {
        const fechaNotif = new Date(n.fecha);
        return fechaNotif > treintaDiasAtras;
    });
    
    if (notificacionesFiltradas.length !== notificaciones.length) {
        notificaciones = notificacionesFiltradas;
        guardarNotificaciones();
    }
}

// Marcar todas como leídas
function marcarTodasComoLeidas() {
    notificaciones.forEach(n => n.leida = true);
    guardarNotificaciones();
}

// Obtener notificaciones no leídas
function getNotificacionesNoLeidas() {
    return notificaciones.filter(n => !n.leida);
}

// Obtener contador (máximo 99)
function getContadorNotificaciones() {
    const noLeidas = getNotificacionesNoLeidas().length;
    return noLeidas > 99 ? "+99" : noLeidas;
}

// Actualizar UI del contador
function actualizarContadorNotificaciones() {
    const contador = document.getElementById('notifCounter');
    if (!contador) return;
    
    const noLeidas = getNotificacionesNoLeidas().length;
    if (noLeidas === 0) {
        contador.style.display = 'none';
    } else {
        contador.style.display = 'flex';
        contador.textContent = noLeidas > 99 ? "+99" : noLeidas;
    }
}

// Renderizar panel de notificaciones
function renderizarPanelNotificaciones() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    const notificacionesOrdenadas = [...notificaciones].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
    );
    
    if (notificacionesOrdenadas.length === 0) {
        panel.innerHTML = `
            <div class="notif-empty">
                <span>🔔</span>
                <p>No hay notificaciones</p>
                <small>Las notificaciones de tus eventos favoritos aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    panel.innerHTML = notificacionesOrdenadas.map(notif => `
        <div class="notif-item ${notif.leida ? '' : 'notif-no-leida'}" data-evento-id="${notif.eventoId}" data-notif-id="${notif.id}">
            <div class="notif-icon">${notif.tipo === 'anticipacion' ? '📅' : '⏰'}</div>
            <div class="notif-content">
                <div class="notif-title">${notif.titulo}</div>
                <div class="notif-message">${notif.mensaje}</div>
                <div class="notif-location">📍 ${notif.direccion.substring(0, 50)}${notif.direccion.length > 50 ? '...' : ''}</div>
                <div class="notif-time">${formatFechaRelativa(notif.fecha)}</div>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a las notificaciones
    document.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventoId = item.getAttribute('data-evento-id');
            const notifId = item.getAttribute('data-notif-id');
            
            // Marcar como leída
            const notif = notificaciones.find(n => n.id === notifId);
            if (notif && !notif.leida) {
                notif.leida = true;
                guardarNotificaciones();
            }
            
            window.location.href = `detallesEvento.html?id=${eventoId}`;
        });
    });
}

function formatFechaRelativa(fechaStr) {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);
    
    if (diffMin < 1) return "Ahora mismo";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Inicializar sistema de notificaciones
function initNotificationsSystem() {
    cargarNotificaciones();
    limpiarNotificacionesAntiguas();
    
    // Solicitar permiso si el usuario está logueado
    const usuario = getUsuarioActual();
    if (usuario) {
        solicitarPermisoNotificaciones();
        generarNotificacionesParaEventos();
    }
    
    // Ejecutar cada hora para generar nuevas notificaciones
    if (intervaloNotificaciones) clearInterval(intervaloNotificaciones);
    intervaloNotificaciones = setInterval(() => {
        generarNotificacionesParaEventos();
        limpiarNotificacionesAntiguas();
        actualizarContadorNotificaciones();
    }, 60 * 60 * 1000);
}

// Función para alternar el panel de notificaciones
function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    const isVisible = panel.classList.contains('active');
    
    if (isVisible) {
        panel.classList.remove('active');
    } else {
        renderizarPanelNotificaciones();
        panel.classList.add('active');
        // Marcar como leídas al abrir
        marcarTodasComoLeidas();
        actualizarContadorNotificaciones();
        
        // Cerrar al hacer clic fuera
        const closeHandler = (e) => {
            if (!panel.contains(e.target) && !document.getElementById('notificationsBtn')?.contains(e.target)) {
                panel.classList.remove('active');
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
    }
}