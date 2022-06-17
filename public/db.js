var db;
var _nombre_etapa;
var _nombre_tour;
var _nombre_db = 'bikepacking_makoki_enterprises';

reload_db();

/** funciones de consulta  */ /** funciones de consulta  */ /** funciones de consulta  */

/** Obtiene la lista de stages */
async function db_get_stages() {
    return await db.pruebas.toCollection().distinct().toArray();
}

/** Obtiene la lista de pois de una stage */
async function db_get_all_pois(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    if (!db) {
        return reload_db().then(async function () {
            return await db.pruebas.where('nombre_etapa').equals(nombre_etapa).toArray();
        });
    }
    else {
        return await db.pruebas.where('nombre_etapa').equals(nombre_etapa).toArray();
    }
}

/** Obtiene un poi de una stage */
async function db_get_poi(nombre_etapa, indice) {
    var valor;
    var pois = await db_get_all_pois(nombre_etapa);
    pois.forEach(element => {
        if (element.id_punto == indice) {
            valor = element;
        }
    });

    return valor;
}

/** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */
/** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */
/** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */
async function db_crea() {
    console.log('creando db');
    db = new Dexie(_nombre_db);
    db.version(1).stores({
        pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,tipo_poi,[id+nombre_etapa],[id_punto+nombre_etapa]'
    });
    db.open().then(function () { }).catch(function (err) { });
}

async function db_borra_database() {
    console.log('voy a borrar');
    await reload_db().then(function () {
        db.delete().then(function () {
            console.log('borrado');
        });
    });
}

async function reload_db() {
    if (!db) {
        db_crea();
    }
}

/** Crea un nuevo tour */
async function db_crea_tour(tour) {
    _nombre_tour = tour;
    db_crea();
}

/** Crea un nuevo stage. En realidad lo que hace es asignar el nombre del stage para que las operaciones se realicen en su nombre  */
async function db_crea_prueba(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
}

/** añade un punto a una stage */
async function db_add(id_punto, nombre, distancia, notas, atributos, punto_referencia, tipo_poi) {
    if (!_nombre_etapa) {
        _nombre_etapa = get_nombre_etapa();
    }

    db.transaction('rw', db.pruebas, function () {
        // Let's add some data to db:
        insert_object = {
            nombre_etapa: _nombre_etapa,
            id_punto: id_punto,
            nombre_poi: nombre,
            distancia: distancia,
            notas: notas,
            atributos: atributos,
            punto_referencia: punto_referencia,
            tipo_poi: tipo_poi
        };
        db.pruebas.add(insert_object);
    }).catch(function (err) {
        console.error(err.stack || err);
    }).then(() => {
        db_backup();
    });
}

/** borra un punto de una stage */
async function db_delete(nombre_etapa, id_punto) {
    _nombre_etapa = nombre_etapa;
    db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), nombre_etapa]).delete().then(function () {
        db_backup();
    }).catch(function (err) {
        console.error(err.stack || err);
    });

    //return await db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), nombre_etapa]).delete();
}

/** modifica un punto de una stage */
async function db_modifica_campo(id, campo, valor) {
    switch (campo) {
        case 'nombre_poi':
            await db.pruebas.where({ nombre_etapa: _nombre_etapa, id_punto: id }).modify({ nombre_poi: valor });
            break;
        case 'distancia':
            await db.pruebas.where({ nombre_etapa: _nombre_etapa, id_punto: id }).modify({ distancia: valor });
            break;
        case 'notas':
            await db.pruebas.where({ nombre_etapa: _nombre_etapa, id_punto: id }).modify({ notas: valor });
            break;
        case 'atributos':
            await db.pruebas.where({ nombre_etapa: _nombre_etapa, id_punto: id }).modify({ atributos: valor });
            break;
        case 'punto_referencia':
            await db.pruebas.where({ nombre_etapa: _nombre_etapa, id_punto: id }).modify({ punto_referencia: valor });
            break;
        default:
            console.log('campo no reconocido');
            break;
    }
    db_backup();
}

/** modifica un registro de una stage */
async function db_modifica_registro(id_punto, valor_nombre_poi, distancia, notas, atributos) {
    db.transaction('rw', db.pruebas, async function () {
        await db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), _nombre_etapa]).modify({
            nombre_poi: valor_nombre_poi,
            distancia: distancia,
            notas: notas,
            atributos: atributos
        });
    }).then(function () {
        db_backup().then(function () {
            db_get_all_pois(_nombre_etapa).then(function (pois) {
            });
        });
    }).catch(Dexie.ModifyError, function (e) {
        console.error(e.failures.length + "failed to hire modify");
        throw e;
    });

    return false;
}

async function db_backup() {
    //console.log('por aqui si');
    reload_db().then(function () {

        db.pruebas.toArray().then(function (pois) {
            //console.log(pois);
            let texto = JSON.stringify(pois, null, 4);
            envia_datos(texto, get_nombre_tour() + '.json');
        });

    });
}

async function db_delete_stage(nombre_etapa) {
    db.pruebas.where('nombre_etapa').equals(nombre_etapa).delete().then(function () {
        db_backup();
    }).catch(function (err) {
        console.error(err.stack || err);
    });
}

async function db_restore(fichero) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", fichero, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var texto = rawFile.responseText;
                //console.log(texto);
                reload_db().then(function () {
                    let pois = JSON.parse(texto);
                    //console.log('pois', pois);
                    db.pruebas.bulkAdd(pois);
                    db_get_all_pois(_nombre_etapa).then(function (pois) {
                        //console.log(pois);
                    }
                    );
                }
                );
            }
        }
    }
    rawFile.send(null);

}

async function db_guarda_lista_tours(lista_tours) {
    console.log('lista', lista_tours);

    let texto = JSON.stringify(lista_tours, null, 4);

    console.log('antes de ajax');

    $.ajax({
        type: 'POST',
        url: '/api/tours',
        data: {
            texto: texto
        },
        error: function (data) {
            console.error(data);
        },
        success: function (data) {
            console.log('success de ajax: ', data);
            window.parent.termino_guardar_lista_tours();
        }
    });

    console.log('despues de ajax');
}

function envia_datos(texto, nombre_tour) {
    console.log('nombre_tour', nombre_tour);
    $.ajax({
        type: 'POST',
        url: '/api/endpoint',
        data: {
            texto: texto,
            nombre_tour: nombre_tour
        },
        error: function (data) {
            console.error(data);
        },
        success: function (data) {
            console.log(data);
        }
    });
}

