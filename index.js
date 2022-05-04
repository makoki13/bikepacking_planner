var nombre_etapa = '';

async function crea_fichero() {
    var resp = prompt("Stage name: ");
    if (!resp) return;

    nombre_etapa = resp;

    estado_botones_etapa('visible')

    document.getElementById("nombre_stage").innerHTML = nombre_etapa;

    const db = new Dexie('pruebas');
    console.log(db);
    db.version(1).stores({
        pruebas: '++id, nombre'
    });

    db.pruebas.bulkPut([
        { id: 1, nombre: nombre_etapa }
    ]).then(() => {
        console.log('bulkPut ok');
    });

    const databases = Dexie.getDatabaseNames();
    console.log(databases);
}

function cargar_fichero(nombre_etapa) {
    console.log('cargar_fichero index', nombre_etapa);
    //document.getElementById('frm_tabla').contentWindow.cargar_fichero(nombre_fichero);
    document.getElementById('btn_course_climb').style.visibility = 'visible';
    document.getElementById('btn_course_desc').style.visibility = 'visible';
    document.getElementById('btn_course_cp').style.visibility = 'visible';
    document.getElementById('btn_course_add').style.visibility = 'visible';
    document.getElementById('btn_course_save').style.visibility = 'visible';
    document.getElementById('btn_course_imprime').style.visibility = 'visible';
}

function estado_botones_etapa(visible) {
    document.getElementById('btn_course_climb').style.visibility = visible;
    document.getElementById('btn_course_desc').style.visibility = visible;
    document.getElementById('btn_course_cp').style.visibility = visible;
    document.getElementById('btn_course_add').style.visibility = visible;
    document.getElementById('btn_course_save').style.visibility = visible;
    document.getElementById('btn_course_imprime').style.visibility = visible;
}

function insertar_registro() {
    document.getElementById('frmNuevaVersion').src = 'nuevo_poi.html';
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function desbloquea_insertar_registro() {
    document.getElementById('bloqueo').style.visibility = 'hidden';
    document.getElementById('nuevo_poi').style.visibility = 'hidden';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'hidden';
}

function get_new_indice(incremento = 0) {
    return document.getElementById('frm_tabla').contentWindow.get_new_indice(incremento);
}

