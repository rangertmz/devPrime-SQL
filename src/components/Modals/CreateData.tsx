import React, { useEffect, useState } from "react";
import "../../styles/dataModal.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { createData, updateData } from "../../request/data";
import { getColumns } from "../../request/table";
import { BarLoader } from "react-spinners";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";

interface ColumnData {
  columnName: string;
  dataType: string;
  isIdentity: boolean;
  isPrimaryKey: boolean;
  // otras propiedades de la columna si es necesario
}

function CreateData({
  closeModal,
  tableColumns,
  databaseName,
  tableName,
  loadData,
  Updated,
  data,
}: any) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [tableColumnsData, setTableColumns] = useState<ColumnData[]>([]);
  const [isLoading, setisLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    // Llama a getColumnsTable cuando el componente se monte
    getColumnsTable();

    if (data) {
      setFormData(data);
    }
  }, []);
  const SweetAlert = (data: any) => {
    Swal.fire({
      title: "Realizado",
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
      timer: 1500,
    });
  };

  const handleCreateData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createData(
        databaseName,
        tableName,
        Object.keys(formData),
        Object.values(formData)
      );
      if (result) {
        SweetAlert("Registro Añadido");
        loadData();
        closeModal();
      }
    } catch (error: any) {
      SweetAlertError(error.message);
    }
  };
  const handleUpdateData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await updateData(
        databaseName,
        tableName,
        Object.keys(formData),
        Object.values(formData)
      );
      if (result) {
        SweetAlert("Registro Modificado");
        loadData();
        closeModal();
      }
    } catch (error: any) {
      SweetAlertError(error.message);
    }
  };
  const getColumnsTable = async () => {
    setisLoading(true);
    try {
      const columnData = await getColumns(databaseName, tableName);

      setTableColumns(columnData);
    } catch (error) {
      console.error("Error al obtener columnas:", error);
    }
    setisLoading(false);
  };

  const inputStyle = {
    marginTop: 3,
    minWidth: 130,
  };

  const getInputForType = (column: string, index: number) => {
    // Buscar el objeto correspondiente a la columna actual en tableColumnsData
    const columnData = tableColumnsData.find(
      (col: any) => col.columnName === column
    );

    if (columnData) {
      const { dataType, isIdentity } = columnData;
      const lowerCaseDataType = dataType.toLowerCase();
      if (isIdentity) {
        return (
          <FormControl sx={inputStyle} variant='outlined'>
            <InputLabel>{column}</InputLabel>
            <Input
              name={column}
              type='text'
              value={formData[column] || ""}
              disabled
              readOnly
            />
          </FormControl>
        );
      }
      if (Updated && index === 0) {
        return (
          <FormControl sx={inputStyle} variant='outlined'>
            <InputLabel>{column}</InputLabel>
            <Input
              name={column}
              type='text'
              value={formData[column] || ""}
              disabled
              readOnly
            />
          </FormControl>
        );
      }

      if (lowerCaseDataType.includes("date")) {
        let dateValue = formData[column] || "";
        if (dateValue) {
          const date = new Date(dateValue);
          dateValue = date.toISOString().split("T")[0];
        }
        return (
          <FormControl sx={inputStyle} variant='outlined'>
            <Input
              type='date'
              name={column}
              value={dateValue}
              onChange={handleChange}
            />
          </FormControl>
        );
      } else if (
        lowerCaseDataType.includes("int") ||
        lowerCaseDataType.includes("float")
      ) {
        return (
          <FormControl sx={inputStyle} variant='outlined'>
            <InputLabel>{column}</InputLabel>
            <Input
              type='number'
              name={column}
              value={formData[column] || ""}
              onChange={handleChange}
            />
          </FormControl>
        );
      }
    }

    // Si no se encuentra el tipo de dato o no coincide con ninguno de los casos especificados, se devuelve un input de tipo texto por defecto.
    return (
      <FormControl sx={inputStyle} variant='outlined'>
        <InputLabel>{column}</InputLabel>
        <Input
          type='text'
          name={column}
          value={formData[column] || ""}
          onChange={handleChange}
        />
      </FormControl>
    );
  };

  const isUpdate = Updated ? "Editar Registro" : "Crear Registro";
  return (
    <div className='modalBackground'>
      <div className='modalContainerData'>
        <div className='modalTittle'>
          <div>{isUpdate}</div>
          <button className='cancelBtn' onClick={() => closeModal(false)}>
            <IoCloseCircleOutline
              style={{
                fontSize: 26,
                marginTop: -5,
              }}
            />
          </button>
        </div>
        <form
          onSubmit={Updated ? handleUpdateData : handleCreateData}
          className='form-D'
        >
          {isLoading ? (
            <BarLoader />
          ) : (
            tableColumns &&
            tableColumns.map((column: string, index: number) => (
              <div>{getInputForType(column, index)}</div>
            ))
          )}
          <Button
            type='submit'
            variant='contained'
            size='small'
            sx={{
              backgroundColor: "#2e3f63",
              marginTop: 5,
            }}
          >
            {isUpdate}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateData;
