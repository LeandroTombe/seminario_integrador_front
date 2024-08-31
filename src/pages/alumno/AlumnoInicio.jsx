import Layout from '../../LayoutAlumno'
import EstadoDecuenta from "./EstadoDeCuenta"
import ResumenAlumno from "./ResumenAlumno"

function AlumnoInicio() {

    return (
      <Layout>
        <div className="contenedor-principal">
          <h1>Inicio</h1>
          <ResumenAlumno/>
          <EstadoDecuenta/>
        </div>
      </Layout>
      
    )
  }
  


  export default AlumnoInicio;
  