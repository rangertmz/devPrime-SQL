import React, { useEffect, useState } from "react";
import "../styles/table.css";
import { GoArrowLeft } from "react-icons/go";
import Scrollbars from "react-custom-scrollbars";
import { useLocation, useNavigate } from "react-router-dom";
import TableField from "../Interfaces/ITable";
import {
  createTable,
  deleteColumn,
  getColumns,
  updateTable,
} from "../request/table";
import { BarLoader } from "react-spinners";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";

const ContentTable: React.FC = () => {
  const Navigator = useNavigate();
  const location = useLocation();
  const { selectedDatabase } = location.state || {};
  const { update } = location.state || {};
  const { selectedTable } = location.state || {};
  const isUpdate = update ? "Modificar Tabla" : "Crear Tabla";

  const [isLoading, setIsLoading] = useState(update ? true : false);

  const initialFields: TableField[] = Array.from({ length: 1 }, () => ({
    oldColumnName: "",
    columnName: "",
    dataType: "",
    maxLength: 0,
    isNullable: false,
    isPrimaryKey: false,
    isIdentity: false,
    isNew: true,
  }));
  const [tableName, setTableName] = useState("");

  const [fields, setFields] = useState<TableField[]>(initialFields);
  const dataTypes = [
    { value: "int", label: "Int" },
    { value: "varchar", label: "Varchar" },
    { value: "char", label: "Char" },
    { value: "text", label: "Text" },
    { value: "float", label: "Float" },
    { value: "date", label: "Date" },
    { value: "datetime2", label: "Datetime2" },
  ];

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        oldColumnName: "",
        columnName: "",
        dataType: "",
        maxLength: 0,
        isNullable: false,
        isPrimaryKey: false,
        isIdentity: false,
        isNew: true,
      },
    ]);
  };

  const handleRemoveField = async (index: number, name: any) => {
    const fieldToRemove = fields[index];
    if (fieldToRemove.isNew) {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    } else {
      if (update) {
        const result = await deleteColumn(
          selectedDatabase,
          selectedTable,
          name
        );
        if (result) {
          const updatedFields = [...fields];
          updatedFields.splice(index, 1);
          setFields(updatedFields);
        }
      }
    }
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };
  const getTableColumns = async () => {
    try {
      setIsLoading(true);
      const result = await getColumns(selectedDatabase, selectedTable);

      if (result) {
        const columns = result || [];
        console.log(result);
        const modifiedColumns = columns.map((field: any) => ({
          oldColumnName: field.columnName, // Aquí asignamos el nombre antiguo a oldColumnName
          columnName: field.columnName,
          dataType: field.dataType,
          maxLength: field.maxLength,
          isNullable: field.isNullable,
          isPrimaryKey: field.isPrimaryKey,
          isIdentity: field.isIdentity,
        }));
        setFields(modifiedColumns);

        setIsLoading(false);
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (update) {
      getTableColumns();
      setTableName(selectedTable);
    } else {
      setTableName("");
      setFields(initialFields);
    }
  }, [selectedTable]);
  const SweetAlert = (data: any) => {
    Swal.fire({
      title: "Realizado",
      text: data,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const SweetAlertInfo = (data: any) => {
    Swal.fire({
      text: data,
      icon: "warning",
      showConfirmButton: false,
      timer: 2500,
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

  const updateTableRequest = async () => {
    try {
      console.log(fields);
      const response = await updateTable(
        selectedDatabase,
        selectedTable,
        fields,
        tableName
      );
      if (!response.success) {
        // Si hay algún problema con la modificación de la columna, muestra un mensaje de error y detén el bucle
        SweetAlertError(response.message);
        return;
      }
      SweetAlert("Tabla modificada correctamente");
      Navigator("/Dashboard");
    } catch (e: any) {
      SweetAlertError(e.message);
    }
  };

  const createTablaRequest = async () => {
    try {
      const response = await createTable(selectedDatabase, tableName, fields);
      if (response) {
        SweetAlert("Tabla creada correctamente");
        Navigator(-1);
      }
    } catch (e: any) {
      SweetAlertError(e.message);
    }
  };
  const handleSubmit = async () => {
    const hasColumnName = fields.some(
      (field) => field.columnName.trim() !== ""
    );
    const hasColumnType = fields.some((field) => field.dataType.trim() !== "");
    if (!tableName) {
      SweetAlertInfo("Por favor coloque el nombre de la tabla");
    }
    if (!hasColumnName) {
      SweetAlertInfo(
        "Debe agregar por lo menos una columna antes de crear la tabla"
      );
    }
    if (!hasColumnType) {
      SweetAlertInfo("Seleccione un tipo de campo");
    }
    if (tableName && hasColumnName && hasColumnType) {
      if (update) {
        updateTableRequest();
      } else {
        createTablaRequest();
      }
    }
  };
  const handleIdentityChange = (index: number, checked: boolean) => {
    const updatedFields = [...fields];
    updatedFields[index].isIdentity = checked;

    // Si esta columna es marcada como identidad, deshabilitar las demás casillas de verificación para la propiedad isIdentity
    if (checked) {
      for (let i = 0; i < updatedFields.length; i++) {
        if (i !== index) {
          updatedFields[i].isIdentity = false;
        }
      }
    }

    setFields(updatedFields);
  };
  const handlePrimaryKeyChange = (index: number, checked: boolean) => {
    const updatedFields = [...fields];
    updatedFields[index].isPrimaryKey = checked;

    // Si esta columna es marcada como identidad, deshabilitar las demás casillas de verificación para la propiedad isIdentity
    if (checked) {
      for (let i = 0; i < updatedFields.length; i++) {
        if (i !== index) {
          updatedFields[i].isPrimaryKey = false;
        }
      }
    }

    setFields(updatedFields);
  };
  return (
    <div className='container-table'>
      <div>
        <IconButton onClick={() => Navigator("/Dashboard")}>
          <GoArrowLeft
            style={{
              fontWeight: 600,
              fontSize: 25,
              cursor: "pointer",
            }}
          />
        </IconButton>
        <h1 style={{ marginTop: 5 }}>
          {isUpdate} en{" "}
          {selectedDatabase.charAt(0).toUpperCase() + selectedDatabase.slice(1)}
        </h1>
      </div>
      <div className='form'>
        <label htmlFor='tableName'>Nombre de la Tabla:</label>
        <input
          type='text'
          id='tableName'
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          style={{
            marginLeft: 10,
          }}
        >
          {isUpdate}
        </button>
        <button
          onClick={handleAddField}
          style={{
            marginLeft: 10,
          }}
        >
          Agregar Campo
        </button>

        {isLoading ? (
          <BarLoader
            color='#2e3f63'
            cssOverride={{
              left: "90%",
              marginTop: "10vh",
            }}
          />
        ) : (
          <Scrollbars
            style={{
              width: "134vh",
              height: 300,
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Nombre del Campo</th>
                  <th>Tipo de Dato</th>
                  <th>Longitud</th>
                  <th>A_I</th>
                  <th>Pk</th>
                  <th>Null</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type='text'
                        placeholder={`Nombre del Campo ${index + 1}`}
                        value={field.columnName}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].columnName = e.target.value;
                          setFields(updatedFields);
                        }}
                      />
                    </td>
                    <td>
                      <select
                        value={field.dataType}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].dataType = e.target.value;
                          setFields(updatedFields);
                        }}
                      >
                        <option value=''>Seleccionar</option>
                        {dataTypes.map((type) => (
                          <option value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type='number'
                        placeholder={`Longitud ${index + 1}`}
                        value={field.maxLength}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].maxLength = parseInt(
                            e.target.value
                          );
                          setFields(updatedFields);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type='checkbox'
                        checked={field.isIdentity}
                        disabled={update || field.isIdentity}
                        onChange={(e) =>
                          handleIdentityChange(index, e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type='checkbox'
                        checked={field.isPrimaryKey}
                        disabled={update || field.isPrimaryKey}
                        onChange={(e) => {
                          handlePrimaryKeyChange(index, e.target.checked);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type='checkbox'
                        checked={field.isNullable}
                        onChange={(e) => {
                          const updatedFields = [...fields];
                          updatedFields[index].isNullable = e.target.checked;
                          setFields(updatedFields);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleRemoveField(index, field.columnName)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scrollbars>
        )}
      </div>
    </div>
  );
};

export default ContentTable;
