import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import './AdminInicio.css'

function AdminInicio() {

    const navigate = useNavigate();

    return (
        <div
            className="modal admin-bg"
            style={{ display: 'block' }}
        >
            <Modal.Dialog centered>
                <Modal.Header>
                    <Modal.Title>Proximamente!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Este contenido aun se encuentra disponible, pero podemos mostrarte las demas funciones ya implementadas.  </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => navigate("/coordinador/inicio")}>Ir a Coordinador</Button>
                </Modal.Footer>
            </Modal.Dialog>

        </div>
    )
}

export default AdminInicio;