function imprime_pdf() {
    var alto_puntos = 4;
    var margen_izdo = 1;

    var ancho_columna1 = 50;
    var ancho_columna2 = 10;
    var ancho_columna3 = 10;

    var inicio_altura = 4;

    var margen_sup_rect = 3;
    var margen_inf_rect = 4;

    const doc = new jsPDF();

    doc.setFontSize(8);

    db_get_all_pois(nombre_etapa).then(function (pois) {
        var j = inicio_altura; var fila = 1;
        var estado = estado_actual = 0; //0: neutral, 1: subiendo, 2: bajando
        pois.sort(compara_distancia);
        pois.forEach((elemento, indice) => {
            var distancia = parseFloat(elemento.distancia).toFixed(1).toString();

            var intervalo = '';
            if (indice < pois.length - 1) {
                elemento_siguiente = pois[indice + 1];
                var intervalo = parseFloat(elemento_siguiente.distancia) - parseFloat(elemento.distancia);
                intervalo = intervalo.toFixed(1).toString();
            }

            doc.setFillColor(255, 255, 255);
            doc.setTextColor(0, 0, 0);

            if (elemento.atributos.includes('gasolinera')) {
                doc.setFillColor(175, 238, 238);
                doc.setTextColor(0, 0, 128);
                doc.setFont('helvetica', '');
            }
            if (elemento.atributos.includes('comida')) {
                doc.setFillColor(175, 238, 238);
                doc.setTextColor(0, 0, 128);
                doc.setFont('helvetica', '');
            }
            if (elemento.atributos.includes('alojamiento')) {
                doc.setFillColor(175, 238, 238);
                doc.setTextColor(0, 0, 128);
                doc.setFont('helvetica', '');
            }
            if (elemento.atributos.includes('taller')) {
                doc.setFillColor(175, 238, 238);
                doc.setTextColor(0, 0, 128);
                doc.setFont('helvetica', '');
            }

            if (elemento.atributos.includes('inicio_bajada')) {
                estado_actual = 2;
                doc.setFillColor(0, 128, 0);
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', '', 'normal');
            }
            if (elemento.atributos.includes('fin_bajada')) {
                estado_actual = 0;
                doc.setTextColor(0, 128, 0);
                doc.setFont('helvetica', '');
            }
            if (elemento.atributos.includes('inicio_subida')) {
                estado_actual = 1;
                doc.setFillColor(255, 100, 100);
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', '', 'normal');
            }
            if (elemento.atributos.includes('fin_subida')) {
                estado_actual = 0;
                doc.setTextColor(128, 0, 0);
                doc.setFont('helvetica', '');
            }

            if ((elemento.atributos.includes('inicio') || elemento.atributos.includes('poblacion'))) {
                doc.setFont('helvetica', '', 'bold');
                doc.setFontType('bold');
            }
            if (elemento.atributos.includes('incidencia')) {
                doc.setFont('helvetica', 'italic');
            }

            doc.rect(margen_izdo, j - margen_sup_rect, ancho_columna1, margen_inf_rect, 'FD');
            doc.text(elemento.nombre_poi, margen_izdo, j);

            doc.setFillColor(255, 255, 255);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', '', '');
            if (estado == 1) {
                doc.setFillColor(255, 128, 128);
            }
            if (estado == 2) {
                doc.setFillColor(128, 255, 128);
            }

            estado = estado_actual;

            doc.rect(margen_izdo + ancho_columna1, j - margen_sup_rect, ancho_columna2, margen_inf_rect, 'FD');
            doc.text(distancia, margen_izdo + ancho_columna1 + 1, j);

            doc.setFont('helvetica', '', '');
            doc.setFillColor(255, 255, 255);
            doc.setTextColor(0, 0, 0);
            if (intervalo >= 10) {
                doc.setFillColor(255, 128, 128);
                doc.setFont('helvetica', '', 'bold');
                doc.setFontType('bold');
            }
            else if (intervalo >= 5) {
                doc.setFillColor(255, 255, 128);
                doc.setFont('helvetica', '', 'bold');
                doc.setFontType('bold');
            }

            doc.rect(margen_izdo + ancho_columna1 + ancho_columna2, j - margen_sup_rect, ancho_columna3, margen_inf_rect, 'FD');
            doc.text(intervalo, margen_izdo + ancho_columna1 + ancho_columna2 + 1, j);

            j += alto_puntos;
            fila++;

            if (fila == 70) {
                doc.addPage();
                j = inicio_altura;
                fila = 1;
            }
        });

        var nombre_tour = get_nombre_tour();
        var nombre_fichero = get_nombre_etapa();
        doc.save(nombre_tour + "_" + nombre_fichero);
    });
}
