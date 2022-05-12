function get_nombre_tour() {
    nombre = window.parent.get_nombre_tour();
    console.log(nombre);
    return nombre;
}

function carga_stage(o) {
    nombre = o.innerHTML;
    if (o.value == '') {
        return;
    }
    window.parent.cargar_etapa_new(nombre);
}