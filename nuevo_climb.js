var nombre = '';
var inicio = 0;
var fin = '';
var tiempo = 0;
var fiets = 0;
var media = 0;
var max_porc = 0;
var comentarios = '';
var indice = 0;

function salir() {
    window.parent.desbloquea_insertar_registro();
}

async function add() {
    var nombre_etapa = window.parent.get_nombre_etapa();

    var punto = document.getElementById('nombre').value;
    var inicio = document.getElementById('inicio').value;
    var fin = document.getElementById('fin').value;

    var distancia_float = parseFloat(fin) - parseFloat(inicio);
    var distancia = parseFloat(distancia_float).toFixed(1).toString();

    var tiempo = document.getElementById('tiempo').value;
    var fiets = document.getElementById('fiets').value;
    var media = document.getElementById('media').value;
    var max_porc = document.getElementById('max_porc').value;

    if (edicion == 'S') {
        console.log('edicion', 'indice', indice);

        // pendiente la modificacion de una subida
        /* db_modifica_registro(indice, punto, inicio, comentarios, lista_atributos).then(
            function () {
                db_get_all_pois(nombre_etapa).then(
                    function (pois) {
                        window.parent.refresca_etapa(pois);
                    }
                );
            });

        window.parent.borra_punto(indice); */

        salir();
    }
    else {
        console.log('adicion');
        indice = window.parent.get_new_indice();

        var nombre = "Inicio " + punto;
        var comentarios = 'D: ' + distancia + 'Km. * T: ' + tiempo + " * F: " + fiets + " * M: " + media + "% * Max: " + max_porc + "%";
        var lista_atributos = ['inicio_subida'];
        indice_fin = window.parent.get_new_indice(1);
        db_add(indice, nombre, inicio, comentarios, lista_atributos, indice_fin).then(
            function () {
                /* añadimos el punto final */
                var nombre = "Fin " + punto;
                var comentarios = document.getElementById('comentarios').value;
                var lista_atributos = ['fin_subida'];
                db_add(indice_fin, nombre, fin, comentarios, lista_atributos, indice).then(
                    function () {
                        console.log('add', 'indice', indice, 'segundo indice', indice_fin);
                        db_get_all_pois(nombre_etapa).then(
                            function (pois) {
                                console.log('nombre etapa', nombre_etapa, 'refresco pois', pois);
                                window.parent.refresca_etapa(pois);
                            }
                        );
                    });
            });


        /* db_get_all_pois(nombre_etapa).then(
            function (pois) {
                console.log('nombre etapa', nombre_etapa, 'refresco pois II', pois);
                window.parent.refresca_etapa(pois);
            }
        ); */

        //window.parent.refresca_etapa(pois);

        document.getElementById('nombre').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('fin').value = '';
        document.getElementById('tiempo').value = '';
        document.getElementById('fiets').value = '';
        document.getElementById('media').value = '';
        document.getElementById('max_porc').value = '';

        document.getElementById('comentarios').value = '';

        document.getElementById('nombre').focus();
    }




    /* var punto = document.getElementById('nombre').value;
    var inicio = document.getElementById('inicio').value;
    var fin = document.getElementById('fin').value;

    var distancia = parseFloat(fin) - parseFloat(inicio);



    var comentarios = document.getElementById('comentarios').value;

    
    indice_fin = window.parent.get_new_indice(1);
    window.parent.add(indice, "Inicio " + punto, inicio, 'D: ' + distancia + 'Km. * T: ' + tiempo + " * F: " + fiets + " * M: " + media + "% * Max: " + max_porc + "%",
        ['inicio_subida'], indice_fin);
    
    window.parent.add(indice_fin, "Fin " + punto, fin, comentarios, ['fin_subida'], indice);

    if (edicion == 'S') {
        salir();
    }

    document.getElementById('nombre').value = '';
    document.getElementById('inicio').value = '';
    document.getElementById('fin').value = '';
    document.getElementById('tiempo').value = '';
    document.getElementById('fiets').value = '';
    document.getElementById('media').value = '';
    document.getElementById('max_porc').value = '';

    document.getElementById('comentarios').value = '';

    document.getElementById('nombre').focus(); */
}


function set_valores_formulario(nombre, inicio, fin, tiempo, fiets, media, max_porc, notas) {
    document.getElementById('nombre').value = nombre;
    document.getElementById('inicio').value = inicio;
    document.getElementById('fin').value = fin;
    document.getElementById('tiempo').value = tiempo;
    document.getElementById('fiets').value = fiets;
    document.getElementById('media').value = media;
    document.getElementById('max_porc').value = max_porc;

    document.getElementById('comentarios').value = notas;
}