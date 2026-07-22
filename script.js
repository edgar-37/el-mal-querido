// ============================================================
// CONFIGURACIÓN GENERAL
// ============================================================

const TELEFONO_WHATSAPP = "526567492280";

const PRECIO_MEDIO_QUESO = 120;
const PRECIO_MEDIO_CHORIZO = 120;

/*
    IMPORTANTE:

    No se proporcionó el precio de la carne seca.

    Cuando conozcas el precio, cambia null por el precio real.

    Ejemplo:
    const PRECIO_CARNE_SECA = 150;
*/
const PRECIO_CARNE_SECA = 100;

/*
    Cambia "unidad" por la presentación real.

    Ejemplos:
    "bolsa"
    "paquete"
    "100 gramos"
*/
const UNIDAD_CARNE_SECA = "bolsa";


// ============================================================
// NOMBRES DE SABORES
// ============================================================

const NOMBRES_SABORES = {
    pimientaLimon: "Pimienta limón",
    chipotle: "Chipotle",
    habanero: "Habanero",
    fajita: "Fajita",
    natural: "Natural",
    bbq: "BBQ"
};


// ============================================================
// CANTIDADES
// ============================================================

const cantidades = {
    queso: 0,
    chorizo: 0,

    carneSeca: {
        pimientaLimon: 0,
        chipotle: 0,
        habanero: 0,
        fajita: 0,
        natural: 0,
        bbq: 0
    }
};


// ============================================================
// ELEMENTOS HTML
// ============================================================

const totalSpan = document.getElementById("total");
const tituloTotal = document.getElementById("tituloTotal");
const avisoTotal = document.getElementById("avisoTotal");

const nombreInput = document.getElementById("nombre");
const fechaEntregaInput = document.getElementById("fechaEntrega");
const fechaAyuda = document.getElementById("fechaAyuda");
const comentariosInput = document.getElementById("comentarios");

const precioCarneSecaElemento =
    document.getElementById("precioCarneSeca");

const btnWhatsapp =
    document.getElementById("btnWhatsapp");


// ============================================================
// CONFIGURAR PRECIO MOSTRADO DE CARNE SECA
// ============================================================

function actualizarPrecioCarneSecaMostrado() {

    if (typeof PRECIO_CARNE_SECA === "number") {

        precioCarneSecaElemento.textContent =
            `$${PRECIO_CARNE_SECA} por ${UNIDAD_CARNE_SECA}`;

        precioCarneSecaElemento.classList.remove(
            "precio-pendiente"
        );

    } else {

        precioCarneSecaElemento.textContent =
            "Precio por confirmar";

        precioCarneSecaElemento.classList.add(
            "precio-pendiente"
        );

    }

}


// ============================================================
// BOTONES DE CANTIDAD
// ============================================================

document
    .querySelectorAll(".cantidad-btn")
    .forEach((boton) => {

        boton.addEventListener("click", () => {

            const producto =
                boton.dataset.producto;

            const operacion =
                boton.dataset.operacion;

            const sabor =
                boton.dataset.sabor;

            const cambio =
                operacion === "mas" ? 1 : -1;

            modificarCantidad(
                producto,
                sabor,
                cambio
            );

        });

    });


function modificarCantidad(
    producto,
    sabor,
    cambio
) {

    if (producto === "carneSeca") {

        const nuevaCantidad =
            cantidades.carneSeca[sabor] + cambio;

        cantidades.carneSeca[sabor] =
            Math.max(0, nuevaCantidad);

    } else {

        const nuevaCantidad =
            cantidades[producto] + cambio;

        cantidades[producto] =
            Math.max(0, nuevaCantidad);

    }

    actualizar();

}


// ============================================================
// ACTUALIZAR INTERFAZ
// ============================================================

function actualizar() {

    actualizarContadores();

    actualizarTotal();

    actualizarReglasFecha();

}


function actualizarContadores() {

    document.querySelector(
        '[data-contador="queso"]'
    ).textContent = cantidades.queso;

    document.querySelector(
        '[data-contador="chorizo"]'
    ).textContent = cantidades.chorizo;


    Object.keys(cantidades.carneSeca).forEach(
        (sabor) => {

            const contador =
                document.querySelector(
                    `[data-contador-carne="${sabor}"]`
                );

            if (contador) {
                contador.textContent =
                    cantidades.carneSeca[sabor];
            }

        }
    );

}


