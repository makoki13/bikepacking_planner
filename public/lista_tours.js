function muestra_tours(lista) {
    select = document.getElementById('combo_edicion');
    var lista_tours = [];
    var html = '';
    for (var i = 0; i < lista.length; i++) {

        html +=
            '<tr onmouseover="this.children[1].style.visibility=\'visible\';" onmouseout="this.children[1].style.visibility=\'hidden\';">' +
            '<td class="opciones" onclick="carga_tour(this);">' + lista[i] + '</td>' +
            '<td class="opciones" style="visibility:hidden;" onclick="borra_tour(\'' + lista[i] + '\');">B</td>' +
            '</tr>';
        lista_tours.push(lista[i]);
        //console.log('he pasado ', i, lista_tours);
    }
    select.innerHTML = html;

    return lista_tours;
}

function get_lista_tours() {
    var directory = 'tours/tours.json';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", directory, false);
    xmlHttp.send(null);
    var estado = xmlHttp.status;
    var files = xmlHttp.responseText;
    //console.log('files', files);


    if (xmlHttp.readyState === 4) {
        if (estado === 200 || estado == 0) {

            var tours = JSON.parse(files);
            //console.log('tours', tours, tours.length);

            var lista_tours = muestra_tours(tours);

            //console.log('lista tours inside', lista_tours);
            return lista_tours;
        }
    }

    document.getElementById('combo_edicion').innerHTML = '<tr><td class="opciones" onclick="carga_tour(this);">No hay tours</td></tr>';
    return [];

}

function set_mensaje_espera() {
    document.getElementById('combo_edicion').innerHTML = '<div class="mensaje_espera">Cargando...</div>';
}

function carga_tour(o) {
    nombre = o.innerHTML;
    if (o.value == '') {
        return;
    }
    window.parent.cargar_tour(nombre);
}

function borra_tour(nombre) {
    window.parent.borra_tour(nombre);
}