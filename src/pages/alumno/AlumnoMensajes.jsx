import Sidebar from "./SidebarAlumno";
import Layout from "../../LayoutAlumno";
import BaseNotificacion from "../notificacion/BaseNotificacion"


function AlumnoMensajes() {

    return (
      <Layout>
       <h1>Notificaciones</h1>
       <BaseNotificacion/>
      </Layout>
    )
  }
  


  export default AlumnoMensajes;
  