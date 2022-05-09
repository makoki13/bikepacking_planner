var pois;
var indice = 0;

function compara_distancia(a, b) {
    if (parseFloat(a.distancia) < parseFloat(b.distancia)) {
        return -1;
    }
    if (parseFloat(a.distancia) > parseFloat(b.distancia)) {
        return 1;
    }
    return 0;
}

function muestra(pois) {
    $("#cuerpo_tabla tr").remove();
    var fila = '';
    $.each(pois, function (key, value) {
        fila += '<tr class="fila" onmouseover="this.style.backgroundColor = \'#FFFACD\';" onmouseout="this.style.backgroundColor = \'white\';">';

        var clase_celda = '';

        if (typeof value.atributos !== "undefined") {
            $.each(value.atributos, function (key, value) {
                clase_celda += 'atributo_' + value + ' ';
            });
        }

        fila += '<td class="' + clase_celda + '" onclick="set_nombre(this,' + value._indice + ');">' + value.nombre_poi + '</td>';

        var distancia = parseFloat(value.distancia);
        fila += '<td onclick="set_distancia(this,' + value._indice + ')">' + distancia.toFixed(1) + '</td>';

        if (typeof value.intervalo !== "undefined") {
            fila += '<td>' + value.intervalo + '</td>';
        }
        else {
            fila += '<td>&nbsp;</td>';
        }

        // solo para control
        //value.notas = 'Tipo: ' + value.tipo_poi + ' indice: ' + value._indice + 'ref:' + value.punto_referencia;

        if (typeof value.notas !== "undefined") {
            fila += '<td class="notas" onclick="set_notas(this,' + value._indice + ');">' + value.notas + '</td>';
        }
        else {
            fila += '<td class="notas" onclick="set_notas(this,' + value._indice + ');">&nbsp</td>';
        }

        var evento_click = '';
        var tipo_poi = parseInt(value.tipo_poi);
        switch (tipo_poi) {
            case 1:
                console.log('tipo poi---', value.tipo_poi);
                evento_click = 'edita_registro(' + value._indice + ');';
                break;
            case 2:
                console.log('tipo poi---', value.tipo_poi);
                evento_click = 'edita_subida(' + value._indice + ');';
                break;
            case 3:
                console.log('tipo poi---', value.tipo_poi);
                evento_click = 'edita_bajada(' + value._indice + ');';
                break;
            case 4:
                console.log('tipo poi---', value.tipo_poi);
                evento_click = 'edita_cp(' + value._indice + ');';
                break;
            default:
                console.log('tipo poi--- (unk)', value.tipo_poi);
                break;
        }

        if (typeof value.atributos !== "undefined") {
            var clase_cero = '';
            if (value.atributos.length == 0) {
                clase_cero = 'cero';
            }
            fila += '<td class="atributos ' + clase_cero + '" onclick="' + evento_click + '">' + value.atributos.length + '</td>';
        }
        else {
            fila += '<td class="atributos" onclick="' + evento_click + '">&nbsp</td>';
        }

        console.log('fila', fila);

        var titulo = '';
        if (value.punto_referencia) {
            if (value._indice != value.punto_referencia) {
                var punto_de_referencia = _get_punto(value.punto_referencia)
                if (punto_de_referencia) {
                    titulo = punto_de_referencia.nombre_poi + ' km ' + punto_de_referencia.distancia;
                }
            }
        }
        fila += '<td title="' + titulo + '"><button onclick="borra(' + value._indice + ',' + value.punto_referencia + ')" style="color:white">B</button></td>';
        fila += '</tr>';
    })

    $("#cuerpo_tabla").append(fila);
}

function recalcula(pois) {
    var distancia_anterior = 0; var lista = [];
    var i = 0;

    pois.sort(compara_distancia);

    $.each(pois, function (key, value) {
        if (i > 0) {
            var valor_distancia_anterior = parseFloat(value.distancia) - parseFloat(distancia_anterior);
        }

        lista[i] = {};
        lista[i]._indice = value.id;
        lista[i].nombre_poi = value.nombre_poi;
        lista[i].distancia = value.distancia;
        if (i > 0) {
            lista[i - 1].intervalo = valor_distancia_anterior.toFixed(1);
        }
        lista[i].notas = value.notas;

        lista[i].atributos = value.atributos;
        lista[i].punto_referencia = value.punto_referencia;
        lista[i].tipo_poi = value.tipo_poi;

        distancia_anterior = parseFloat(value.distancia);

        i++;
    })

    return lista;
}

