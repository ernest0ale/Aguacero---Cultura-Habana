// data.js - Base de datos local con localStorage y sistema de eliminación

const ADMIN_EMAILS = [
    "organizador@culturahabana.com",  // Email del administrador principal
    "admin0428@knowwhere.com",        // Tu email personal
    "adcuenta@redessociales.com",   // Email de la cuenta de redes
    "admincreador@culturahabana.cu"
];

function esAdministrador(usuario) {
    if (!usuario) return false;
    return ADMIN_EMAILS.includes(usuario.email);
}

// Solo para crear/editar eventos
function puedeCrearEvento(usuario) {
    return esAdministrador(usuario);
}

function puedeEditarEvento(usuario, evento) {
    return esAdministrador(usuario);
}

function puedeEliminarEvento(usuario, evento) {
    return esAdministrador(usuario);
}

const eventosEjemplo = [
    {
        id: "evt_001",
        nombre: "VAN VAN - Concierto Especial",
        categoria: "Conciertos",
        descripcion: "La leyenda de la música cubana en concierto único.",
        fechaInicio: "2026-05-20",
        fechaFin: "2026-05-20",
        horaInicio: "21:00",
        horaFin: "02:00",
        precio: 500,
        ubicacion: "Pabellón Cuba, Calle 23 e/ M y N, Vedado",
        sede: "Pabellón Cuba",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 23 # 59, Vedado",
        lat: 23.1395,
        lng: -82.3824,
        poster: "https://picsum.photos/id/30/400/300",
        organizador: "Empresa de Conciertos",
        telefono: "+53 55550001",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_002",
        nombre: "Lachy Fortuna - Session Especial",
        categoria: "Farándula",
        descripcion: "El ex-charanguero presenta su nuevo proyecto musical.",
        fechaInicio: "2026-05-22",
        fechaFin: "2026-05-22",
        horaInicio: "22:00",
        horaFin: "03:00",
        precio: 350,
        ubicacion: "Casa de la Música, Miramar",
        sede: "Casa de la Música",
        municipio: "Playa",
        direccion: "Calle 20 e/ 35 y 37, Miramar",
        lat: 23.1184,
        lng: -82.4257,
        poster: "https://picsum.photos/id/39/400/300",
        organizador: "Casa de la Música",
        telefono: "+53 55550002",
        aptoMenores: false,
        aireLibre: true,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_003",
        nombre: "Taller de Pintura Calcónica",
        categoria: "Talleres",
        descripcion: "Aprende técnicas de pintura calcónica.",
        fechaInicio: "2026-05-25",
        fechaFin: "2026-06-01",
        horaInicio: "09:00",
        horaFin: "12:00",
        precio: 25,
        ubicacion: "Taller de Cultura, Calle 12 # 304",
        sede: "Taller de Cultura",
        municipio: "Centro Habana",
        direccion: "Calle 12 # 304 e/ 5 y 7",
        lat: 23.1321,
        lng: -82.3765,
        poster: "https://picsum.photos/id/96/400/300",
        organizador: "Proyecto Vende",
        telefono: "+53 55550003",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: false,
        creadoPor: "organizador"
    },
    {
        id: "evt_004",
        nombre: "Exposición de Arte Contemporáneo",
        categoria: "Exposiciones",
        descripcion: "Obras de artistas cubanos emergentes.",
        fechaInicio: "2026-05-28",
        fechaFin: "2026-06-18",
        horaInicio: "10:00",
        horaFin: "18:00",
        precio: 0,
        ubicacion: "Factoría Habana, Calle 26 e/ 11 y 13",
        sede: "Factoría Habana",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 26 # 509",
        lat: 23.1234,
        lng: -82.3876,
        poster: "https://picsum.photos/id/20/400/300",
        organizador: "Factoría Habana",
        telefono: "+53 55550004",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: false,
        creadoPor: "organizador"
    },
    {
        id: "evt_005",
        nombre: "Cine Cubano: Retrospectiva",
        categoria: "Cine",
        descripcion: "Funciones especiales de cine cubano.",
        fechaInicio: "2026-06-01",
        fechaFin: "2026-06-08",
        horaInicio: "15:00",
        horaFin: "22:00",
        precio: 100,
        ubicacion: "Cine Yara, Calle 23",
        sede: "Cine Yara",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 23 # 59",
        lat: 23.1385,
        lng: -82.3826,
        poster: "https://picsum.photos/id/1/400/300",
        organizador: "ICAIC",
        telefono: "+53 55550005",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_006",
        nombre: "Festival de Danza",
        categoria: "Danza",
        descripcion: "Compañías de danza de toda la isla.",
        fechaInicio: "2026-06-05",
        fechaFin: "2026-06-07",
        horaInicio: "19:00",
        horaFin: "21:30",
        precio: 800,
        ubicacion: "Gran Teatro de La Habana",
        sede: "Gran Teatro",
        municipio: "Centro Habana",
        direccion: "Paseo del Prado # 458",
        lat: 23.1372,
        lng: -82.3597,
        poster: "https://picsum.photos/id/36/400/300",
        organizador: "Gran Teatro",
        telefono: "+53 55550006",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    }
];

