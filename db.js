var db = new Dexie('bikepacking');
db.version(5).stores({
    pruebas: '++id, nombre_etapa, id_punto,nombre_poi, distancia, notas, atributos, punto_referencia'
});

var _nombre_etapa;

console.log(db);

async function db_crea_prueba(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    console.log(db);
}

function db_add(id, nombre, distancia, notas, atributos, punto_referencia) {

    console.log('db_add(id, nombre, distancia, notas, atributos, punto_referencia)');

    // Interact With Database
    db.transaction('rw', db.pruebas, function () {
        // Let's add some data to db:
        insert_object = { nombre_etapa: _nombre_etapa, id_punto: id, nombre_poi: nombre, distancia: distancia, notas: notas, atributos: atributos, punto_referencia: punto_referencia };
        db.pruebas.add(insert_object);
    }).catch(function (err) {
        console.error(err.stack || err);
    }).then(() => {
        console.log('add ok');
    });
}

async function db_get_pois(nombre_etapa) {
    _nombre_etapa = nombre_etapa;
    console.log(db.pruebas);
    return await db.pruebas.where('nombre_etapa').equals(nombre_etapa).toArray();
}