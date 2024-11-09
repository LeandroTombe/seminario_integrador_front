// ExportarDatos.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ExportarDatos = ({ titulo, encabezados, datos, totales }) => {
    const [showModal, setShowModal] = useState(false);

    // Funciones para abrir y cerrar el modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const exportarCSV = () => {
        const csvData = datos.map(item => encabezados.map(header => item[header.key]));
        
        // Agregar los totales al final del CSV si se proporcionan
        if (totales) {
            const totalRow = encabezados.map(header => totales[header.key] || '');
            csvData.push(totalRow);
        }

        const csv = Papa.unparse({
            fields: encabezados.map(header => header.label),
            data: csvData,
        });

        const blob = new Blob([`${titulo}\n${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${titulo}.csv`);
        link.click();
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text(titulo, 10, 10);
        doc.autoTable({
            head: [encabezados.map(header => header.label)],
            body: [
                ...datos.map(item => encabezados.map(header => item[header.key])),
                // Agregar los totales al final del PDF si se proporcionan
                totales ? encabezados.map(header => totales[header.key] || '') : []
            ],
            startY: 20,
        });
        doc.save(`${titulo}.pdf`);
    };

    return (
        <>
            {/* Botón para abrir el modal */}
            <Button variant="primary" onClick={handleShowModal}>
                Exportar Datos
            </Button>

            {/* Modal de exportación */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Exportar Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Seleccione el formato de exportación:</p>
                    <div className="d-flex justify-content-around">
                        <Button variant="outline-primary" onClick={exportarCSV}>
                            Exportar CSV
                        </Button>
                        <Button variant="outline-secondary" onClick={exportarPDF}>
                            Exportar PDF
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