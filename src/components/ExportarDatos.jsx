import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ExportarDatos = ({ titulo, encabezados, datos, totales }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const obtenerFechaEmision = () => {
        const fecha = new Date();
        return fecha.toLocaleDateString();
    };

    const exportarCSV = () => {
        const csvData = datos.map(item => encabezados.map(header => item[header.key]));

        const csv = Papa.unparse({
            fields: encabezados.map(header => header.label),
            data: csvData,
        });

        const blob = new Blob(
            [`${titulo}\nFecha de emisión: ${obtenerFechaEmision()}\n\n${csv}\n\n${totales}`],
            { type: 'text/csv;charset=utf-8;' }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${titulo}.csv`);
        link.click();
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        const margenIzquierdo = 10;
        const margenSuperior = 10;
        const anchoPagina = doc.internal.pageSize.width - margenIzquierdo * 2;
    
        // Fecha de emisión
        doc.setFontSize(10);
        doc.text(`Fecha de emisión: ${obtenerFechaEmision()}`, margenIzquierdo, margenSuperior);
    
        // Ajustar el título al ancho de la página
        doc.setFontSize(14);
        const tituloAjustado = doc.splitTextToSize(titulo, anchoPagina); // Divide el título
        const alturaTitulo = tituloAjustado.length * doc.getTextDimensions('Text').h; // Calcula la altura
        const posicionTitulo = margenSuperior + 10;
    
        // Renderiza el título ajustado
        doc.text(tituloAjustado, margenIzquierdo, posicionTitulo);
    
        // Posiciona la tabla después del título
        const posicionTabla = posicionTitulo + alturaTitulo + 5;
    
        // Renderiza la tabla
        doc.autoTable({
            head: [encabezados.map(header => header.label)],
            body: datos.map(item => encabezados.map(header => item[header.key])),
            startY: posicionTabla, // Coloca la tabla debajo del título
            margin: { left: margenIzquierdo, right: margenIzquierdo },
            styles: { fontSize: 8 },
        });
    
        // Total (si existe)
        if (totales) {
            const finalY = doc.lastAutoTable.finalY || posicionTabla + 10;
            doc.text(totales, margenIzquierdo, finalY + 10);
        }
    
        // Guarda el PDF
        doc.save(`${titulo}.pdf`);
    };
    
    const exportarXLSX = () => {
        const hoja = [
            [`Fecha de emisión: ${obtenerFechaEmision()}`], // Segunda fila: Fecha de emisión
            [`${titulo}`], // Primera fila: Título del informe
            [], // Fila vacía para separar encabezados de los datos
            encabezados.map(header => header.label), // Encabezados
            ...datos.map(item => encabezados.map(header => item[header.key])), // Datos
        ];

        if (totales) {
            hoja.push([]); // Fila vacía
            hoja.push([totales]); // Total como texto
        }

        const libro = XLSX.utils.book_new();
        const hojaDeTrabajo = XLSX.utils.aoa_to_sheet(hoja);
        XLSX.utils.book_append_sheet(libro, hojaDeTrabajo, 'Datos');
        XLSX.writeFile(libro, `${titulo}.xlsx`);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Exportar Datos
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Exportar Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Seleccione el formato de exportación:</p>
                    <div className="d-flex justify-content-around">
                        <Button variant="outline-primary" onClick={exportarCSV}>
                            Exportar .csv
                        </Button>
                        <Button variant="outline-danger" onClick={exportarPDF}>
                            Exportar PDF
                        </Button>
                        <Button variant="outline-success" onClick={exportarXLSX}>
                            Exportar .xlsx
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ExportarDatos;