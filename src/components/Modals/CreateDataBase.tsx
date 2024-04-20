import React, { useState } from "react";
import "../../styles/modal.css";
import { createDatabase } from "../../request/database";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

function CreateDataBase({ closeModal }: any) {
  const [name, setname] = useState("");
  const [collation, setCollation] = useState("");
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
      title: "Base de Datos Creada",
      text: `La base de datos ${data} ha sido creada exitosamente`,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const SweetAlertError = (data: any) => {
    Swal.fire({
      icon: "error",
      title: "Base de datos no Creada",
      text: data,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name) {
        setErrorName(true);
      } else {
        setErrorName(false);
      }
      if (!collation) {
        setErrorCollation(true);
      } else {
        setErrorCollation(false);
      }
      if (name && collation) {
        const result = await createDatabase(name, collation);
        if (result) {
          SweetAlert(name);
          closeModal(false);
        } else {
          SweetAlertError(result.message);
        }
      }
    } catch (error: any) {
      SweetAlertError(error.message);
      console.log(error);
    }
  };

  return (
    <div className='modalBackground'>
      <div className='modalContainer'>
        <div className='modalTittle'>
          <div>Crear Base de Datos</div>
          <IconButton
            onClick={() => closeModal(false)}
            sx={{
              marginLeft: "auto",
              marginTop: -1,
            }}
          >
            <IoCloseCircleOutline
              style={{
                color: "red",
                fontSize: "36px",
              }}
            />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit} className='form-CD'>
          <div>
            <FormControl sx={{ marginTop: 2, width: 270 }}>
              <TextField
                error={errorName}
                size='small'
                label='Nombre'
                value={name}
                onChange={(e) => setname(e.target.value)}
              ></TextField>
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
          <div className='form-charset'>
            <FormControl
              size='medium'
              variant='outlined'
              sx={{ marginTop: 2, width: 270 }}
            >
              <InputLabel>Collation</InputLabel>
              <Select
                error={errorCollation}
                value={collation}
                onChange={(e) => setCollation(e.target.value)}
              >
                {collations.map((coll) => (
                  <MenuItem key={coll.value} value={coll.value}>
                    {coll.label}
                  </MenuItem>
                ))}
              </Select>
              {errorCollation && (
                <div
                  style={{
                    color: "red",
                    fontSize: "11px",
                    fontWeight: "lighter",
                  }}
                >
                  Por favor seleccione la collation de la base de datos
                </div>
              )}
            </FormControl>
          </div>
          <Button
            type='submit'
            variant='contained'
            sx={{ marginTop: 3, backgroundColor: "#2e3f63", color: "white" }}
          >
            Crear Base de Datos
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateDataBase;
