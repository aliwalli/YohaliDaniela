const cuerpo = document.body;
const botonTema = document.getElementById("botonTema");
const botonMenu = document.getElementById("botonMenu");
const navegacion = document.getElementById("navegacion");

const modalArticulo = document.getElementById("modalArticulo");
const contenidoModal = document.getElementById("contenidoModal");
const cerrarModal = document.getElementById("cerrarModal");
const fondoModal = document.getElementById("fondoModal");

const botonesArticulos = document.querySelectorAll("[data-articulo]");
const enlacesNavegacion = document.querySelectorAll(".navegacion a");

const temaGuardado = localStorage.getItem("tema");

if (temaGuardado === "oscuro") {
    activarTemaOscuro();
}

if (botonTema) {
    botonTema.addEventListener("click", () => {
        const estaOscuro = cuerpo.classList.contains("tema-oscuro");
        if (estaOscuro) {
            desactivarTemaOscuro();
        } else {
            activarTemaOscuro();
        }
    });
}

function activarTemaOscuro() {
    cuerpo.classList.add("tema-oscuro");
    if (botonTema) botonTema.textContent = "☀";
    localStorage.setItem("tema", "oscuro");
}

function desactivarTemaOscuro() {
    cuerpo.classList.remove("tema-oscuro");
    if (botonTema) botonTema.textContent = "☾";
    localStorage.setItem("tema", "claro");
}

if (botonMenu && navegacion) {
    botonMenu.addEventListener("click", () => {
        navegacion.classList.toggle("visible");
        const menuAbierto = navegacion.classList.contains("visible");
        botonMenu.textContent = menuAbierto ? "×" : "☰";
    });
}

enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", () => {
        if (navegacion) navegacion.classList.remove("visible");
        if (botonMenu) botonMenu.textContent = "☰";
    });
});

botonesArticulos.forEach((boton) => {
    boton.addEventListener("click", () => {
        const identificador = boton.dataset.articulo;
        const articulo = document.getElementById(identificador);

        if (!articulo || !contenidoModal || !modalArticulo) {
            console.error(`No se encontró el artículo o el modal: ${identificador}`);
            return;
        }

        contenidoModal.innerHTML = articulo.innerHTML;
        modalArticulo.classList.add("visible");
        modalArticulo.setAttribute("aria-hidden", "false");
        cuerpo.classList.add("modal-abierto");
    });
});

if (cerrarModal) cerrarModal.addEventListener("click", cerrarArticulo);
if (fondoModal) fondoModal.addEventListener("click", cerrarArticulo);

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarArticulo();
    }
});

function cerrarArticulo() {
    if (modalArticulo) {
        modalArticulo.classList.remove("visible");
        modalArticulo.setAttribute("aria-hidden", "true");
    }
    cuerpo.classList.remove("modal-abierto");
}

/* =========================================
   CIELO ESTRELLADO INTERACTIVO
========================================= */

const canvasCielo = document.getElementById("cielo-estrellado");

