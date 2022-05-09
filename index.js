var nombre_etapa = '';

function get_nombre_etapa() {
    return nombre_etapa;
}

async function crea_etapa() {
    var resp = prompt("Stage name: ");
    if (!resp) return;

    nombre_etapa = resp;

    estado_botones_etapa('visible')

    document.getElementById("nombre_stage").innerHTML = nombre_etapa;

    db_crea_prueba(nombre_etapa);
}

function cargar_etapa() {
    var resp = prompt("Stage name: ");
    if (!resp) return;

    nombre_etapa = resp;
    document.getElementById("nombre_stage").innerHTML = nombre_etapa;

    db_get_all_pois(nombre_etapa).then(function (pois) { document.getElementById('frm_tabla').contentWindow.cargar_etapa(pois); });

    document.getElementById('btn_course_climb').style.visibility = 'visible';
    document.getElementById('btn_course_desc').style.visibility = 'visible';
    document.getElementById('btn_course_cp').style.visibility = 'visible';
    document.getElementById('btn_course_add').style.visibility = 'visible';
    document.getElementById('btn_course_save').style.visibility = 'visible';
    document.getElementById('btn_course_imprime').style.visibility = 'visible';
}

// desde nuevo_poi.js
function refresca_etapa(pois) {
    db_get_all_pois(nombre_etapa).then(function (pois) { document.getElementById('frm_tabla').contentWindow.cargar_etapa(pois); });
    //document.getElementById('frm_tabla').contentWindow.cargar_etapa(pois);
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

function edita_registro(indice) {
    console.log('edita_registro', indice);
    document.getElementById('frmNuevaVersion').src = 'nuevo_poi.html?edicion=S&indice=' + indice;
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function desbloquea_insertar_registro() {
    document.getElementById('bloqueo').style.visibility = 'hidden';
    document.getElementById('nuevo_poi').style.visibility = 'hidden';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'hidden';
}

function insertar_ascenso() {
    document.getElementById('frmNuevaVersion').src = 'nuevo_climb.html';
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function edita_ascenso(indice) {
    console.log('edita_ascenso', indice);
    document.getElementById('frmNuevaVersion').src = 'nuevo_climb.html?edicion=S&indice=' + indice;
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function insertar_descenso() {
    document.getElementById('frmNuevaVersion').src = 'nueva_bajada.html';
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function edita_descenso(indice) {
    console.log('edita_descenso', indice);
    document.getElementById('frmNuevaVersion').src = 'nueva_bajada.html?edicion=S&indice=' + indice;
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}


function get_new_indice(incremento = 0) {
    return document.getElementById('frm_tabla').contentWindow.get_new_indice(incremento);
}

