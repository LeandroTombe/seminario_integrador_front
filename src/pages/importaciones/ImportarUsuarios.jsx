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
      <div className="content">
          <h1>Importar Usuarios</h1>
          <Card className="container-import" style={{ marginTop: '40px' }}>
            <CardContent>
            <h4>Seleccione un archivo .csv para importar</h4>
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
        </div>
    </>
  );
};

export default ImportarUsuarios;