// ============================================================
// TOTALES
// ============================================================

function obtenerCantidadCarneSeca() {

    return Object
        .values(cantidades.carneSeca)
        .reduce(
            (acumulado, cantidad) =>
                acumulado + cantidad,
            0
        );

}


function calcularTotalProductosConPrecio() {

    let total = 0;

    total +=
        cantidades.queso *
        PRECIO_MEDIO_QUESO;

    total +=
        cantidades.chorizo *
        PRECIO_MEDIO_CHORIZO;

    if (
        typeof PRECIO_CARNE_SECA === "number"
    ) {

        total +=
            obtenerCantidadCarneSeca() *
            PRECIO_CARNE_SECA;

    }

    return total;

}


function actualizarTotal() {

    const total =
        calcularTotalProductosConPrecio();

    const tieneCarneSeca =
        obtenerCantidadCarneSeca() > 0;

    const carneSecaSinPrecio =
        tieneCarneSeca &&
        typeof PRECIO_CARNE_SECA !== "number";


    if (carneSecaSinPrecio) {

        tituloTotal.textContent =
            total > 0
                ? "Total parcial"
                : "Total";

        totalSpan.textContent =
            total > 0
                ? `$${total} + carne seca`
                : "Por confirmar";

        avisoTotal.hidden = false;

    } else {

        tituloTotal.textContent =
            "Total";

        totalSpan.textContent =
            `$${total}`;

        avisoTotal.hidden = true;

    }

}


// ============================================================
// REGLAS DE FECHA
// ============================================================

function obtenerFechaHoy() {

    const fecha = new Date();

    fecha.setHours(
        0,
        0,
        0,
        0
    );

    return fecha;

}


function sumarDias(
    fecha,
    dias
) {

    const nuevaFecha =
        new Date(fecha);

    nuevaFecha.setDate(
        nuevaFecha.getDate() + dias
    );

    return nuevaFecha;

}


function fechaAFormatoInput(fecha) {

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;

}


function convertirFechaInput(fechaTexto) {

    if (!fechaTexto) {
        return null;
    }

    const partes =
        fechaTexto
            .split("-")
            .map(Number);

    const fecha =
        new Date(
            partes[0],
            partes[1] - 1,
            partes[2]
        );

    fecha.setHours(
        0,
        0,
        0,
        0
    );

    return fecha;

}


function esLunes(fecha) {

    return fecha.getDay() === 1;

}


function esDiaLaboral(fecha) {

    const dia =
        fecha.getDay();

    return dia >= 1 && dia <= 5;

}


/*
    Devuelve el lunes siguiente.

    Si hoy es lunes, devuelve el lunes de la semana siguiente.
    Esto evita permitir pedidos para entrega el mismo día.
*/
function obtenerProximoLunes(fechaBase) {

    const fecha =
        new Date(fechaBase);

    const diaSemana =
        fecha.getDay();

    let diasHastaLunes =
        (8 - diaSemana) % 7;

    if (diasHastaLunes === 0) {
        diasHastaLunes = 7;
    }

    return sumarDias(
        fecha,
        diasHastaLunes
    );

}


function obtenerPrimerDiaLaboralDisponible(
    fechaBase
) {

    let fecha =
        new Date(fechaBase);

    while (!esDiaLaboral(fecha)) {

        fecha =
            sumarDias(fecha, 1);

    }

    return fecha;

}


function pedidoTieneQuesoOChorizo() {

    return (
        cantidades.queso > 0 ||
        cantidades.chorizo > 0
    );

}


function pedidoTieneCarneSeca() {

    return obtenerCantidadCarneSeca() > 0;

}


function pedidoTieneProductos() {

    return (
        pedidoTieneQuesoOChorizo() ||
        pedidoTieneCarneSeca()
    );

}


function obtenerTipoEntrega() {

    /*
        Si contiene queso o chorizo,
        todo el pedido se entrega en lunes.
    */

    if (pedidoTieneQuesoOChorizo()) {
        return "lunes";
    }

    if (pedidoTieneCarneSeca()) {
        return "laboral";
    }

    return null;

}