if (canvasCielo) {
    const contexto = canvasCielo.getContext("2d");

    let estrellas = [];
    let anchoVentana = window.innerWidth;
    let altoVentana = window.innerHeight;

    const mouse = {
        x: anchoVentana / 2,
        y: altoVentana / 2
    };

    function ajustarCanvas() {
        anchoVentana = window.innerWidth;
        altoVentana = window.innerHeight;

        const escala = Math.min(window.devicePixelRatio || 1, 2);

        canvasCielo.width = anchoVentana * escala;
        canvasCielo.height = altoVentana * escala;

        canvasCielo.style.width = `${anchoVentana}px`;
        canvasCielo.style.height = `${altoVentana}px`;

        contexto.setTransform(escala, 0, 0, escala, 0, 0);

        crearEstrellas();
    }

    function crearEstrellas() {
        const cantidad = Math.min(
            220,
            Math.floor((anchoVentana * altoVentana) / 6500)
        );

        estrellas = [];

        for (let i = 0; i < cantidad; i++) {
            estrellas.push({
                x: Math.random() * anchoVentana,
                y: Math.random() * altoVentana,
                radio: Math.random() * 1.7 + 0.25,
                velocidad: Math.random() * 0.16 + 0.03,
                brillo: Math.random() * 0.7 + 0.25,
                fase: Math.random() * Math.PI * 2
            });
        }
    }

    function dibujarEstrella(estrella, tiempo) {
        const distanciaX = mouse.x - anchoVentana / 2;
        const distanciaY = mouse.y - altoVentana / 2;

        const movimientoX = distanciaX * estrella.radio * 0.003;
        const movimientoY = distanciaY * estrella.radio * 0.003;

        const parpadeo =
            estrella.brillo +
            Math.sin(tiempo * 0.0015 + estrella.fase) * 0.2;

        contexto.beginPath();

        contexto.arc(
            estrella.x + movimientoX,
            estrella.y + movimientoY,
            estrella.radio,
            0,
            Math.PI * 2
        );

        contexto.fillStyle = `rgba(245, 241, 255, ${Math.max(0.12, parpadeo)})`;
        contexto.fill();

        if (estrella.radio > 1.4) {
            contexto.beginPath();
            contexto.arc(
                estrella.x + movimientoX,
                estrella.y + movimientoY,
                estrella.radio * 3.5,
                0,
                Math.PI * 2
            );
            contexto.fillStyle = `rgba(153, 126, 255, ${parpadeo * 0.08})`;
            contexto.fill();
        }
    }

    function animarCielo(tiempo) {
        contexto.clearRect(0, 0, anchoVentana, altoVentana);

        estrellas.forEach((estrella) => {
            estrella.y += estrella.velocidad;

            if (estrella.y > altoVentana + 10) {
                estrella.y = -10;
                estrella.x = Math.random() * anchoVentana;
            }

            dibujarEstrella(estrella, tiempo);
        });

        requestAnimationFrame(animarCielo);
    }

    window.addEventListener("mousemove", (evento) => {
        mouse.x = evento.clientX;
        mouse.y = evento.clientY;
    });

    window.addEventListener("touchmove", (evento) => {
        const toque = evento.touches[0];
        if (toque) {
            mouse.x = toque.clientX;
            mouse.y = toque.clientY;
        }
    });

    window.addEventListener("resize", ajustarCanvas);

    ajustarCanvas();
    requestAnimationFrame(animarCielo);
}

/* =========================================
   SALUDO AUTOMÁTICO SEGÚN LA HORA Y AÑO
========================================= */

const saludoHora = document.getElementById("saludo-hora");

if (saludoHora) {
    const horaActual = new Date().getHours();

    if (horaActual >= 5 && horaActual < 12) {
        saludoHora.textContent = "BUENOS DÍAS · BIENVENIDO A MI PEQUEÑO UNIVERSO";
    } else if (horaActual >= 12 && horaActual < 19) {
        saludoHora.textContent = "BUENAS TARDES · BIENVENIDO A MI PEQUEÑO UNIVERSO";
    } else {
        saludoHora.textContent = "BUENAS NOCHES · BIENVENIDO A MI PEQUEÑO UNIVERSO";
    }
}

// FIX: Verificación para evitar error si no existe #anio
const elementoAnio = document.getElementById("anio");
if (elementoAnio) {
    elementoAnio.textContent = `© ${new Date().getFullYear()} Yohali`;
}

/* =========================================
   POLAROIDS ARRASTRABLES
========================================= */

const polaroids = document.querySelectorAll(".polaroid");

let polaroidActiva = null;
let desplazamientoX = 0;
let desplazamientoY = 0;
let posicionX = 0;
let posicionY = 0;
let nivelSuperior = 20;

polaroids.forEach((polaroid) => {
    polaroid.addEventListener("pointerdown", iniciarArrastre);
});