function inicializarDatos() {
    if (!localStorage.getItem('eventos')) {
        localStorage.setItem('eventos', JSON.stringify(eventosEjemplo));
    }
    if (!localStorage.getItem('usuarios')) {
        const usuariosIniciales = [
            { 
                id: "user_001", 
                email: "ocarlos@example.com", 
                password: "123456", 
                nombre: "Carlos Pérez", 
                rol: "usuario", 
                telefono: "+53 51234567", 
                avatarColor: "#2ecc71",
                preferencias: ["Conciertos", "Teatro", "Cine"],
                estado: "activo",
                fechaDesactivacion: null,
                fechaEliminacion: null
            },
            { 
                id: "user_002", 
                email: "usuario@example.com", 
                password: "123456", 
                nombre: "Laura Gómez", 
                rol: "usuario", 
                telefono: "+53 59876543", 
                avatarColor: "#3498db",
                preferencias: ["Danza", "Exposiciones", "Libros"],
                estado: "activo",
                fechaDesactivacion: null,
                fechaEliminacion: null
            },
            { 
                id: "user_003", 
                email: "organizador@culturahabana.com", 
                password: "12345678", 
                nombre: "Aguacero Admin", 
                rol: "usuario", 
                telefono: "+53 51234567", 
                avatarColor: "#3498db",
                preferencias: ["Danza", "Exposiciones", "Libros"],
                estado: "activo",
                fechaDesactivacion: null,
                fechaEliminacion: null
            },
            { 
                id: "user_004", 
                email: "admincreador@culturahabana.cu", 
                password: "admin1128", 
                nombre: "Admin Creador", 
                rol: "usuario", 
                telefono: "+53 51765432", 
                avatarColor: "#3498db",
                preferencias: [],
                estado: "activo",
                fechaDesactivacion: null,
                fechaEliminacion: null
            }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
        // Crear usuario administrador si no existe
    const usuarios = getUsuarios();
    const adminExists = usuarios.some(u => ADMIN_EMAILS.includes(u.email));
    
    if (!adminExists && ADMIN_EMAILS.length > 0) {
        const adminUser = {
            id: "user_admin_" + Date.now(),
            email: ADMIN_EMAILS[0],
            password: "Admin123!",  // Contraseña temporal (cambiarla en el primer inicio)
            nombre: "Administrador",
            telefono: "51234567",
            rol: "usuario",
            avatarColor: "#e74c3c",
            preferencias: [],
            estado: "activo",
            fechaDesactivacion: null,
            fechaEliminacion: null
        };
        usuarios.push(adminUser);
        guardarUsuarios(usuarios);
        console.log("✅ Usuario administrador creado con email:", ADMIN_EMAILS[0]);
    }
}

function getEventos() { 
    return JSON.parse(localStorage.getItem('eventos')) || []; 
}

function guardarEventos(eventos) { 
    localStorage.setItem('eventos', JSON.stringify(eventos)); 
}

function getEventoById(id) { 
    return getEventos().find(e => e.id === id); 
}

function agregarEvento(evento) {
    const eventos = getEventos();
    const nuevoId = "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
    const nuevoEvento = { ...evento, id: nuevoId };
    eventos.push(nuevoEvento);
    guardarEventos(eventos);
    return nuevoEvento;
}

function getUsuarios() { 
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Limpiar usuarios eliminados que pasaron los 14 días
    const ahora = new Date();
    let cambios = false;
    const usuariosFiltrados = usuarios.filter(usuario => {
        if (usuario.estado === 'eliminado' && usuario.fechaEliminacion) {
            const fechaElim = new Date(usuario.fechaEliminacion);
            if (ahora > fechaElim) {
                cambios = true;
                return false;
            }
        }
        return true;
    });
    if (cambios) {
        guardarUsuarios(usuariosFiltrados);
    }
    return usuariosFiltrados;
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function registrarUsuario(usuario) {
    const usuarios = getUsuarios();
    if (usuarios.find(u => u.email === usuario.email)) {
        return { exito: false, mensaje: "El correo ya está registrado" };
    }
    const colores = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    const nuevoUsuario = { 
        ...usuario, 
        id: "user_" + Date.now(), 
        avatarColor: colores[Math.floor(Math.random() * colores.length)],
        preferencias: usuario.preferencias || [],
        rol: "usuario",  // ← Forzar siempre usuario
        estado: "activo",
        fechaDesactivacion: null,
        fechaEliminacion: null
    };
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    return { exito: true, usuario: nuevoUsuario };
}

function iniciarSesion(email, password) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
        return { exito: false, mensaje: "Correo o contraseña incorrectos" };
    }
    
    // Verificar si la cuenta está deshabilitada
    if (usuario.estado === 'deshabilitado') {
        const fechaDesac = new Date(usuario.fechaDesactivacion);
        const ahora = new Date();
        const diasRestantes = Math.ceil((fechaDesac.getTime() + 14 * 24 * 60 * 60 * 1000 - ahora.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes > 0) {
            return { 
                exito: false, 
                mensaje: `Tu cuenta está desactivada. Tienes ${diasRestantes} días para recuperarla.`,
                necesitaRecuperacion: true,
                email: usuario.email
            };
        }
    }
    
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    return { exito: true, usuario };
}

function cerrarSesion() { 
    localStorage.removeItem('usuarioActual'); 
}

function getUsuarioActual() { 
    const u = localStorage.getItem('usuarioActual'); 
    return u ? JSON.parse(u) : null; 
}

function esOrganizador() { 
    const u = getUsuarioActual(); 
    return u && u.rol === 'organizador'; 
}

function actualizarUsuario(usuarioActualizado) {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.id === usuarioActualizado.id);
    if (index !== -1) {
        usuarios[index] = usuarioActualizado;
        guardarUsuarios(usuarios);
        // Actualizar sesión actual si es el mismo usuario
        const usuarioActual = getUsuarioActual();
        if (usuarioActual && usuarioActual.id === usuarioActualizado.id) {
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
        }
        return true;
    }
    return false;
}

function desactivarCuenta(email, confirmText) {
    if (confirmText !== 'DELETE') {
        return { exito: false, mensaje: 'Debes escribir DELETE para confirmar' };
    }
    
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.email === email);
    if (index === -1) {
        return { exito: false, mensaje: 'Usuario no encontrado' };
    }
    
    const ahora = new Date();
    const fechaEliminacion = new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    usuarios[index].estado = 'deshabilitado';
    usuarios[index].fechaDesactivacion = ahora.toISOString();
    usuarios[index].fechaEliminacion = fechaEliminacion.toISOString();
    
    guardarUsuarios(usuarios);
    
    // Cerrar sesión si era el usuario actual
    const usuarioActual = getUsuarioActual();
    if (usuarioActual && usuarioActual.email === email) {
        cerrarSesion();
    }
    
    return { exito: true, mensaje: `Cuenta desactivada. Tendrás 14 días para recuperarla (hasta ${fechaEliminacion.toLocaleDateString()})` };
}