function actualizarReglasFecha() {

    const tipoEntrega =
        obtenerTipoEntrega();

    const hoy =
        obtenerFechaHoy();


    if (!tipoEntrega) {

        fechaEntregaInput.disabled = true;

        fechaEntregaInput.value = "";

        fechaEntregaInput.removeAttribute("min");

        fechaEntregaInput.setCustomValidity("");

        fechaAyuda.textContent =
            "Primero selecciona al menos un producto.";

        fechaAyuda.classList.remove(
            "fecha-error"
        );

        return;

    }


    fechaEntregaInput.disabled = false;


    if (tipoEntrega === "lunes") {

        const proximoLunes =
            obtenerProximoLunes(hoy);

        const fechaMinimaTexto =
            fechaAFormatoInput(proximoLunes);

        fechaEntregaInput.min =
            fechaMinimaTexto;

        fechaAyuda.textContent =
            "Los pedidos con queso o chorizo se entregan únicamente los lunes.";

        const fechaSeleccionada =
            convertirFechaInput(
                fechaEntregaInput.value
            );

        const fechaInvalida =
            !fechaSeleccionada ||
            fechaSeleccionada < proximoLunes ||
            !esLunes(fechaSeleccionada);

        if (fechaInvalida) {

            fechaEntregaInput.value =
                fechaMinimaTexto;

        }

    }


    if (tipoEntrega === "laboral") {

        const primerDiaLaboral =
            obtenerPrimerDiaLaboralDisponible(
                hoy
            );

        const fechaMinimaTexto =
            fechaAFormatoInput(
                primerDiaLaboral
            );

        fechaEntregaInput.min =
            fechaMinimaTexto;

        fechaAyuda.textContent =
            "La carne seca puede entregarse de lunes a viernes.";

        const fechaSeleccionada =
            convertirFechaInput(
                fechaEntregaInput.value
            );

        const fechaInvalida =
            !fechaSeleccionada ||
            fechaSeleccionada <
                primerDiaLaboral ||
            !esDiaLaboral(
                fechaSeleccionada
            );

        if (fechaInvalida) {

            fechaEntregaInput.value =
                fechaMinimaTexto;

        }

    }


    validarFechaSeleccionada(false);

}


// ============================================================
// VALIDAR FECHA ELEGIDA
// ============================================================

fechaEntregaInput.addEventListener(
    "change",
    () => {

        validarFechaSeleccionada(false);

    }
);


function validarFechaSeleccionada(
    mostrarAlerta = true
) {

    const tipoEntrega =
        obtenerTipoEntrega();

    const fechaSeleccionada =
        convertirFechaInput(
            fechaEntregaInput.value
        );

    const hoy =
        obtenerFechaHoy();


    fechaEntregaInput.setCustomValidity("");

    fechaAyuda.classList.remove(
        "fecha-error"
    );


    if (!fechaSeleccionada) {

        const mensaje =
            "Selecciona una fecha de entrega.";

        fechaEntregaInput.setCustomValidity(
            mensaje
        );

        fechaAyuda.textContent =
            mensaje;

        fechaAyuda.classList.add(
            "fecha-error"
        );

        if (mostrarAlerta) {
            alert(mensaje);
        }

        return false;

    }


    if (tipoEntrega === "lunes") {

        const proximoLunes =
            obtenerProximoLunes(hoy);

        if (
            fechaSeleccionada < proximoLunes ||
            !esLunes(fechaSeleccionada)
        ) {

            const mensaje =
                "Los pedidos con queso o chorizo solo pueden entregarse en lunes.";

            fechaEntregaInput.setCustomValidity(
                mensaje
            );

            fechaAyuda.textContent =
                mensaje;

            fechaAyuda.classList.add(
                "fecha-error"
            );

            if (mostrarAlerta) {
                alert(mensaje);
            }

            return false;

        }

    }


    if (tipoEntrega === "laboral") {

        const primerDiaLaboral =
            obtenerPrimerDiaLaboralDisponible(
                hoy
            );

        if (
            fechaSeleccionada <
                primerDiaLaboral ||
            !esDiaLaboral(
                fechaSeleccionada
            )
        ) {

            const mensaje =
                "La carne seca solamente puede entregarse de lunes a viernes.";

            fechaEntregaInput.setCustomValidity(
                mensaje
            );

            fechaAyuda.textContent =
                mensaje;

            fechaAyuda.classList.add(
                "fecha-error"
            );

            if (mostrarAlerta) {
                alert(mensaje);
            }

            return false;

        }

    }


    if (tipoEntrega === "lunes") {

        fechaAyuda.textContent =
            "Fecha válida. El pedido se entregará en lunes.";

    } else {

        fechaAyuda.textContent =
            "Fecha válida. La entrega será de lunes a viernes.";

    }

    return true;

}


