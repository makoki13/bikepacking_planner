var nombre = '';
var inicio = 0;
var fin = '';
var distancia = 0;
var media = 0;
var comentarios = '';

var indice = 0;
var indice_poi_asociado = 0;

function salir() {
    window.parent.desbloquea_insertar_registro();
}

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');

    if (indexOfSpace === -1) {
        return '';
    }

    return str.substring(indexOfSpace + 1);
}

function add_cp() {
    var nombre_etapa = window.parent.get_nombre_etapa();

    var punto = document.getElementById('nombre').value;
    var inicio = document.getElementById('inicio').value;
    var distancia = document.getElementById('distancia').value;
    var ascension = document.getElementById('ascension').value;
    var media = document.getElementById('media').value;

    var fin = parseFloat(inicio) + parseFloat(distancia);

    if (edicion == 'S') {
        var nombre = "Inicio " + punto;
        console.log('nombre', nombre);
        var comentarios = 'D: ' + distancia + 'Km. * Asc: ' + ascension + " * M: " + media + "%"
        var lista_atributos = ['inicio_subida'];

        db_modifica_registro(indice, nombre, inicio, comentarios, lista_atributos).then(
            function () {
                var nombre_fin = "Fin " + punto;
                var comentarios_fin = document.getElementById('comentarios_cp').value;
                var lista_atributos_fin = ['fin_subida'];
                console.log('indice asociado', indice_poi_asociado);
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
        console.log('adicion cp');
        indice = window.parent.get_new_indice();

        var nombre = "Inicio " + punto;
        var comentarios = 'D: ' + distancia + 'Km. * Asc: ' + ascension + " * M: " + media + "%"
        var lista_atributos = ['inicio_subida'];
        indice_fin = window.parent.get_new_indice(1);
        indice_poi_asociado = indice_fin;
        db_add(indice, nombre, inicio, comentarios, lista_atributos, indice_fin, 4).then(
            function () {
                /* añadimos el punto final */
                var nombre = "Fin " + punto;
                var comentarios = document.getElementById('comentarios_cp').value;
                var lista_atributos = ['fin_subida'];
                db_add(indice_fin, nombre, fin, comentarios, lista_atributos, indice, 104).then(
                    function () {
                        console.log('add cp', 'indice', indice, 'segundo indice', indice_fin);
                        db_get_all_pois(nombre_etapa).then(
                            function (pois) {
                                console.log('nombre etapa', nombre_etapa, 'refresco pois', pois);
                                window.parent.refresca_etapa(pois);
                            }
                        );
                    });
            });

        document.getElementById('nombre').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('distancia').value = '';
        document.getElementById('ascension').value = '';
        document.getElementById('media').value = '';
        document.getElementById('comentarios_cp').value = '';
        document.getElementById('nombre').focus();
    }
}


async function set_valores_formulario(indice_poi) {
    indice = indice_poi;

    var nombre_etapa = window.parent.get_nombre_etapa();
    await db_get_poi(nombre_etapa, indice).then(
        async function (poi) {
            console.log('poi', poi);
            indice_poi_asociado = poi.punto_referencia;
            await db_get_poi(nombre_etapa, indice_poi_asociado).then(
                function (poi_asociado) {
                    document.getElementById('nombre').value = removeFirstWord(poi.nombre_poi);
                    if (poi.tipo_poi == 4) {
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

                    console.log('cadenas', cadenas);
                    distancia = cadenas[0].trim().split(' ')[1].slice(0, -3);
                    ascension = cadenas[1].trim().split(' ')[1];
                    media = cadenas[2].trim().split(' ')[1].slice(0, -1);

                    document.getElementById('inicio').value = inicio;
                    document.getElementById('distancia').value = distancia;
                    document.getElementById('ascension').value = ascension;
                    document.getElementById('media').value = media;
                    document.getElementById('comentarios_cp').value = notas;

                    $(".chosen-select").val(poi.atributos);
                    $(".chosen-select").trigger("chosen:updated");
                }
            );
        }
    );
}