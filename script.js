﻿// ==================== VARIABLES GLOBALES ====================
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// ==================== DETECTAR MÓVIL ====================
function isMobile() {
    return window.innerWidth <= 700;
}

// ==================== FUNCIONES COMPLEMENTARIAS ====================
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

function getIconoCategoria(categoria) {
    const iconos = {
        'Conciertos': '🎵', 'Teatro': '🎭', 'Cine': '🎬', 'Exposiciones': '🖼️',
        'Danza': '💃', 'Libros': '📚', 'Festival': '🎉', 'Infantiles': '🧸',
        'Deportes': '⚽', 'Talleres': '🔧', 'Museos': '🏛️', 'Ferias': '🛍️', 'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

// ==================== FUNCIÓN PARA OBTENER PREFERENCIAS DEL USUARIO ====================
function getPreferenciasUsuario() {
    const usuario = getUsuarioActual();
    return usuario?.preferencias || [];
}

// ==================== MENÚ LATERAL UNIFICADO ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const categoriasMenuItem = document.querySelector('.menu-item-dropdown');
    const categoriasBtn = categoriasMenuItem ? categoriasMenuItem.querySelector('.menu-link') : null;
    const submenuCategorias = categoriasMenuItem ? categoriasMenuItem.querySelector('.sub-menu') : null;
    
    if (!sidebar) return;
    
    let activeTooltip = null;
    let tooltipTimeout = null;
    
    const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';
    
    // Variable para mantener el estado de categorías (abierto/cerrado)
    let isCategoriasOpen = false;
    
    // ========== FUNCIÓN PARA OBTENER ALTURA REAL DEL SUBMENÚ ==========
    function getSubmenuRealHeight() {
        if (!submenuCategorias) return 0;
        // Guardar estilos originales
        const originalStyles = {
            height: submenuCategorias.style.height,
            padding: submenuCategorias.style.padding,
            display: submenuCategorias.style.display,
            visibility: submenuCategorias.style.visibility,
            position: submenuCategorias.style.position
        };
        
        // Forzar temporalmente para medir
        submenuCategorias.style.height = 'auto';
        submenuCategorias.style.padding = '0.2rem 0';
        submenuCategorias.style.display = 'block';
        submenuCategorias.style.visibility = 'visible';
        submenuCategorias.style.position = 'absolute';
        
        const realHeight = submenuCategorias.scrollHeight;
        
        // Restaurar estilos
        submenuCategorias.style.height = originalStyles.height;
        submenuCategorias.style.padding = originalStyles.padding;
        submenuCategorias.style.display = originalStyles.display;
        submenuCategorias.style.visibility = originalStyles.visibility;
        submenuCategorias.style.position = originalStyles.position;
        
        return realHeight;
    }
    
    // ========== FUNCIÓN PARA ABRIR SUBMENÚ EN MODO ACORDEÓN (cuando sidebar está expandido) ==========
    function openAccordionSubmenu() {
        if (!submenuCategorias) return;
        // Limpiar cualquier estilo flotante previo
        submenuCategorias.style.cssText = '';
        submenuCategorias.classList.remove('floating-submenu');
        submenuCategorias.style.position = 'relative';
        
        const realHeight = getSubmenuRealHeight();
        submenuCategorias.style.height = `${realHeight + 10}px`;
        submenuCategorias.style.padding = '0.2rem 0';
        submenuCategorias.style.overflow = 'hidden';
        
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.add('sub-menu-toggle');
        }
        isCategoriasOpen = true;
    }
    
    // ========== FUNCIÓN PARA CERRAR SUBMENÚ EN MODO ACORDEÓN ==========
    function closeAccordionSubmenu() {
        if (!submenuCategorias) return;
        submenuCategorias.style.height = '0';
        submenuCategorias.style.padding = '0';
        submenuCategorias.style.overflow = 'hidden';
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.remove('sub-menu-toggle');
        }
        isCategoriasOpen = false;
    }
    
    // ========== FUNCIÓN PARA CERRAR SUBMENÚ FLOTANTE ==========
    function closeFloatingSubmenu() {
        if (submenuCategorias) {
            submenuCategorias.classList.remove('floating-submenu');
            submenuCategorias.style.cssText = '';
            submenuCategorias.style.height = '0';
            submenuCategorias.style.padding = '0';
            submenuCategorias.style.overflow = 'hidden';
            if (categoriasMenuItem) {
                categoriasMenuItem.classList.remove('sub-menu-toggle');
            }
        }
        isCategoriasOpen = false;
    }
    
    // ========== FUNCIÓN PARA ABRIR SUBMENÚ FLOTANTE (USANDO rem COMO EL TEMPLATE) ==========
    function openFloatingSubmenu() {
        if (!submenuCategorias) return;
        
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        
        // Limpiar estilos previos
        submenuCategorias.style.cssText = '';
        submenuCategorias.classList.remove('floating-submenu');
        
        // Asegurar que el menu-item sea el contenedor de referencia
        if (categoriasMenuItem) {
            categoriasMenuItem.style.position = 'relative';
        }
        
        // Aplicar estilos flotantes - USANDO rem (como el template)
        submenuCategorias.style.position = 'absolute';
        submenuCategorias.style.left = '5rem';
        submenuCategorias.style.top = '7.8rem';
        submenuCategorias.style.width = '180px';
        submenuCategorias.style.maxHeight = '300px';
        submenuCategorias.style.overflowY = 'auto';
        submenuCategorias.style.padding = '0.5rem 0';
        submenuCategorias.style.backgroundColor = 'var(--color-surface)';
        submenuCategorias.style.borderRadius = '0.5rem';
        submenuCategorias.style.boxShadow = '0 4px 12px var(--shadow-border)';
        submenuCategorias.style.border = '1px solid var(--color-border)';
        submenuCategorias.style.zIndex = '10000';
        submenuCategorias.style.display = 'block';
        submenuCategorias.style.visibility = 'visible';
        submenuCategorias.style.opacity = '1';
        submenuCategorias.style.height = 'auto';
        
        submenuCategorias.classList.add('floating-submenu');
        
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.add('sub-menu-toggle');
        }
        isCategoriasOpen = true;
        
        // Cerrar al hacer clic fuera
        const closeHandler = (event) => {
            if (categoriasBtn && !categoriasBtn.contains(event.target) && 
                submenuCategorias && !submenuCategorias.contains(event.target)) {
                closeFloatingSubmenu();
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchstart', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchstart', closeHandler);
        }, 10);
    }
    
    // ========== APLICAR ESTADO INICIAL ==========
    function applyInitialState() {
        if (isMobile()) {
            sidebar.classList.remove('minimize');
            document.body.classList.remove('sidebar-visible');
            closeFloatingSubmenu();
            closeAccordionSubmenu();
        } else {
            document.body.classList.remove('sidebar-visible');
            sidebar.classList.add('minimize');
            closeFloatingSubmenu();
            closeAccordionSubmenu();
            isCategoriasOpen = false;
            // Resetear posición del menu-item
            if (categoriasMenuItem) {
                categoriasMenuItem.style.position = '';
            }
        }
    }
    
    applyInitialState();
    updateActiveMenuItem();
    
    // ========== TOGGLE DEL MENÚ ==========
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMobile()) {
                document.body.classList.toggle('sidebar-visible');
                closeFloatingSubmenu();
                closeAccordionSubmenu();
            } else {
                if (sidebar.classList.contains('minimize')) {
                    // Expandir menú
                    sidebar.classList.remove('minimize');
                    // Resetear posición del menu-item
                    if (categoriasMenuItem) {
                        categoriasMenuItem.style.position = '';
                    }
                    if (isCategoriasOpen) {
                        setTimeout(() => {
                            openAccordionSubmenu();
                        }, 50);
                    }
                } else {
                    // Minimizar menú
                    sidebar.classList.add('minimize');
                    if (isCategoriasOpen) {
                        setTimeout(() => {
                            openFloatingSubmenu();
                        }, 50);
                    } else {
                        closeFloatingSubmenu();
                        closeAccordionSubmenu();
                    }
                }
            }
            
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        });
    }
    
    // ========== COMPORTAMIENTO DE CATEGORÍAS ==========
    if (categoriasBtn && submenuCategorias && categoriasMenuItem) {
        
        categoriasBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMobile()) {
                if (!isCategoriasOpen) {
                    const realHeight = getSubmenuRealHeight();
                    submenuCategorias.style.height = `${realHeight + 10}px`;
                    submenuCategorias.style.padding = '0.2rem 0';
                    categoriasMenuItem.classList.add('sub-menu-toggle');
                    isCategoriasOpen = true;
                } else {
                    submenuCategorias.style.height = '0';
                    submenuCategorias.style.padding = '0';
                    categoriasMenuItem.classList.remove('sub-menu-toggle');
                    isCategoriasOpen = false;
                }
                return;
            }
            
            // DESKTOP - MENÚ EXPANDIDO: acordeón normal
            if (!sidebar.classList.contains('minimize')) {
                if (!isCategoriasOpen) {
                    openAccordionSubmenu();
                } else {
                    closeAccordionSubmenu();
                }
                return;
            }
            
            // DESKTOP - MENÚ CONTRADO: submenú flotante
            if (sidebar.classList.contains('minimize')) {
                if (!isCategoriasOpen) {
                    openFloatingSubmenu();
                } else {
                    closeFloatingSubmenu();
                }
            }
        });
    }
    
    // ========== TOOLTIPS PARA MENÚ CONTRADO ==========
    function showTooltip(element, text) {
        if (isMobile()) return;
        if (!sidebar.classList.contains('minimize')) return;
        
        if (submenuCategorias && submenuCategorias.classList.contains('floating-submenu')) {
            return;
        }
        
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        
        const rect = element.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'menu-tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${sidebarRect.right + 12}px`;
        tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
        tooltip.style.transform = 'translateY(-50%)';
        
        document.body.appendChild(tooltip);
        activeTooltip = tooltip;
    }
    
    function hideTooltip() {
        if (activeTooltip) {
            tooltipTimeout = setTimeout(() => {
                if (activeTooltip && activeTooltip.parentNode) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }
                tooltipTimeout = null;
            }, 150);
        }
    }
    
    const allMenuItems = document.querySelectorAll('.menu-item');
    
    allMenuItems.forEach(item => {
        const menuLink = item.querySelector('.menu-link');
        const span = menuLink ? menuLink.querySelector('span') : null;
        const itemText = span ? span.textContent : '';
        const isCategoriasItem = item.classList.contains('menu-item-dropdown');
        
        item.addEventListener('mouseenter', function() {
            if (!isMobile() && sidebar.classList.contains('minimize') && itemText) {
                if (isCategoriasItem && submenuCategorias && submenuCategorias.classList.contains('floating-submenu')) {
                    return;
                }
                showTooltip(this, itemText);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!isMobile() && sidebar.classList.contains('minimize')) {
                hideTooltip();
            }
        });
    });
    
    // ========== ENLACES DEL SUBMENÚ ==========
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.removeEventListener('click', handleSubmenuClick);
        link.addEventListener('click', handleSubmenuClick);
    });
    
    function handleSubmenuClick(e) {
        e.preventDefault();
        const categoria = this.getAttribute('data-categoria');
        if (categoria) {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            closeFloatingSubmenu();
            window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
        }
    }
    
    // ========== ENLACES DEL MENÚ PRINCIPAL ==========
    const mainMenuLinks = document.querySelectorAll('.menu-link:not(#categoriasBtn)');
    mainMenuLinks.forEach(link => {
        link.removeEventListener('click', handleMainLinkClick);
        link.addEventListener('click', handleMainLinkClick);
    });
    
    function handleMainLinkClick(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        if (href === currentPage) {
            e.preventDefault();
            
            if (isMobile()) {
                document.body.classList.remove('sidebar-visible');
            } else {
                if (!sidebar.classList.contains('minimize')) {
                    sidebar.classList.add('minimize');
                    closeFloatingSubmenu();
                    closeAccordionSubmenu();
                }
            }
        }
    }
    
    // ========== REDIMENSIONAMIENTO ==========
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                document.body.classList.remove('sidebar-visible');
                sidebar.classList.remove('minimize');
                closeFloatingSubmenu();
                closeAccordionSubmenu();
            } else {
                sidebar.classList.add('minimize');
                if (isCategoriasOpen) {
                    setTimeout(() => {
                        openFloatingSubmenu();
                    }, 50);
                } else {
                    closeFloatingSubmenu();
                    closeAccordionSubmenu();
                }
            }
            
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        }, 100);
    });
}