function iniciarArrastre(evento) {
    polaroidActiva = evento.currentTarget;

    const rectangulo = polaroidActiva.getBoundingClientRect();
    const rotacion = polaroidActiva.dataset.rotacion || 0;

    desplazamientoX = evento.clientX - rectangulo.left;
    desplazamientoY = evento.clientY - rectangulo.top;

    posicionX = rectangulo.left;
    posicionY = rectangulo.top;

    nivelSuperior += 1;

    polaroidActiva.classList.add("arrastrando");
    polaroidActiva.style.position = "fixed";
    polaroidActiva.style.left = `${posicionX}px`;
    polaroidActiva.style.top = `${posicionY}px`;
    polaroidActiva.style.width = `${rectangulo.width}px`;
    polaroidActiva.style.margin = "0";
    polaroidActiva.style.zIndex = nivelSuperior;
    polaroidActiva.style.transform = `rotate(${rotacion}deg)`;

    polaroidActiva.setPointerCapture(evento.pointerId);

    polaroidActiva.addEventListener("pointermove", moverPolaroid);
    polaroidActiva.addEventListener("pointerup", terminarArrastre);
    polaroidActiva.addEventListener("pointercancel", terminarArrastre);
}

function moverPolaroid(evento) {
    if (!polaroidActiva) return;

    posicionX = evento.clientX - desplazamientoX;
    posicionY = evento.clientY - desplazamientoY;

    polaroidActiva.style.left = `${posicionX}px`;
    polaroidActiva.style.top = `${posicionY}px`;
}

function terminarArrastre(evento) {
    if (!polaroidActiva) return;

    polaroidActiva.releasePointerCapture(evento.pointerId);

    polaroidActiva.removeEventListener("pointermove", moverPolaroid);
    polaroidActiva.removeEventListener("pointerup", terminarArrastre);
    polaroidActiva.removeEventListener("pointercancel", terminarArrastre);

    polaroidActiva.classList.remove("arrastrando");
    polaroidActiva = null;
}

/* =========================================
   REPRODUCTOR MUSICAL INTERACTIVO
========================================= */

const botonAmbiente = document.getElementById("botonAmbiente");
const mensajeAmbiente = document.getElementById("mensajeAmbiente");
const contenedorSpotify = document.getElementById("spotifyPlayer");

const tituloCancion = document.getElementById("tituloCancion");
const artistaCancion = document.getElementById("artistaCancion");
const descripcionCancion = document.getElementById("descripcionCancion");

const textoVinilo = document.getElementById("textoVinilo");
const artistaVinilo = document.getElementById("artistaVinilo");
const notaVinilo = document.getElementById("notaVinilo");

const botonesCancion = document.querySelectorAll("[data-cancion]");

const manecillaHora = document.querySelector(".manecilla-hora");
const manecillaMinuto = document.querySelector(".manecilla-minuto");

const canciones = {
    time: {
        titulo: "Time",
        artista: "Pink Floyd",
        descripcion:
            "Una canción sobre el paso del tiempo, las decisiones que dejamos para después y esa sensación extraña de descubrir que la vida siguió avanzando.",
        vinilo: "TIME",
        notaVinilo: "THE DARK SIDE OF THE MOON · 1973",
        uri: "spotify:track:3TO7bbrUKrOSPGRTB5MeCz",
        claseAmbiente: "ambiente-time-activo"
    },
    luftballoons: {
        titulo: "99 Luftballoons",
        artista: "Nena",
        descripcion:
            "Una canción brillante, ochentera y aparentemente alegre que esconde una historia sobre miedo, guerra y una cadena absurda de decisiones.",
        vinilo: "99",
        notaVinilo: "NENA · 1983",
        uri: "spotify:track:2IJftBfq7pJ43tfnOR0RB3",
        claseAmbiente: "ambiente-luftballoons-activo"
    }
};

let controladorSpotify = null;
let spotifyListo = false;
let claveCancionActual = "time";
let cancionReproduciendose = false;

