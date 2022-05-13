var nombre = '';
var inicio = 0;
var fin = '';
var tiempo = 0;
var media = 0;
var max_porc = 0;
var comentarios = '';

var indice = 0;
var indice_poi_asociado = 0;

/* function get_nombre_tour() {
    nombre = window.parent.get_nombre_tour();
    console.log(nombre);
    return nombre;
}

function get_nombre_etapa() {
    return window.parent.get_nombre_etapa();
}

function salir() {
    window.parent.desbloquea_insertar_registro();
}

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');

    if (indexOfSpace === -1) {
        return '';
    }

    return str.substring(indexOfSpace + 1);
} */


async function add_bajada() {
    var nombre_etapa = window.parent.get_nombre_etapa();

    var punto = document.getElementById('nombre').value;
    var inicio = document.getElementById('inicio').value;
    var fin = document.getElementById('fin').value;

    var distancia_float = parseFloat(fin) - parseFloat(inicio);
    var distancia = parseFloat(distancia_float).toFixed(1).toString();

    var tiempo = document.getElementById('tiempo').value;
    var media = document.getElementById('media').value;
    var max_porc = document.getElementById('max_porc').value;

    if (edicion == 'S') {
        var nombre = "Inicio " + punto;
        var nombre_fin = "Fin " + punto;
        var comentarios = 'D: ' + distancia + 'Km. * T: ' + tiempo + " * M: " + media + "% * Max: " + max_porc + "%";
        var comentarios_fin = document.getElementById('comentarios_bajada').value;
        var lista_atributos = ['inicio_bajada'];
        var lista_atributos_fin = ['fin_bajada'];

        db_modifica_registro(indice, nombre, inicio, comentarios, lista_atributos).then(
            function () {
                db_modifica_registro(indice_poi_asociado, nombre_fin, fin, comentarios_fin, lista_atributos_fin).then(
                    function () {
                        db_get_all_pois(nombre_etapa).then(
                            function (pois) {
                                window.parent.refresca_etapa(pois);
                                salir();
                            }
                        );
                    }
                );
            });

        return;
    }
    else {
        indice = window.parent.get_new_indice();

        var nombre = "Inicio " + punto;
        var nombre_fin = "Fin " + punto;
        var comentarios = 'D: ' + distancia + 'Km. * T: ' + tiempo + " * M: " + media + "% * Max: " + max_porc + "%";
        var comentarios_fin = document.getElementById('comentarios_bajada').value;
        var lista_atributos = ['inicio_bajada'];
        var lista_atributos_fin = ['fin_bajada'];
        indice_fin = window.parent.get_new_indice(1);
        indice_poi_asociado = indice_fin;
        db_add(indice, nombre, inicio, comentarios, lista_atributos, indice_fin, 3).then(
            function () {
                /* añadimos el punto final */
                db_add(indice_fin, nombre_fin, fin, comentarios_fin, lista_atributos_fin, indice, 103).then(
                    function () {
                        db_get_all_pois(nombre_etapa).then(
                            function (pois) {
                                window.parent.refresca_etapa(pois);
                            }
                        );
                    });
            });

        document.getElementById('nombre').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('fin').value = '';
        document.getElementById('tiempo').value = '';
        document.getElementById('media').value = '';
        document.getElementById('max_porc').value = '';

        document.getElementById('comentarios_bajada').value = '';

        document.getElementById('nombre').focus();
    }
}

async function set_valores_formulario(indice_poi) {
    indice = indice_poi;

    var nombre_etapa = window.parent.get_nombre_etapa();
    await db_get_poi(nombre_etapa, indice).then(
        async function (poi) {
            indice_poi_asociado = poi.punto_referencia;
            await db_get_poi(nombre_etapa, indice_poi_asociado).then(
                function (poi_asociado) {
                    if (poi.tipo_poi == 3) {
                        inicio = poi.distancia;
                        fin = poi_asociado.distancia;
                        var cadenas = poi.notas.split('*');
                        var notas = poi_asociado.notas;
                    }
                    else {
                        inicio = poi_asociado.distancia;
                        fin = poi.distancia;
                        var cadenas = poi_asociado.notas.split('*');
                        var notas = poi.notas;
                    }

                    tiempo = cadenas[1].trim().split(' ')[1];
                    media = cadenas[2].trim().split(' ')[1].slice(0, -1);
                    max_porc = cadenas[3].trim().split(' ')[1].slice(0, -1);

                    document.getElementById('nombre').value = removeFirstWord(poi.nombre_poi);
                    document.getElementById('inicio').value = inicio;
                    document.getElementById('fin').value = fin;
                    document.getElementById('tiempo').value = tiempo;
                    document.getElementById('media').value = media;
                    document.getElementById('max_porc').value = max_porc;
                    document.getElementById('comentarios_bajada').value = notas;

                    $(".chosen-select").val(poi.atributos);
                    $(".chosen-select").trigger("chosen:updated");
                }
            );
        }
    );
}