// ImportarUsuarios.jsx
import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ImportarUsuariosForm from './ImportarUsuariosForm.jsx';
import ImportarUsuariosResults from './ImportarUsuariosResults.jsx';
import Sidebar from '../../components/Sidebar.jsx';

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
              successfulImports={importData.successful_imports}
              failedImports={importData.failed_imports}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ImportarUsuarios;