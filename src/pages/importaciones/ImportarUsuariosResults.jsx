import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const ImportarUsuariosResults = ({ validRows, errors, successfulImports, totalRows }) => {
  const [mostrarValidos, setMostrarValidos] = useState(true);
  const [mostrarInvalidos, setMostrarInvalidos] = useState(false);
  const [mostrarImportados, setMostrarImportados] = useState(false);

  const handleMostrarValidos = () => {
    setMostrarValidos(true);
    setMostrarInvalidos(false);
    setMostrarImportados(false);
  };

  const handleMostrarInvalidos = () => {
    setMostrarValidos(false);
    setMostrarInvalidos(true);
    setMostrarImportados(false);
  };

  const handleMostrarImportados = () => {
    setMostrarValidos(false);
    setMostrarInvalidos(false);
    setMostrarImportados(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="success" onClick={handleMostrarValidos} style={{ marginRight: '10px' }}>
          Ver Válidos ({validRows.length})
        </Button>
        <Button variant="contained" color="error" onClick={handleMostrarInvalidos} style={{ marginRight: '10px' }}>
          Ver Inválidos ({errors.length})
        </Button>
        <Button variant="contained" color="primary" onClick={handleMostrarImportados}>
          Ver Importados ({successfulImports})
        </Button>
      </div>
      
      {mostrarValidos && (
        <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Legajo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validRows.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: '#d4edda' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.legajo}</TableCell>
                  <TableCell>{row.nombre} {row.apellido}</TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {mostrarInvalidos && (
        <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errors.map((error, index) => (
                <TableRow key={index} style={{ backgroundColor: '#f8d7da' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{error.error}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {mostrarImportados && (
        <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Legajo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validRows.map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: '#d4edda' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.legajo}</TableCell>
                  <TableCell>{row.nombre} {row.apellido}</TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mostrar total de importaciones */}
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h6">Total de importaciones: {totalRows}</Typography>
      </div>
    </div>
  );
};

export default ImportarUsuariosResults;