function recuperarCuenta(email, codigo, nuevoPassword) {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.email === email);
    if (index === -1) {
        return { exito: false, mensaje: 'Usuario no encontrado' };
    }
    
    if (usuarios[index].estado !== 'deshabilitado') {
        return { exito: false, mensaje: 'Esta cuenta no está en período de recuperación' };
    }
    
    const fechaDesac = new Date(usuarios[index].fechaDesactivacion);
    const ahora = new Date();
    const diasTranscurridos = (ahora - fechaDesac) / (1000 * 60 * 60 * 24);
    
    if (diasTranscurridos > 14) {
        return { exito: false, mensaje: 'El período de recuperación ha expirado. La cuenta será eliminada permanentemente.' };
    }
    
    // Verificar código (simulado)
    if (codigo !== '12345678') {
        return { exito: false, mensaje: 'Código incorrecto' };
    }
    
    usuarios[index].estado = 'activo';
    usuarios[index].fechaDesactivacion = null;
    usuarios[index].fechaEliminacion = null;
    if (nuevoPassword) {
        usuarios[index].password = nuevoPassword;
    }
    
    guardarUsuarios(usuarios);
    
    // Iniciar sesión automáticamente
    iniciarSesion(email, nuevoPassword || usuarios[index].password);
    
    return { exito: true, mensaje: 'Cuenta recuperada exitosamente' };
}

