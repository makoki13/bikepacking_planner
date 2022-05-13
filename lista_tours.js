function get_lista_tours() {
    select = document.getElementById('combo_edicion');
    Dexie.getDatabaseNames().then(function (names) {
        if (names.length === 0) {
            console.log("No hay bases de datos");
        } else {
            var html = '';
            for (var i = 0; i < names.length; i++) {
                html += '<tr><td class="opciones" onclick="carga_tour(this);">' + names[i] + '</td></tr>';
            }
            select.innerHTML = html;
        }
    });
}

function carga_tour(o) {
    nombre = o.innerHTML;
    if (o.value == '') {
        return;
    }
    window.parent.cargar_tour(nombre);
}