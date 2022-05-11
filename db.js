var db;
var _nombre_etapa;
var _nombre_tour;

if (!db) {
    _nombre_tour = get_nombre_tour();
    var db = new Dexie(_nombre_tour);
    console.log('db no definida', db, _nombre_tour);
    db.version(1).stores({
        pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,tipo_poi,[id+nombre_etapa],[id_punto+nombre_etapa]'
    });

    console.log('db load', db);
}
else {
    console.log('db definida');
}


/** funciones de consulta  */ /** funciones de consulta  */ /** funciones de consulta  */

async function db_get_all_pois(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    return await db.pruebas.where('nombre_etapa').equals(nombre_etapa).toArray();
}

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
async function db_crea_tour(nombre_tour) {
    _nombre_tour = nombre_tour;
    db = new Dexie(_nombre_tour);
    db.version(1).stores({
        pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,tipo_poi,[id+nombre_etapa],[id_punto+nombre_etapa]'
    });
    db.open().catch(function (err) {
        console.error(err.stack || err);
    });

    console.log('db creada', db);
    console.log('nombre_tour', _nombre_tour);
}

async function db_crea_prueba(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    console.log(db);
}

async function db_add(id_punto, nombre, distancia, notas, atributos, punto_referencia, tipo_poi) {

    console.log('db_add(id,', id_punto, ' nombre,', nombre, ' distancia, ', distancia, ' notas, ', notas, ' atributos, ', atributos,
        ' punto_referencia ', punto_referencia, ' tipo poi', tipo_poi, ')');

    // Interact With Database

    console.log('db_add', db);

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
        console.log('add ok');
    });
}

async function db_delete(nombre_etapa, id_punto) {
    _nombre_etapa = nombre_etapa;
    console.log('db_delete(id)', id_punto, 'nombre_etapa', nombre_etapa);
    //return await db.pruebas.delete(id);
    return await db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), nombre_etapa]).delete();
}

async function db_modifica_campo(id, campo, valor) {
    console.log('db_modifica_campo(id, campo, valor)', 'id', id, 'campo', campo, 'valor', valor);

    switch (campo) {
        case 'nombre_poi':
            await db.pruebas.update(id, { nombre_poi: valor });
            break;
        case 'distancia':
            await db.pruebas.update(id, { distancia: valor });
            break;
        case 'notas':
            await db.pruebas.update(id, { notas: valor });
            break;
        case 'atributos':
            await db.pruebas.update(id, { atributos: valor });
            break;
        case 'punto_referencia':
            await db.pruebas.update(id, { punto_referencia: valor });
            break;
        default:
            console.log('campo no reconocido');
            break;
    }
}

//Pasar a interfaces
async function db_modifica_registro(id_punto, valor_nombre_poi, distancia, notas, atributos) {
    console.log('db_modifica_registro', 'id', id_punto, 'nombre_poi', valor_nombre_poi, 'dist', distancia, 'notas', notas, 'atr', atributos);
    console.log('nombre_etapa', _nombre_etapa);

    db.transaction('rw', db.pruebas, async function () {
        await db.pruebas.where('[id_punto+nombre_etapa]').equals([parseInt(id_punto), _nombre_etapa]).modify({
            nombre_poi: valor_nombre_poi,
            distancia: distancia,
            notas: notas,
            atributos: atributos
        });
    }).then(function () {
        console.log('update ok -> nombre: ', valor_nombre_poi);
        db_get_all_pois(_nombre_etapa).then(function (pois) {
            console.log(pois);
        });
    }).catch(Dexie.ModifyError, function (e) {
        console.error(e.failures.length + "failed to hire modify");
        throw e;
    });

    return false;
}