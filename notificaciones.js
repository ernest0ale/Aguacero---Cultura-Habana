// ==================== SISTEMA DE NOTIFICACIONES RENOVADO ====================

let permisoNotificaciones = false;
let panelAbierto = false;

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

// Enviar notificación del navegador (solo para recordatorios manuales o preferencias)
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

// Generar lista de notificaciones en tiempo real
function generarNotificaciones() {
    const usuario = getUsuarioActual();
    if (!usuario) return [];
    
    const preferenciasNotificacion = usuario.preferenciasNotificacion || {
        sieteDias: true,
        treintaMinutos: true,
        unaHora: false
    };
    
    const eventos = getEventosFuturos();
    const preferenciasCategorias = usuario.preferencias || [];
    const recordatoriosIds = usuario.recordatorios || [];
    const notificaciones = [];
    const ahora = new Date();
    
    // Procesar cada evento futuro
    eventos.forEach(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        const diffDias = Math.ceil((fechaEvento - ahora) / (1000 * 60 * 60 * 24));
        const diffMinutos = Math.ceil((fechaEvento - ahora) / (1000 * 60));
        
        // Verificar si el evento es de interés (categoría favorita O recordatorio manual)
        const esInteres = preferenciasCategorias.includes(evento.categoria) || recordatoriosIds.includes(evento.id);
        if (!esInteres) return;
        
        // Notificación de 7 días
        if (preferenciasNotificacion.sieteDias && diffDias === 7) {
            notificaciones.push({
                id: `${evento.id}_7dias`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 7 días`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 7 * 24 * 60 * 60 * 1000),
                leida: false,
                tipo: "anticipacion"
            });
        }

        // Notificación de 1 día
        if (preferenciasNotificacion.unDia && diffDias === 1) {
            notificaciones.push({
                id: `${evento.id}_1dia`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza mañana`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 24 * 60 * 60 * 1000),
                leida: false,
                tipo: "anticipacion"
            });
        }
        
        // Notificación de 1 hora
        if (preferenciasNotificacion.unaHora && diffMinutos === 60) {
            notificaciones.push({
                id: `${evento.id}_1hora`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 1 hora`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 60 * 60 * 1000),
                leida: false,
                tipo: "recordatorio"
            });
        }
        
        // Notificación de 30 minutos
        if (preferenciasNotificacion.treintaMinutos && diffMinutos === 30) {
            notificaciones.push({
                id: `${evento.id}_30min`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 30 minutos`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 30 * 60 * 1000),
                leida: false,
                tipo: "recordatorio"
            });
        }
    });
    
    // Ordenar por fecha (las más próximas primero)
    notificaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    // Enviar notificaciones del navegador para las que ya pasaron (simulación)
    notificaciones.forEach(notif => {
        const fechaNotif = new Date(notif.fecha);
        if (fechaNotif <= ahora && (fechaNotif.getTime() + 60000) > ahora) { // Margen de 1 minuto
            enviarNotificacionNavegador(notif.titulo, notif.mensaje, notif.eventoId);
        }
    });
    
    return notificaciones;
}

// Actualizar contador en la UI
function actualizarContadorNotificaciones() {
    const contador = document.getElementById('notifCounter');
    if (!contador) return;
    
    // Si el panel está abierto, no mostrar contador
    if (panelAbierto) {
        contador.style.display = 'none';
        return;
    }
    
    const notificaciones = generarNotificaciones();
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    
    if (noLeidas === 0) {
        contador.style.display = 'none';
    } else {
        contador.style.display = 'flex';
        // Mostrar +15 si es mayor a 15
        contador.textContent = noLeidas > 15 ? "+15" : noLeidas;
    }
}

// Renderizar panel de notificaciones
function renderizarPanelNotificaciones() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    const notificaciones = generarNotificaciones();
    
    if (notificaciones.length === 0) {
        panel.innerHTML = `
            <div class="notif-empty">
                <span>🔔</span>
                <p>No hay notificaciones</p>
                <small>Las notificaciones de tus eventos favoritos aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    panel.innerHTML = notificaciones.map(notif => `
        <div class="notif-item ${notif.leida ? '' : 'notif-no-leida'}" data-evento-id="${notif.eventoId}" data-notif-id="${notif.id}">
            <div class="notif-content">
                <div class="notif-title">${notif.titulo}</div>
                <div class="notif-message">${notif.mensaje}</div>
                <div class="notif-location"> ${notif.direccion ? notif.direccion.substring(0, 50) : 'Ubicación no especificada'}${notif.direccion && notif.direccion.length > 50 ? '...' : ''}</div>
                <div class="notif-time">${formatFechaRelativa(notif.fecha)}</div>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a las notificaciones
    document.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventoId = item.getAttribute('data-evento-id');
            if (eventoId) {
                window.location.href = `detallesEvento.html?id=${eventoId}`;
            }
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

// Función para alternar el panel de notificaciones
function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    panelAbierto = !panelAbierto;
    
    if (panelAbierto) {
        renderizarPanelNotificaciones();
        panel.classList.add('active');
        // Marcar todas como leídas (virtualmente)
        actualizarContadorNotificaciones(); // Esto ocultará el contador
        
        // Cerrar al hacer clic fuera
        const closeHandler = (e) => {
            if (!panel.contains(e.target) && !document.getElementById('notificationsBtn')?.contains(e.target)) {
                panel.classList.remove('active');
                panelAbierto = false;
                actualizarContadorNotificaciones(); // Restaurar contador si hay nuevas
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
    } else {
        panel.classList.remove('active');
        actualizarContadorNotificaciones();
    }
}

// Inicializar sistema de notificaciones
function initNotificationsSystem() {
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNotificationsPanel();
        });
    }
    
    // Solicitar permiso si el usuario está logueado
    const usuario = getUsuarioActual();
    if (usuario) {
        solicitarPermisoNotificaciones();
    }
    
    // Actualizar contador cada minuto (para mantener sincronizado)
    setInterval(() => {
        if (!panelAbierto) {
            actualizarContadorNotificaciones();
        }
    }, 60000);
    
    actualizarContadorNotificaciones();
}