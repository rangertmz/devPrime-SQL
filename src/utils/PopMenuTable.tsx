import React, { useState } from "react";
import DeleteValidation from "../components/Modals/DeleteValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { deleteTable } from "../request/table";
import "../styles/modalTable.css";

const PopMenuTable = ({
  onClose,
  selectedDatabase,
  onUpdateDatabases,
  selectedTable,
}: any) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const Navigator = useNavigate();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteTable = async () => {
    try {
      const response = await deleteTable(selectedDatabase.name, selectedTable);
      onUpdateDatabases();
      onClose();
      toast.success("Tabla eliminada correctamente");
      console.log(response);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className='popup-menu'>
      <ul>
        <li>Añadir Registro </li>
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
        <li onClick={handleDeleteClick}>Eliminar</li>
      </ul>
      {showDeleteModal && (
        <DeleteValidation
          classname='delete-modal'
          onDeleteConfirm={handleDeleteTable}
          DatabaseName={selectedDatabase}
          tableName={selectedTable}
          isDeleteTable={true}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PopMenuTable;
