var db;
var _nombre_etapa;
var _nombre_tour;

reload_db();

/** funciones de consulta  */ /** funciones de consulta  */ /** funciones de consulta  */

async function reload_db() {
    if (!db) {
        _nombre_tour = get_nombre_tour();
        if (_nombre_tour == '') {
            console.log('reload_db : No hay ningun nombre de tour');
        }
        else {
            db = new Dexie(_nombre_tour);
            console.log('reload_db : db no definida', db, _nombre_tour);
            db.version(1).stores({
                pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,tipo_poi,[id+nombre_etapa],[id_punto+nombre_etapa]'
            });

            console.log('reload_db : db load', db);
            db.open().then(function () {
                console.log('reload_db : db definida', db);
            }).catch(function (err) {
                console.log('reload_db : error al abrir la base de datos', err);
                console.error(err.stack || err);
            });
        }
    }
    else {
        console.log('reload_db : db SI definida', 'nombre tour', _nombre_tour, 'nombre etapa', _nombre_etapa);
        console.log('reload_db : db es ', db);
    }
}

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

/** Crea un nuevo tour */
async function db_crea_tour(nombre_tour) {
    _nombre_tour = nombre_tour;
    db = new Dexie(_nombre_tour);
    console.log(db);
    db.version(1).stores({
        pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,tipo_poi,[id+nombre_etapa],[id_punto+nombre_etapa]'
    });
    db.open().catch(function (err) {
        console.error(err.stack || err);
    });
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

    });
}

/** borra un punto de una stage */
async function db_delete(nombre_etapa, id_punto) {
    _nombre_etapa = nombre_etapa;
    return await db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), nombre_etapa]).delete();
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
        db_get_all_pois(_nombre_etapa).then(function (pois) {
            console.log(pois);
        });
    }).catch(Dexie.ModifyError, function (e) {
        console.error(e.failures.length + "failed to hire modify");
        throw e;
    });

    return false;
}

async function db_backup() {
    console.log('por aqui si');
    reload_db().then(function () {

        db.pruebas.toArray().then(function (pois) {
            console.log(pois);
            let texto = JSON.stringify(pois, null, 4);
            download(texto, "VELETA 2022.json", "application/json");
        });

    });
}

async function db_restore(fichero) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", fichero, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var texto = rawFile.responseText;
                console.log(texto);
                reload_db().then(function () {
                    let pois = JSON.parse(texto);
                    console.log('pois', pois);
                    db.pruebas.bulkAdd(pois);
                    db_get_all_pois(_nombre_etapa).then(function (pois) {
                        console.log(pois);
                    }
                    );
                }
                );
            }
        }
    }
    rawFile.send(null);

}