// ============================================================
// FORMATEAR FECHA PARA WHATSAPP
// ============================================================

function formatearFechaParaMensaje(
    fechaTexto
) {

    const fecha =
        convertirFechaInput(
            fechaTexto
        );

    if (!fecha) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(fecha);

}


// ============================================================
// CREAR DETALLE DEL PEDIDO
// ============================================================

function crearDetallePedido() {

    const lineas = [];


    if (cantidades.queso > 0) {

        const subtotal =
            cantidades.queso *
            PRECIO_MEDIO_QUESO;

        lineas.push(
            `🧀 Queso: ${cantidades.queso} medio(s) x $${PRECIO_MEDIO_QUESO} = $${subtotal}`
        );

    }


    if (cantidades.chorizo > 0) {

        const subtotal =
            cantidades.chorizo *
            PRECIO_MEDIO_CHORIZO;

        lineas.push(
            `🌶️ Chorizo: ${cantidades.chorizo} medio(s) x $${PRECIO_MEDIO_CHORIZO} = $${subtotal}`
        );

    }


    Object
        .entries(cantidades.carneSeca)
        .forEach(
            ([sabor, cantidad]) => {

                if (cantidad <= 0) {
                    return;
                }

                const nombreSabor =
                    NOMBRES_SABORES[sabor];

                if (
                    typeof PRECIO_CARNE_SECA ===
                    "number"
                ) {

                    const subtotal =
                        cantidad *
                        PRECIO_CARNE_SECA;

                    lineas.push(
                        `🥩 Carne seca ${nombreSabor}: ${cantidad} ${UNIDAD_CARNE_SECA}(s) x $${PRECIO_CARNE_SECA} = $${subtotal}`
                    );

                } else {

                    lineas.push(
                        `🥩 Carne seca ${nombreSabor}: ${cantidad} ${UNIDAD_CARNE_SECA}(s) — precio por confirmar`
                    );

                }

            }
        );


    return lineas.join("\n");

}


// ============================================================
// ENVIAR PEDIDO POR WHATSAPP
// ============================================================

btnWhatsapp.addEventListener(
    "click",
    enviarWhatsapp
);


function enviarWhatsapp() {

    const nombre =
        nombreInput.value.trim();

    const fechaEntrega =
        fechaEntregaInput.value;

    const comentarios =
        comentariosInput.value.trim();


    if (nombre === "") {

        alert(
            "Escribe tu nombre."
        );

        nombreInput.focus();

        return;

    }


    if (!pedidoTieneProductos()) {

        alert(
            "Selecciona al menos un producto."
        );

        return;

    }


    if (
        !validarFechaSeleccionada(true)
    ) {

        fechaEntregaInput.focus();

        return;

    }


    const total =
        calcularTotalProductosConPrecio();

    const tieneCarneSeca =
        pedidoTieneCarneSeca();

    const carneSecaSinPrecio =
        tieneCarneSeca &&
        typeof PRECIO_CARNE_SECA !== "number";

    const detallePedido =
        crearDetallePedido();

    const fechaFormateada =
        formatearFechaParaMensaje(
            fechaEntrega
        );


    let textoTotal = "";

    if (carneSecaSinPrecio) {

        textoTotal =
            total > 0
                ? `$${total} más carne seca por confirmar`
                : "Precio por confirmar";

    } else {

        textoTotal =
            `$${total}`;

    }


    let mensaje =
`🛒 *NUEVO PEDIDO*

👤 *Nombre:*
${nombre}

📦 *Productos:*
${detallePedido}

📅 *Fecha de entrega:*
${fechaFormateada}

💲 *Total:*
${textoTotal}

📝 *Comentarios:*
${comentarios || "Sin comentarios."}`;


    if (carneSecaSinPrecio) {

        mensaje +=
`\n\n⚠️ *El precio de la carne seca debe confirmarse antes de completar el pedido.*`;

    }


    const url =
        `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


// ============================================================
// INICIALIZACIÓN
// ============================================================

actualizarPrecioCarneSecaMostrado();
actualizar();
