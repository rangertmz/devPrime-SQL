import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { deleteTable } from "../request/table";
import "../styles/modalTable.css";
import Swal from "sweetalert2"
const PopMenuTable = ({
  onClose,
  selectedDatabase,
  onUpdateDatabases,
  selectedTable,
}: any) => {

  const Navigator = useNavigate();

  const SweetAlertError = (data:any) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteTable = async () => {
    try {
      const response = await deleteTable(selectedDatabase.name, selectedTable);
      onUpdateDatabases();
      onClose();
      console.log(response);
    } catch (e: any) {
     SweetAlertError(e.message);
    }
  };
  const SweetAlertDelete = () =>{
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No podras revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText:"Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteTable()
        Swal.fire({
          title: "Eliminado!",
          text:  `Tabla "${selectedTable}" eliminada Correctamente`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  return (
    <div className='popup-menu'>
      <ul>
        <li
          onClick={() =>
            Navigator(
              `/${selectedDatabase.name}/updateTable/${selectedTable}`,
              {
                state: {
                  selectedDatabase: selectedDatabase.name,
                  update: true,
                  selectedTable: selectedTable,
                },
              }
            )
          }
        >
          Modificar
        </li>
        <li onClick={SweetAlertDelete}>Eliminar</li>
      </ul>
      
    </div>
  );
};

export default PopMenuTable;
