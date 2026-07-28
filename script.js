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

botonTema.addEventListener("click", () => {
    const estaOscuro = cuerpo.classList.contains("tema-oscuro");

    if (estaOscuro) {
        desactivarTemaOscuro();
    } else {
        activarTemaOscuro();
    }
});

function activarTemaOscuro() {
    cuerpo.classList.add("tema-oscuro");
    botonTema.textContent = "☀";
    localStorage.setItem("tema", "oscuro");
}

function desactivarTemaOscuro() {
    cuerpo.classList.remove("tema-oscuro");
    botonTema.textContent = "☾";
    localStorage.setItem("tema", "claro");
}

botonMenu.addEventListener("click", () => {
    navegacion.classList.toggle("visible");

    const menuAbierto = navegacion.classList.contains("visible");

    botonMenu.textContent = menuAbierto ? "×" : "☰";
});

enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", () => {
        navegacion.classList.remove("visible");
        botonMenu.textContent = "☰";
    });
});

botonesArticulos.forEach((boton) => {
    boton.addEventListener("click", () => {
        const identificador = boton.dataset.articulo;
        const articulo = document.getElementById(identificador);

        if (!articulo) {
            console.error(`No se encontró el artículo: ${identificador}`);
            return;
        }

        contenidoModal.innerHTML = articulo.innerHTML;
        modalArticulo.classList.add("visible");
        modalArticulo.setAttribute("aria-hidden", "false");
        cuerpo.classList.add("modal-abierto");
    });
});

cerrarModal.addEventListener("click", cerrarArticulo);
fondoModal.addEventListener("click", cerrarArticulo);

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarArticulo();
    }
});

function cerrarArticulo() {
    modalArticulo.classList.remove("visible");
    modalArticulo.setAttribute("aria-hidden", "true");
    cuerpo.classList.remove("modal-abierto");
}

const elementoAnio = document.getElementById("anio");
elementoAnio.textContent = `© ${new Date().getFullYear()} Yohali`;