async function cargar_etapa(pois) {
    pois = recalcula(pois);
    muestra(pois);

    console.log('cargar etapa', pois);

    $.each(pois, function (key, value) {
        if (value._indice > indice) {
            indice = value._indice;
        }
    });

    console.log('valor indice', indice);
}

function get_new_indice(incremento) {
    return indice + 1 + incremento;
}


/************************ funciones de insercion , modificacion y borrado  */
/************************ funciones de insercion , modificacion y borrado  */
/************************ funciones de insercion , modificacion y borrado  */


/* add a new poi to lista */
/* function add_poi(nombre_poi, distancia, notas, atributos, punto_referencia) {
    pois.append({ _indice: get_new_indice(1), nombre_poi, distancia, notas, atributos, punto_referencia });
}
 */

/* function add(_indice, nombre_poi, distancia, notas, atributos, punto_referencia) {
    pois.push({ _indice, nombre_poi, distancia, notas, atributos, punto_referencia });

    pois.sort(compara_distancia);

    pois = recalcula(pois);

    muestra(pois);
}
 */

function borra(indice, indice_de_referencia) {
    var nombre_etapa = window.parent.get_nombre_etapa();

    console.log('borra', indice, indice_de_referencia);

    db_delete(indice).then(
        function () {
            console.log('borrado primer punto', indice);

            if (indice != indice_de_referencia) {
                console.log('borrado segundo punto', indice_de_referencia);
                db_delete(indice_de_referencia).then(
                    function () {
                        db_get_all_pois(nombre_etapa).then(
                            function (pois) {
                                cargar_etapa(pois);
                            }
                        );
                    });
            }
            else {
                console.log('borrado unico punto', indice);
                db_get_all_pois(nombre_etapa).then(
                    function (pois) {
                        cargar_etapa(pois);
                    }
                );
            }
        });
}

function modifica_nombre_poi(indice, nombre_poi) {
    db_modifica_campo(indice, 'nombre_poi', nombre_poi).then(
        function () {
            console.log('modificado modifica_nombre_poi');
        }
    );
}

function set_nombre(o, indice) {
    var resp = prompt("Texto", o.innerHTML);
    if (!resp) return;

    if ($.trim(resp) == '') {
        alert("El texto no puede quedar vacío");
        return;
    }

    o.innerHTML = resp;

    modifica_nombre_poi(indice, resp);
}

function set_notas(o, indice) {
    var texto_actual = o.innerHTML;
    var resp = prompt("Notas", texto_actual);
    if (!resp) return;

    o.innerHTML = resp;

    db_modifica_campo(indice, 'notas', resp).then(
        function () {
        }
    );
}

function set_distancia(o, indice) {
    var distancia = o.innerHTML;

    var resp = prompt("Distancia", distancia);
    if (!resp) return;

    if ($.trim(resp) == '') {
        alert("El valor no puede quedar vacío");
        return;
    }

    o.innerHTML = resp;

    var nombre_etapa = window.parent.get_nombre_etapa();

    db_modifica_campo(indice, 'distancia', resp).then(
        function () {
            db_get_all_pois(nombre_etapa).then(
                function (pois) {
                    cargar_etapa(pois);
                }
            );
        }
    );
}

function edita_registro(indice) {
    window.parent.edita_registro(indice);
}

function edita_subida(indice) {
    window.parent.edita_ascenso(indice);
}

function get_pois() {
    return pois;
}

/********************* funciones no revisadas */
/********************* funciones no revisadas */
/********************* funciones no revisadas */


function _get_punto(indice) {
    var punto = null;
    $.each(pois, function (key, value) {
        console.log(value._indice + ' ' + indice);
        if (value._indice == indice) {
            punto = pois[key];
        }
    });

    return punto;
}

/* 
function get_punto(indice) {
    window.parent.envia_punto(_get_punto(indice));
} */



