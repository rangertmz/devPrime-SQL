import React, { useState } from "react";
import "../../styles/modal.css";
import { updateDatabase } from "../../request/database";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";

function UpdateDatabase({ DatabaseName, CloseModal, onUpdateDatabases }: any) {
  const [collation, setCollation] = useState("");
  const [name, setName] = useState(DatabaseName.name);
  const [errorName, setErrorName] = useState(false);
  const [errorCollation, setErrorCollation] = useState(false);

  const collations = [
    { value: "Latin1_General_CI_AS", label: "Latin1_General_CI_AS" },
    {
      value: "SQL_Latin1_General_CP1_CI_AS",
      label: "SQL_Latin1_General_CP1_CI_AS",
    },
  ];
  const SweetAlert = (data: any) => {
    Swal.fire({
      title: "Base de Datos Actualizada",
      text: data,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const SweetAlertError = (data: any) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data,
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const handleUpdateDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name) {
        setErrorName(true);
      } else {
        setErrorName(false);
      }

      if (name) {
        const result = await updateDatabase(DatabaseName.name, name, collation);
        if (result) {
          CloseModal();
          onUpdateDatabases();
          SweetAlert("La base de datos ha sido actualizada exitosamente");
        }
      }
    } catch (error: any) {
      SweetAlertError(error.message);
    }
  };

  return (
    <div className='updateBackground'>
      <div className='modalUpdateDb'>
        <div className='modal-content-up'>
          <h1>Editar Propiedades de {DatabaseName.name}</h1>
          <form onSubmit={handleUpdateDatabase}>
            <div className='form-group'>
              <FormControl sx={{ marginTop: 2, width: 270 }}>
                <InputLabel>Nombre</InputLabel>
                <Input
                  error={errorName}
                  size='small'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errorName && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "11px",
                      fontWeight: "lighter",
                    }}
                  >
                    Por favor coloque el nombre de la base de datos
                  </div>
                )}
              </FormControl>
            </div>
            <div className='form-group'>
              <select
                style={{
                  width: 280,
                  marginTop: 10,
                }}
                className='dbCollation'
                value={collation}
                onChange={(e) => setCollation(e.target.value)}
                required
              >
                <option value={DatabaseName.collation}>
                  {DatabaseName.collation}
                </option>
                {collations.map((coll) => {
                  if (DatabaseName.collation === coll.value) {
                    return null;
                  }
                  return (
                    <option key={coll.value} value={coll.value}>
                      {coll.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='modal-actions-up'>
              <Button
                type='submit'
                variant='contained'
                size='small'
                sx={{
                  backgroundColor: "#2e3f63",
                  marginRight: 2,
                }}
              >
                Confirmar
              </Button>
              <Button onClick={CloseModal} variant='contained' color='error'>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateDatabase;