// ==================== ACTUALIZAR PÁGINA ACTIVA EN EL MENÚ ====================
function updateActiveMenuItem() {
    const currentPath = window.location.pathname.split('/').pop() || 'inicio.html';
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

// ==================== TEMA OSCURO ====================
function applyTheme() {
    const iconMappings = [
        { light: '.home-light', dark: '.home-dark' },
        { light: '.categories-light', dark: '.categories-dark' },
        { light: '.dropdown-light', dark: '.dropdown-dark' },
        { light: '.calendar-light', dark: '.calendar-dark' },
        { light: '.map-light', dark: '.map-dark' },
        { light: '.promo-light', dark: '.promo-dark' }
    ];
    
    iconMappings.forEach(mapping => {
        const lightIcon = document.querySelector(mapping.light);
        const darkIcon = document.querySelector(mapping.dark);
        if (lightIcon && darkIcon) {
            lightIcon.style.display = isDarkMode ? 'none' : 'inline-block';
            darkIcon.style.display = isDarkMode ? 'inline-block' : 'none';
        }
    });
    
    const searchLight = document.getElementById('searchIconLight');
    const searchDark = document.getElementById('searchIconDark');
    const themeLight = document.getElementById('themeIconLight');
    const themeDark = document.getElementById('themeIconDark');
    const notifLight = document.getElementById('notifIconLight');
    const notifDark = document.getElementById('notifIconDark');
    const menuIcon = document.getElementById('menuIcon');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (searchLight) searchLight.style.display = 'none';
        if (searchDark) searchDark.style.display = 'inline-block';
        if (themeLight) themeLight.style.display = 'none';
        if (themeDark) themeDark.style.display = 'inline-block';
        if (notifLight) notifLight.style.display = 'none';
        if (notifDark) notifDark.style.display = 'inline-block';
        if (menuIcon) menuIcon.src = 'resources/icons_dark/menu.png';
    } else {
        document.body.classList.remove('dark-mode');
        if (searchLight) searchLight.style.display = 'inline-block';
        if (searchDark) searchDark.style.display = 'none';
        if (themeLight) themeLight.style.display = 'inline-block';
        if (themeDark) themeDark.style.display = 'none';
        if (notifLight) notifLight.style.display = 'inline-block';
        if (notifDark) notifDark.style.display = 'none';
        if (menuIcon) menuIcon.src = 'resources/icons_light/menu.png';
    }
}

