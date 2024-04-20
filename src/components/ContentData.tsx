import React, { useState, useEffect } from "react";
import { deleteData, getData } from "../request/data";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Scrollbars from "react-custom-scrollbars";
import "./../styles/data.css";
import { BarLoader } from "react-spinners";
import { GoArrowLeft, GoTrash } from "react-icons/go";
import { GrEdit } from "react-icons/gr";
import CreateData from "./Modals/CreateData";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";

const ContentData = () => {
  const location = useLocation();
  const Navigator = useNavigate();
  const { selectedTable } = location.state || {};
  const { selectedDatabase } = location.state || {};
  const [Data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [openModalUpdate, setopenModalUpdated] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const getTableData = async () => {
    try {
      setIsLoading(true);
      const { columns, data } = await getData(selectedDatabase, selectedTable);
      if (data) {
        setData(data);
        setColumns(columns);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    toast.dismiss();

    getTableData();
  }, [selectedTable]);

  const SweetAlertError = (data: any) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteData = async (row: any) => {
    try {
      const result = await deleteData(selectedDatabase, selectedTable, row);
      if (result) {
        setData((prevData) => prevData.filter((item) => item !== row));
      }
    } catch (error: any) {
      console.log(error);
      SweetAlertError(error.message);
    }
  };
  const SweetAlertDelete = (row: any) => {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "No podras revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteData(row);
        Swal.fire({
          title: "Eliminado!",
          text: "Registro eliminado correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  const onSubmit = () => {
    setopenModal(true);
  };
  const onEditSubmit = () => {
    setopenModalUpdated(true);
  };
  const onEditClick = (rowData: any) => {
    setSelectedRowData(rowData); // Establecer los datos del registro seleccionado en el estado
    onEditSubmit(); // Abrir el modal de edición
  };
  const renderCreateDataModal = () => {
    if (openModal) {
      return (
        <CreateData
          closeModal={setopenModal}
          tableColumns={columns}
          databaseName={selectedDatabase}
          tableName={selectedTable}
          loadData={getTableData}
        />
      );
    }
  };

  const renderEditDataModal = () => {
    if (openModalUpdate) {
      return (
        <CreateData
          data={selectedRowData}
          Updated={true}
          closeModal={setopenModalUpdated}
          tableColumns={columns}
          databaseName={selectedDatabase}
          tableName={selectedTable}
          loadData={getTableData}
        />
      );
    }
  };

  return (
    <div className='container-table'>
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
        {selectedDatabase &&
          selectedTable &&
          selectedDatabase.charAt(0).toUpperCase() +
            selectedDatabase.slice(1)}{" "}
        / {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}
      </h1>
      <button
        onClick={onSubmit}
        style={{
          marginBottom: "10px",
        }}
      >
        Añadir Registro
      </button>
      {IsLoading ? (
        <BarLoader />
      ) : (
        <Scrollbars autoHeight autoHeightMax={"60vh"}>
          {renderCreateDataModal()}
          {renderEditDataModal()}
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {Data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <>
                      <td key={colIndex}>{row[column]}</td>
                    </>
                  ))}
                  <td>
                    <GrEdit
                      title='Modificar'
                      onClick={() => {
                        onEditClick(row);
                      }}
                      style={{
                        marginRight: "20px",
                        color: "#2e3f63",
                        cursor: "pointer",
                      }}
                    />
                    <GoTrash
                      title='Eliminar'
                      color={"red"}
                      cursor={"pointer"}
                      onClick={() => SweetAlertDelete(row)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scrollbars>
      )}
      <ToastContainer />
    </div>
  );
};

export default ContentData;
