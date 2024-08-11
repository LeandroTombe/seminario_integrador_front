// ImportarUsuarios.jsx
import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ImportarUsuariosForm from './ImportarUsuariosForm.jsx';
import ImportarUsuariosResults from './ImportarUsuariosResults.jsx';
import Sidebar from '../coordinador/SidebarCoordinador.jsx';

const ImportarUsuarios = () => {
  const [importData, setImportData] = useState(null);

  const handleImport = (data) => {
    setImportData(data);
  };

  return (
    <>
      <Sidebar />
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Importar Usuarios
          </Typography>
          <ImportarUsuariosForm onImport={handleImport} />
          {importData && (
            <ImportarUsuariosResults
              validRows={importData.valid_rows || []}
              errors={importData.errors || []}
              successfulImports={importData.successful_imports || 0}
              totalRows={importData.total_rows || 0}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ImportarUsuarios;