// Inicializar sistema de notificaciones
if (typeof initNotificationsSystem === 'function') {
    initNotificationsSystem();
}

// Configurar el botón de notificaciones
const notifBtn = document.getElementById('notificationsBtn');
if (notifBtn && typeof toggleNotificationsPanel === 'function') {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNotificationsPanel();
    });
}

// ==================== AVATAR CON SUBMENÚ (como categorías) ====================
function initAvatar() {
    const avatarDiv = document.getElementById('avatarUsuario');
    const menuPromocion = document.getElementById('menuPromocion');
    
    if (!avatarDiv) return;
    
    let activeTooltip = null;
    let tooltipTimeout = null;
    
    // Crear submenú flotante para el avatar (solo en escritorio)
    let avatarSubmenu = null;
    
    function crearSubmenuAvatar() {
        if (avatarSubmenu) return;
        
        avatarSubmenu = document.createElement('div');
        avatarSubmenu.className = 'avatar-submenu';
        avatarSubmenu.style.cssText = `
            position: absolute;
            background: var(--color-surface);
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px var(--shadow-border);
            border: 1px solid var(--color-border);
            z-index: 10000;
            min-width: 160px;
            overflow: hidden;
            display: none;
        `;
        avatarSubmenu.innerHTML = `
            <a href="perfil.html" class="avatar-submenu-item">
                <span>⚙️ Configuración</span>
            </a>
            <div class="avatar-submenu-divider"></div>
            <a href="#" id="logoutSubmenuBtn" class="avatar-submenu-item">
                <span>🚪 Cerrar sesión</span>
            </a>
        `;
        document.body.appendChild(avatarSubmenu);
        
        // Estilos dinámicos
        const style = document.createElement('style');
        style.textContent = `
            .avatar-submenu-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1rem;
                color: var(--color-text-primary);
                text-decoration: none;
                font-size: 0.8rem;
                transition: background 0.2s ease;
            }
            .avatar-submenu-item:hover {
                background: var(--color-bg);
            }
            .avatar-submenu-divider {
                height: 1px;
                background: var(--color-border);
                margin: 0.2rem 0;
            }
        `;
        document.head.appendChild(style);
        
        document.getElementById('logoutSubmenuBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
            window.location.reload();
        });
    }
    
    function updateAvatar() {
        const usuario = getUsuarioActual();
        if (usuario && usuario.nombre) {
            avatarDiv.innerHTML = usuario.nombre.charAt(0).toUpperCase();
            avatarDiv.style.backgroundColor = usuario.avatarColor || '#2ecc71';
            avatarDiv.style.color = 'white';
            avatarDiv.style.border = 'none';
            avatarDiv.style.fontSize = '1rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = '36px';
            avatarDiv.style.height = '36px';
            avatarDiv.style.borderRadius = '50%';
            avatarDiv.style.display = 'flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.cursor = 'pointer';
            avatarDiv.title = usuario.nombre;
            
            if (menuPromocion) {
                menuPromocion.style.display = usuario.rol === 'organizador' ? 'block' : 'none';
            }
        } else {
            avatarDiv.innerHTML = 'Iniciar sesión';
            avatarDiv.style.backgroundColor = 'transparent';
            avatarDiv.style.color = 'rgb(2, 90, 138)';
            avatarDiv.style.border = '2px solid rgb(2, 90, 138)';
            avatarDiv.style.borderRadius = '30px';
            avatarDiv.style.fontSize = '0.8rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = 'auto';
            avatarDiv.style.height = 'auto';
            avatarDiv.style.padding = '0.4rem 1rem';
            avatarDiv.style.display = 'inline-flex';
            avatarDiv.title = 'Iniciar sesión';
            if (menuPromocion) menuPromocion.style.display = 'none';
        }
    }
    
    function showSubmenu() {
        if (isMobile()) {
            window.location.href = 'perfil.html';
            return;
        }
        
        const usuario = getUsuarioActual();
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }
        
        crearSubmenuAvatar();
        
        const rect = avatarDiv.getBoundingClientRect();
        avatarSubmenu.style.display = 'block';
        avatarSubmenu.style.position = 'fixed';
        avatarSubmenu.style.left = `${rect.left - 160}px`;
        avatarSubmenu.style.top = `${rect.bottom + 5}px`;
        
        const closeHandler = (event) => {
            if (!avatarDiv.contains(event.target) && !avatarSubmenu.contains(event.target)) {
                avatarSubmenu.style.display = 'none';
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchstart', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchstart', closeHandler);
        }, 10);
    }
    
    avatarDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const usuario = getUsuarioActual();
        if (usuario) {
            showSubmenu();
        } else {
            window.location.href = 'login.html';
        }
    });
    
    updateAvatar();
}

// Función isMobile (si no existe)
function isMobile() {
    return window.innerWidth <= 700;
}

// ==================== BÚSQUEDA GLOBAL ====================
function initSearch() {
    const buscador = document.getElementById('buscador-global');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!buscador) return;
    
    function realizarBusqueda() {
        const termino = buscador.value.trim();
        if (termino) {
            window.location.href = `busqueda.html?q=${encodeURIComponent(termino)}`;
        }
    }
    
    buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', realizarBusqueda);
    }
}

// ==================== NOTIFICACIONES ====================
function initNotifications() {
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            alert('📢 Notificaciones: Próximamente podrás recibir alertas de tus eventos favoritos.');
        });
    }
}

// ==================== CONFIGURAR ENLACES DE CATEGORÍAS ====================
function setupCategoriaLinks() {
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.removeEventListener('click', setupClick);
        link.addEventListener('click', setupClick);
    });
    
    function setupClick(e) {
        e.preventDefault();
        const categoria = this.getAttribute('data-categoria');
        if (categoria) {
            window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
        }
    }
}

// ==================== INICIALIZACIÓN GENERAL ====================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initSidebar();
    initAvatar();
    initSearch();
    initNotifications();
    setupCategoriaLinks();
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });
    }
});