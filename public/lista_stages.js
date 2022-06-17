function carga_lista_stages() {
    db_get_stages().then(function (registros) {
        registros.sort(compara);
        var lista_stages = Array();
        if (registros.length === 0) {
            //console.log("No hay bases de datos");
        } else {
            for (var i = 0; i < registros.length; i++) {
                //console.log('stage: ', registros[i].nombre_etapa);
                if (!lista_stages.includes(registros[i].nombre_etapa)) {
                    lista_stages.push(registros[i].nombre_etapa);
                }
            }

            select = document.getElementById('combo_edicion');
            var html = '';
            for (var i = 0; i < lista_stages.length; i++) {
                html +=
                    '<tr onmouseover="this.children[1].style.visibility=\'visible\';" onmouseout="this.children[1].style.visibility=\'hidden\';">' +
                    '<td class="opciones" onclick="carga_stage(this);">' + lista_stages[i] + '</td>' +
                    '<td class="opciones" style="visibility:hidden;" onclick="borra_stage(\'' + lista_stages[i] + '\');">B</td>' +
                    '</tr>';
            }
            select.innerHTML = html;
        }
    });
}

function borra_stage(nombre) {
    var resp = confirm("Are you sure you want to delete the stage " + nombre + "?");
    if (!resp) return;
    var resp = confirm("Confirm the election");
    if (!resp) return;

    console.log('antes de borrar');
    db_delete_stage(nombre).then(function () {
        console.log('ya he borrado, voy a cargar');
        carga_lista_stages();
    });
}

function set_mensaje_espera() {
    document.getElementById('combo_edicion').innerHTML = '<div class="mensaje_espera">Cargando...</div>';
}

function carga_stage(o) {
    nombre = o.innerHTML;
    if (o.value == '') {
        return;
    }
    window.parent.cargar_etapa_new(nombre);
}