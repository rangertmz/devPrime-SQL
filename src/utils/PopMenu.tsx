import React, { useState } from "react";
import { deleteDatabase } from "../request/database";
import UpdateDatabase from "../components/Modals/UpdateDatabase";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";
import Swal from "sweetalert2"

const PopMenu = ({
  ClosePop,
  selectedDatabase,
  onUpdateDatabases,
  Conected,
}: any) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const Navigator = useNavigate();


  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };
  const SweetAlertError = (data:any) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteDatabase = async () => {
    try {
      const response = await deleteDatabase(selectedDatabase.name);

      onUpdateDatabases();
      ClosePop();
      console.log("Base de datos eliminada:", response);
    } catch (error: any) {
      SweetAlertError(error.message);
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
        handleDeleteDatabase()
        Swal.fire({
          title: "Eliminado!",
          text:  `Base de datos "${selectedDatabase.name}" eliminada Correctamente`,
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
            Navigator(`/${selectedDatabase.name}/createTable`, {
              state: {
                selectedDatabase: selectedDatabase.name,
                Conected: Conected,
              },
            })
          }
        >
          Crear tabla
        </li>
        <li onClick={handleUpdateClick}>Modificar</li>
        <li onClick={SweetAlertDelete}>Eliminar</li>
      </ul>
      {showUpdateModal && (
        <UpdateDatabase
          DatabaseName={selectedDatabase}
          onUpdateDatabases={onUpdateDatabases}
          CloseModal={ClosePop}
        />
      )}
    </div>
  );
};

export default PopMenu;
