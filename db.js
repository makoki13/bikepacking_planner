
if (!db) {
    var db = new Dexie('bikepacking');
    db.version(9).stores({
        pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia,[id+nombre_etapa]'
    });

    var _nombre_etapa;

    //console.log('db load', db);
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
        if (element.id == indice) {
            valor = element;
        }
    });

    return valor;
}


/** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */ /** funciones de insercion , modificacion y borrado  */

async function db_crea_prueba(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    console.log(db);
}

async function db_add(id, nombre, distancia, notas, atributos, punto_referencia) {

    console.log('db_add(id,', id, ' nombre,', nombre, ' distancia, ', distancia, ' notas, ', notas, ' atributos, ', atributos, ' punto_referencia ', punto_referencia, ')',);

    // Interact With Database
    db.transaction('rw', db.pruebas, function () {
        // Let's add some data to db:
        insert_object = {
            nombre_etapa: _nombre_etapa,
            id_punto: id,
            nombre_poi: nombre,
            distancia: distancia,
            notas: notas,
            atributos: atributos,
            punto_referencia: punto_referencia
        };
        db.pruebas.add(insert_object);
    }).catch(function (err) {
        console.error(err.stack || err);
    }).then(() => {
        console.log('add ok');
    });
}

async function db_delete(id) {
    console.log('db_delete(id)');
    return await db.pruebas.delete(id);
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
async function db_modifica_registro(id, valor_nombre_poi, distancia, notas, atributos) {
    console.log('db_modifica_registro', 'id', id, 'nombre_poi', valor_nombre_poi, 'dist', distancia, 'notas', notas, 'atr', atributos);

    db.transaction('rw', db.pruebas, async function () {
        await db.pruebas.where('[id+nombre_etapa]').equals([parseInt(id), _nombre_etapa]).modify({
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