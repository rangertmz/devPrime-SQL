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
    getTableData();
  }, [selectedTable]);

  const handleDeleteData = async (row: any) => {
    try {
      const result = await deleteData(selectedDatabase, selectedTable, row);
      if (result) {
        
        setData((prevData) => prevData.filter((item) => item !== row));
        toast.success("Dato eliminado");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
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
      <GoArrowLeft
        style={{
          fontWeight: 600,
          fontSize: 25,
          cursor: "pointer",
        }}
        onClick={() => Navigator("/Dashboard")}
      />
      <h1>
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
                        onClick={() => handleDeleteData(row)}
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
