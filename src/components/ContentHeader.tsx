import React, { useEffect, useState } from "react";
import { BiPlay } from "react-icons/bi";
import { FcAddDatabase } from "react-icons/fc";
import { GoAlert, GoCheck, GoTrash } from "react-icons/go";
import CreateDataBase from "./Modals/CreateDataBase";
import { Conect, getConsults, getCurrentDatabase } from "../request/consults";
import { Scrollbars } from "react-custom-scrollbars";
import { getDatabases } from "../request/database";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectCurrent,
  setCurrentDB,
} from "../redux/reducers/getCurrentDbReducer";
import { RotatingLines } from "react-loader-spinner";
import { IoMdLogOut } from "react-icons/io";
import {  useNavigate } from "react-router-dom"
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

interface ContentHeaderProps {
  data: string;
}
const ContentHeader = (props: ContentHeaderProps) => {
  const Navigator = useNavigate()
  const [openModal, setopenModal] = useState(false);
  const [resultado, SetResultado] = useState("");
  const [consultResult, setConsultResult] = useState([]);
  const [show, setshow] = useState(false);
  const [consult, SetConsult] = useState("");
  const [icono, setIcono] = useState<React.ReactNode>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [databases, setDatabases] = useState<
    { name: string; collation: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const dbCurrent = useSelector(SelectCurrent);

  const fetchCurrentDatabase = async () => {
    try {
      const currentDB = await getCurrentDatabase();
      console.log(currentDB);
      setSelectedDatabase(currentDB);
    } catch (error) {
      console.error("Error al obtener la base de datos actual:", error);
    }
  };
  const loadDatabases = async () => {
    try {
      const data = await getDatabases();
      const databaseList = data.databases.map((db: any) => ({
        name: db.name,
        collation: db.collation,
      }));
      setDatabases(databaseList);
      const dbList = [
        selectedDatabase,
        ...databaseList.filter((db: any) => db.name !== selectedDatabase),
      ];
      setDatabases(dbList);
    } catch (error) {
      console.error("Error al obtener bases de datos:", error);
    }
  };
  const ConectDatabase = async (database: any) => {
    try {
      getDBredux(database);
      await Conect(database);
    } catch (e: any) {
      console.log(e);
    }
  };
  const getDBredux = (db: any) => {
    dispatch(setCurrentDB({ name: db }));
  };

  useEffect(() => {
    const timeoutDb = setTimeout(() => {
      fetchCurrentDatabase();
      if (dbCurrent.name) {
        ConectDatabase(dbCurrent.name);
        setSelectedDatabase(dbCurrent.name);
        console.log(dbCurrent.name);
      }
    }, 1000);
    const intervalId = setInterval(loadDatabases, 2000); // Ejecutar cada minuto

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutDb);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    const { data } = props;

    e.preventDefault();

    if (data.trim() === "") {
      SetResultado("Consulta ejecutada con errores");
      setIcono(<GoAlert style={{ color: "red", marginRight: 10 }} />);
      setIsLoading(false);
      return;
    }
    const result = await getConsults(data);
    try {
      if (result) {
        setConsultResult(result);
        SetResultado("Consulta ejecutada exitosamente");
        setIcono(<GoCheck style={{ color: "green", marginRight: 10 }} />);
        console.log(result);
        fetchCurrentDatabase();
        setshow(true);
        SetConsult(
          (result.message ? result.message + "\n" : "") +
            (result.error ? result.error + "\n" : "") +
            (result.completionTime ? result.completionTime : "")
        );

        if (result.error) {
          SetResultado("Consulta ejecutada con errores");
          setIcono(<GoAlert style={{ color: "red", marginRight: 10 }} />);
        }
      }
      
    } catch (error) {
      SetResultado("Consulta ejecutada con errores");

      console.log(result);
    }
    setIsLoading(false)
  };
  const ClearResult = () => {
    setConsultResult([]);
    SetConsult("");
    SetResultado("");
    setIcono(null);
  };
  const DisconectBtn = () => {
    Navigator("/", { state: { showToast: true } });
  };
  return (
    <div className='container'>
      <div className='content'>
        <div className='content--header'>
          <FormControl size="small" variant="standard" sx={{minWidth: 120, marginTop:-1 }}>
            <InputLabel>Database</InputLabel>
            <Select
            
            value={selectedDatabase}
             onChange={(e) => {
              setSelectedDatabase(e.target.value);
              ConectDatabase(e.target.value);
            }}
            >
            {databases.map((db, index) => (
              <MenuItem key={index} value={db.name}>
                {db.name}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <FormControl sx={{minWidth: 120, marginTop:-1, marginLeft:2 }} >
            <Button
            onClick={() => {
              setopenModal(true);
            }}
            sx={{
              backgroundColor:"#2e3f63"
            }} variant="contained" startIcon={<FcAddDatabase/>}>Nueva DB</Button>
          </FormControl>
          <FormControl sx={{minWidth: 120, marginTop:-1, marginLeft:2 }} >
            <Button
            onClick={onSubmit}
            sx={{
              backgroundColor:"#2e3f63"
            }} variant="contained" startIcon={<BiPlay color='green'/>}>Ejecutar</Button>
          </FormControl>
          <FormControl sx={{minWidth: 120, marginTop:-1, marginLeft:'auto' }} >
            <Button
            onClick={DisconectBtn}
            sx={{
              backgroundColor:"#2e3f63"
            }} variant="contained" startIcon={<IoMdLogOut />}>Cerrar Conexion</Button>
          </FormControl>
        
        
        </div>
        {openModal && <CreateDataBase closeModal={setopenModal} />}

        <div
          className='result'
          style={{
            width: "144vh",
            height: "34vh",
            position: "absolute",
            marginTop: "23vh",
            left: 330,
          }}
        >
          {show && (
            <div>
              <span
                style={{
                  textAlign: "left",
                  marginLeft: "-130vh",
                }}
              >
                Resultado
                <GoTrash
                  onClick={ClearResult}
                  style={{
                    color: "darkred",
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                />
              </span>
              <hr
                style={{
                  marginBottom: "5px",
                  border: "1px solid gray",
                }}
              />
            </div>
          )}

          {consultResult && consultResult.length > 0 ? ( // Si hay resultados
            <Scrollbars
              style={{ width: "144vh", height: "39vh", position: "absolute" }}
            >
              <table>
                <thead>
                  <tr>
                    <th></th> {/* Columna del índice de las filas */}
                    {Object.keys(consultResult[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consultResult.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className='index'>{rowIndex + 1}</td>{" "}
                      {/* Índice de las filas */}
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>
                          {value != null ? value.toString() : "NULL"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scrollbars>
          ) : (
            // Si no hay resultados (o si la consulta no es un SELECT)
            <div
              style={{
                textAlign: "left",
                marginTop: "5vh",
                whiteSpace: "pre-line",
              }}
            >
              <span>{consult}</span> {/* Mostrar mensaje de resultado */}
            </div>
          )}
        </div>

        <div className='footer-back'></div>
      </div>
      <div className='footer'>
        <hr />
        <span>
          {isLoading ? (
            <RotatingLines
            
            width="20"
          />
          ):(
            <>
            {icono}
            {resultado}
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default ContentHeader;
