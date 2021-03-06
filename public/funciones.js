function get_nombre_tour() {
    nombre = window.parent.get_nombre_tour();
    console.log('el nombre es: ' + nombre);
    return nombre;
}

function salir() {
    window.parent.desbloquea_insertar_registro();
}

function get_nombre_etapa() {
    return window.parent.get_nombre_etapa();
}

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');

    if (indexOfSpace === -1) {
        return '';
    }

    return str.substring(indexOfSpace + 1);
}

function compara_distancia(a, b) {
    if (parseFloat(a.distancia) < parseFloat(b.distancia)) {
        return -1;
    }
    if (parseFloat(a.distancia) > parseFloat(b.distancia)) {
        return 1;
    }
    return 0;
}

function compara(a, b) {
    if (a.nombre_etapa < b.nombre_etapa) {
        return -1;
    }
    if (a.nombre_etapa > b.nombre_etapa) {
        return 1;
    }
    return 0;
}