function getEventosFuturos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return getEventos().filter(e => new Date(e.fechaInicio) >= hoy).sort((a,b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
}

function getCategoriasConEventos() {
    const categorias = new Set();
    getEventos().forEach(e => categorias.add(e.categoria));
    return Array.from(categorias).sort();
}

function buscarEventos(termino) {
    if (!termino || termino.trim() === "") return getEventos();
    const t = termino.toLowerCase();
    return getEventos().filter(e => 
        e.nombre.toLowerCase().includes(t) || 
        e.categoria.toLowerCase().includes(t) || 
        (e.ubicacion && e.ubicacion.toLowerCase().includes(t))
    );
}

// ==================== ELIMINACIÓN AUTOMÁTICA DE EVENTOS ====================
function limpiarEventosExpirados() {
    const eventos = getEventos();
    const ahora = new Date();
    let eventosModificados = false;
    
    const eventosFiltrados = eventos.filter(evento => {
        let fechaExpiracion;
        
        if (evento.fechaFin && evento.fechaFin !== evento.fechaInicio) {
            fechaExpiracion = new Date(evento.fechaFin);
            if (evento.horaFin) {
                const [horas, minutos] = evento.horaFin.split(':');
                fechaExpiracion.setHours(parseInt(horas) + 8, parseInt(minutos));
            } else {
                fechaExpiracion.setHours(23, 59, 59);
            }
        } else {
            fechaExpiracion = new Date(evento.fechaInicio);
            if (evento.horaFin) {
                const [horas, minutos] = evento.horaFin.split(':');
                fechaExpiracion.setHours(parseInt(horas) + 8, parseInt(minutos));
            } else if (evento.horaInicio) {
                const [horas, minutos] = evento.horaInicio.split(':');
                fechaExpiracion.setHours(parseInt(horas) + 12, parseInt(minutos));
            } else {
                fechaExpiracion.setHours(23, 59, 59);
            }
        }
        
        if (ahora > fechaExpiracion) {
            eventosModificados = true;
            return false;
        }
        return true;
    });
    
    if (eventosModificados) {
        guardarEventos(eventosFiltrados);
    }
}

// Ejecutar al cargar la página y cada hora
limpiarEventosExpirados();
setInterval(limpiarEventosExpirados, 60 * 60 * 1000);

function formatFechaShort(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function formatFechaDDMMYYYY(fechaStr) {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function getIcono(categoria) {
    const iconos = {
        'Conciertos': '🎵', 'Teatro': '🎭', 'Cine': '🎬', 'Exposiciones': '🖼️',
        'Danza': '💃', 'Libros': '📚', 'Festival': '🎉', 'Infantiles': '🧸',
        'Deportes': '⚽', 'Talleres': '🔧', 'Museos': '🏛️', 'Ferias': '🛍️', 'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

inicializarDatos();

// ==================== FUNCIONES PARA OBTENER ETIQUETAS DE CARACTERÍSTICAS ====================
function getEtiquetaAptoMenores(aptoMenores) {
    if (aptoMenores === true) {
        return { texto: '👶 Apto para menores', clase: 'badge-menores-si' };
    } else {
        return { texto: '🔞 Solo adultos', clase: 'badge-menores-no' };
    }
}

function getEtiquetaAireLibre(aireLibre) {
    if (aireLibre === true) {
        return { texto: '🌳 Al aire libre', clase: 'badge-aire-si' };
    } else {
        return { texto: '🏠 Bajo techo', clase: 'badge-aire-no' };
    }
}