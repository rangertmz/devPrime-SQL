import React, { useState } from "react";
import { deleteDatabase } from "../request/database";
import DeleteValidation from "../components/Modals/DeleteValidation";
import UpdateDatabase from "../components/Modals/UpdateDatabase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";

const PopMenu = ({
  ClosePop,
  selectedDatabase,
  onUpdateDatabases,
  Conected,
}: any) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const Navigator = useNavigate();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  const handleDeleteDatabase = async () => {
    try {
      const response = await deleteDatabase(selectedDatabase.name);

      onUpdateDatabases();
      ClosePop();
      toast.success(
        `Base de datos "${selectedDatabase.name}" eliminada Correctamente`
      );
      console.log("Base de datos eliminada:", response);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
        <li onClick={handleDeleteClick}>Eliminar</li>
      </ul>
      {showDeleteModal && (
        <DeleteValidation
          classname='delete-modal'
          onDeleteConfirm={handleDeleteDatabase}
          DatabaseName={selectedDatabase}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
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
