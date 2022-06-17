var nombre = '';
var distancia = 0;
var notas = '';
var indice = 0;

function add() {
    var nombre_etapa = window.parent.get_nombre_etapa();

    if (edicion == 'S') {
        var punto = document.getElementById('nombre').value;
        var distancia = parseFloat(document.getElementById('distancia').value);
        var comentarios = document.getElementById('comentarios').value;
        var lista_atributos = $(".chosen-select").val();

        db_modifica_registro(indice, punto, distancia, comentarios, lista_atributos).then(
            function () {
                db_get_all_pois(nombre_etapa).then(
                    function (pois) {
                        window.parent.refresca_etapa(pois);
                        salir();
                    }
                );
            });
    }
    else {
        indice = window.parent.get_new_indice();

        var nombre = document.getElementById('nombre').value;
        var distancia = parseFloat(document.getElementById('distancia').value);
        var comentarios = document.getElementById('comentarios').value;
        var lista_atributos = $(".chosen-select").val();

        db_add(indice, nombre, distancia, comentarios, lista_atributos, indice, 1).then(
            function () {
                db_get_all_pois(nombre_etapa).then(
                    function (pois) {
                        window.parent.refresca_etapa(pois);
                    }
                );
            });
    }

    if (edicion == 'S') {
        salir();
    }

    document.getElementById('nombre').value = '';
    document.getElementById('distancia').value = '';
    document.getElementById('comentarios').value = '';

    document.getElementById('nombre').focus();
}


async function set_valores_formulario(indice_poi) {
    indice = indice_poi;
    var nombre_etapa = window.parent.get_nombre_etapa();
    await db_get_poi(nombre_etapa, indice).then(
        function (poi) {
            console.log('poi', poi);
            document.getElementById('nombre').value = poi.nombre_poi;
            document.getElementById('distancia').value = poi.distancia;
            document.getElementById('comentarios').value = poi.notas;
            $(".chosen-select").val(poi.atributos);
            $(".chosen-select").trigger("chosen:updated");
        }
    );
}