window.onSpotifyIframeApiReady = (IFrameAPI) => {
    if (!contenedorSpotify) {
        console.error("No se encontró el elemento #spotifyPlayer.");
        return;
    }

    const opciones = {
        width: "100%",
        height: 152,
        uri: canciones.time.uri
    };

    IFrameAPI.createController(
        contenedorSpotify,
        opciones,
        (EmbedController) => {
            controladorSpotify = EmbedController;
            configurarEventosSpotify();
        }
    );
};

function configurarEventosSpotify() {
    if (!controladorSpotify) return;

    controladorSpotify.addListener("ready", () => {
        spotifyListo = true;

        if (botonAmbiente) {
            botonAmbiente.disabled = false;
            botonAmbiente.textContent = "Reproducir Time";
        }

        if (mensajeAmbiente) {
            mensajeAmbiente.textContent = "Spotify está listo. Elige una canción.";
        }
    });

    controladorSpotify.addListener("playback_started", () => {
        actualizarAmbienteMusical(true);
    });

    controladorSpotify.addListener("playback_update", (evento) => {
        const estado = evento.data;
        if (!estado) return;

        const estaReproduciendo =
            !estado.isPaused &&
            !estado.isBuffering &&
            estado.position < estado.duration;

        actualizarAmbienteMusical(estaReproduciendo);
        revisarMomentoEspecial(estado);
    });
}

// FIX: Event Listener de canciones corregido y limpio
botonesCancion.forEach((boton) => {
    boton.addEventListener("click", () => {
        const clave = boton.dataset.cancion;
        cambiarCancion(clave);
    });
});

// FIX: Función cambiarCancion con comprobación de existencias
function cambiarCancion(clave) {
    const cancion = canciones[clave];

    if (!cancion) {
        console.error(`No existe la canción: ${clave}`);
        return;
    }

    claveCancionActual = clave;
    detenerAmbientes();

    if (tituloCancion) tituloCancion.textContent = cancion.titulo;
    if (artistaCancion) artistaCancion.textContent = cancion.artista;
    if (descripcionCancion) descripcionCancion.textContent = cancion.descripcion;

    if (textoVinilo) textoVinilo.textContent = cancion.vinilo;
    if (artistaVinilo) artistaVinilo.textContent = cancion.artista.toUpperCase();
    if (notaVinilo) notaVinilo.textContent = cancion.notaVinilo;

    botonesCancion.forEach((boton) => {
        boton.classList.toggle("activo", boton.dataset.cancion === clave);
    });

    if (botonAmbiente) {
        botonAmbiente.textContent = `Reproducir ${cancion.titulo}`;
    }

    if (mensajeAmbiente) {
        mensajeAmbiente.textContent = `${cancion.titulo} está lista para reproducirse.`;
    }

    if (spotifyListo && controladorSpotify) {
        controladorSpotify.loadUri(cancion.uri);
    }
}

if (botonAmbiente) {
    botonAmbiente.addEventListener("click", () => {
        if (!spotifyListo || !controladorSpotify) {
            if (mensajeAmbiente) {
                mensajeAmbiente.textContent = "Spotify todavía está cargando...";
            }
            return;
        }

        controladorSpotify.togglePlay();
    });
}

function actualizarAmbienteMusical(estaReproduciendo) {
    cancionReproduciendose = estaReproduciendo;

    detenerAmbientes();

    const cancion = canciones[claveCancionActual];

    if (estaReproduciendo && cancion) {
        document.body.classList.add(cancion.claseAmbiente);
    }

    if (!botonAmbiente || !mensajeAmbiente) return;

    if (estaReproduciendo) {
        botonAmbiente.textContent = `Pausar ${cancion.titulo}`;
        mensajeAmbiente.textContent = `${cancion.titulo} está sonando.`;
    } else {
        botonAmbiente.textContent = `Reproducir ${cancion.titulo}`;
        mensajeAmbiente.textContent = "La canción está pausada.";
    }
}

