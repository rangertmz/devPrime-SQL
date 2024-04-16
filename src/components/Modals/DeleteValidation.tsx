import React from 'react';
import '../../styles/modal.css'
import { Button } from '@mui/material';


const DeleteValidation = ({ onDeleteConfirm, onClose, DatabaseName,isDeleteTable, tableName }: any) => {
  
  const handleDeleteConfirm = () => {
    onDeleteConfirm();
    onClose();
  };

  const tittle =  isDeleteTable ? `¿Estás seguro de que quieres eliminar la tabla "${tableName}" de ${DatabaseName.name}?` : `¿Estás seguro de que quieres eliminar la base de datos " ${DatabaseName.name} "?`

  return (
    <div className="devBackground">
      <div className="modal-Dev">
      <div className="modal-content-dev">
        <h2>{tittle}</h2>
        <div className="modal-actions">
          <Button variant="contained" sx={{marginRight:2, backgroundColor:'#2e4f63'}} onClick={handleDeleteConfirm}>Confirmar</Button>
          <Button variant="contained"color="error" onClick={onClose}>Cancelar</Button>
          
        </div>
      </div>
    </div>
    </div>
  );
};

export default DeleteValidation;
