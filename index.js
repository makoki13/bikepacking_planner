/** Tours */ /** Tours */ /** Tours */ /** Tours */ /** Tours */
var lista_tours = [];
var refreshIntervalId;

function existe_lista_tours() {
    var directory = 'tours/tours.json';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", directory, false);
    xmlHttp.send(null);
    var estado = xmlHttp.status;
    var files = xmlHttp.responseText;


    if (xmlHttp.readyState === 4) {
        if (estado === 200 || estado == 0) {
            return true;
        }
    }

    return false;
}


function recarga_lista_tours() {
    if (existe_lista_tours()) {
        console.log('ya está');
        cargar_tour_previo();
        clearInterval(refreshIntervalId);
    }
    else {
        console.log('todavia no');
    }
}

function crea_tour() {
    var resp = prompt("Tour name: ");
    if (!resp) return;

    console.log(lista_tours);

    db_crea_tour(resp).then(function () {
        document.getElementById("nombre_tour").innerHTML = resp;
        muestra_botones_stage();

        lista_tours.push(resp);

        if (existe_lista_tours()) {
            cargar_tour_previo();
            regenera_fichero_json();
        }
        else {
            console.log('paso1', document.getElementById('frm_tabla').src);
            document.getElementById('frm_tabla').contentWindow.set_mensaje_espera();
            regenera_fichero_json().then(function () {
                refreshIntervalId = setInterval(recarga_lista_tours, 2000);
            });
        }

    });
}

async function regenera_fichero_json() {
    var data = JSON.stringify(lista_tours);
    download(data, "tours.json", "application/json");
}

function cargar_tour_previo() {
    console.log('cargando tour previo', lista_tours);
    document.getElementById('cabecera').style.display = 'none';
    document.getElementById('frm_tabla').src = "lista_tours.html";
}

function set_lista_tours(lista) {
    lista_tours = lista;
    console.log('set_lista_tours', lista_tours);
}

async function cargar_tour(nombre_tour) {
    document.getElementById('btn_load_tour').style.display = '';
    set_nombre_tour(nombre_tour);
    document.getElementById('frm_tabla').src = "";
    muestra_botones_stage();

    console.log(nombre_tour);

    db_restore("tours/" + nombre_tour + ".json").then(function () {
        cargar_etapa_previo();
    });
}

function get_nombre_tour() {
    return document.getElementById("nombre_tour").innerHTML;
}

function set_nombre_tour(nombre_tour) {
    document.getElementById("nombre_tour").innerHTML = nombre_tour;
}

/** Stages */ /** Stages */ /** Stages */ /** Stages */ /** Stages */

var nombre_etapa = '';

function muestra_botones_stage() {
    botones = document.getElementsByClassName('btn_prj');
    for (key in botones) {
        if (botones[key].id === undefined) continue;
        console.log(botones[key].id);
        botones[key].style.visibility = 'visible';
    }
    //botones.style.display = 'block';
}

function get_nombre_etapa() {
    return nombre_etapa;
}

async function crea_etapa() {
    var resp = prompt("Stage name: ");
    if (!resp) return;

    nombre_etapa = resp;
    document.getElementById("nombre_stage").innerHTML = nombre_etapa;

    document.getElementById('frm_tabla').src = "tabla.html";
    estado_botones_etapa('visible');

    document.getElementById('cabecera').style.display = '';

    db_crea_prueba(nombre_etapa);
}

function cargar_etapa_new(nombre_nueva_etapa) {
    document.getElementById('cabecera').style.display = '';
    nombre_etapa = nombre_nueva_etapa;
    document.getElementById("nombre_stage").innerHTML = nombre_etapa;
    document.getElementById('frm_tabla').src = "tabla.html";

    document.getElementById('btn_course_climb').style.visibility = 'visible';
    document.getElementById('btn_course_desc').style.visibility = 'visible';
    document.getElementById('btn_course_cp').style.visibility = 'visible';
    document.getElementById('btn_course_add').style.visibility = 'visible';
    document.getElementById('btn_course_imprime').style.visibility = 'visible';
}

function cargar_etapa_previo() {
    document.getElementById('cabecera').style.display = 'none';
    document.getElementById('frm_tabla').src = "lista_stages.html";
}

// desde nuevo_poi.js
function refresca_etapa(pois) {
    db_get_all_pois(nombre_etapa).then(function (pois) { document.getElementById('frm_tabla').contentWindow.cargar_etapa(pois); });
}


function estado_botones_etapa(visible) {
    document.getElementById('btn_course_climb').style.visibility = visible;
    document.getElementById('btn_course_desc').style.visibility = visible;
    document.getElementById('btn_course_cp').style.visibility = visible;
    document.getElementById('btn_course_add').style.visibility = visible;
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

function insertar_cp() {
    document.getElementById('frmNuevaVersion').src = 'nuevo_cp.html';
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function edita_cp(indice) {
    console.log('edita_cp', indice);
    document.getElementById('frmNuevaVersion').src = 'nuevo_cp.html?edicion=S&indice=' + indice;
    document.getElementById('bloqueo').style.visibility = 'visible';
    document.getElementById('nuevo_poi').style.visibility = 'visible';
    document.getElementById('nuevo_poi_sombra').style.visibility = 'visible';
}

function get_new_indice(incremento = 0) {
    return document.getElementById('frm_tabla').contentWindow.get_new_indice(incremento);
}

function backup() {
    db_backup().then(function () {
        console.log('Backup realizado');
    });
}

function restore(prueba) {
    db_restore(prueba).then(function () {
        console.log('Restore realizado');
    });
}
