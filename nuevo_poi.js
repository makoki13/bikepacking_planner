var nombre = '';
var distancia = 0;
var notas = '';
var indice = 0;

function salir() {
    window.parent.desbloquea_insertar_registro();
}

function add() {
    if (edicion == 'S') {
        window.parent.borra_punto(indice);
    }
    else {
        indice = window.parent.get_new_indice();
    }
    var punto = document.getElementById('nombre').value;
    var distancia = parseFloat(document.getElementById('distancia').value);
    var comentarios = document.getElementById('comentarios').value;
    var lista_atributos = $(".chosen-select").val();

    window.parent.add(indice, punto, distancia, comentarios, lista_atributos, indice);

    if (edicion == 'S') {
        salir();
    }

    document.getElementById('nombre').value = '';
    document.getElementById('distancia').value = '';
    document.getElementById('comentarios').value = '';

    document.getElementById('nombre').focus();

}


async function set_valores_formulario(indice) {
    console.log('indice', indice);
    await db_get_poi(indice).then(
        function (poi) {
            document.getElementById('nombre').value = poi.nombre_poi;
            document.getElementById('distancia').value = poi.distancia;
            document.getElementById('comentarios').value = poi.notas;
            $(".chosen-select").val(poi.atributos);
            $(".chosen-select").trigger("chosen:updated");
        }
    );
}