function detenerAmbientes() {
    document.body.classList.remove(
        "ambiente-time-activo",
        "ambiente-luftballoons-activo",
        "momento-especial-time"
    );
}

/* =========================================
   MOMENTO ESPECIAL DE TIME
========================================= */

function revisarMomentoEspecial(estado) {
    if (claveCancionActual !== "time") {
        document.body.classList.remove("momento-especial-time");
        return;
    }

    const posicionSegundos = Math.floor(estado.position / 1000);

    const momentoEspecialActivo =
        !estado.isPaused &&
        posicionSegundos >= 413 &&
        posicionSegundos <= 440;

    document.body.classList.toggle(
        "momento-especial-time",
        momentoEspecialActivo
    );
}

/* =========================================
   RELOJ ANALÓGICO
========================================= */

function actualizarRelojTime() {
    if (!manecillaHora || !manecillaMinuto) return;

    const ahora = new Date();

    const horas = ahora.getHours() % 12;
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();

    const gradosHora = horas * 30 + minutos * 0.5 + segundos * (0.5 / 60);
    const gradosMinuto = minutos * 6 + segundos * 0.1;

    manecillaHora.style.transform = `rotate(${gradosHora}deg)`;
    manecillaMinuto.style.transform = `rotate(${gradosMinuto}deg)`;
}

actualizarRelojTime();
setInterval(actualizarRelojTime, 1000);
let ultimoX = 0;
let ultimoY = 0;
const distanciaMinima = 20; // Píxeles de movimiento antes de crear otra estrella

document.addEventListener('mousemove', (e) => {
    // Calculamos cuánto se ha movido el cursor
    const dist = Math.hypot(e.clientX - ultimoX, e.clientY - ultimoY);
    
    if (dist > distanciaMinima) {
        crearEstrella(e.clientX, e.clientY);
        ultimoX = e.clientX;
        ultimoY = e.clientY;
    }
});

function crearEstrella(x, y) {
    const estrella = document.createElement('span');
    estrella.className = 'polvo-estelar';
    
    // Variación aleatoria de símbolos
    const simbolos = ['✧', '✦', '✵', '·'];
    estrella.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
    
    // Pequeño desplazamiento aleatorio para dispersión natural
    const offsetX = (Math.random() - 0.5) * 12;
    const offsetY = (Math.random() - 0.5) * 12;
    
    estrella.style.left = `${x + offsetX}px`;
    estrella.style.top = `${y + offsetY}px`;
    
    document.body.appendChild(estrella);
    
    // Eliminar el elemento cuando termina la animación
    setTimeout(() => {
        estrella.remove();
    }, 800);
}
const reflexiones = [
    "«Lo que está abajo es como lo que está arriba, y lo que está arriba es como lo que está abajo.» — El Kybalión",
    "No busques que los eventos sucedan como deseas; desea que sucedan como ocurren.",
    "En el silencio nocturno es donde las ideas más claras encuentran su cauce.",
    "«Eso q tiene que ver con navidad????» - Yohali :)",
    "La luna no apresura sus fases, sin embargo, siempre llega a estar llena.",
    "«Eso q tiene que ver con navidad????» - Yohali :)",
    "«La sombra es el laberinto que nos lleva hacia la luz propia.»",
    "«Quien mira hacia afuera, sueña; quien mira hacia adentro, despierta.» — Carl Jung",
    "«Eso q tiene que ver con navidad????» - Yohali :)"
];

function abrirOraculo() {
    document.getElementById('modal-oraculo').style.display = 'flex';
    obtenerReflexion();
}

function cerrarOraculo() {
    document.getElementById('modal-oraculo').style.display = 'none';
}

function obtenerReflexion() {
    const indice = Math.floor(Math.random() * reflexiones.length);
    document.getElementById('mensaje-oraculo').innerText = reflexiones[indice];
}

// Cerrar si hace clic fuera de la caja
window.onclick = function(event) {
    const modal = document.getElementById('modal-oraculo');
    if (event.target === modal) {
        cerrarOraculo();
    }
}