import React, { useEffect, useRef, useState } from "react";
import { BiData } from "react-icons/bi";
import "../styles/sidebar.css";
import { getTables } from "../request/table";
import { getDatabases } from "../request/database";
import PopMenu from "../utils/PopMenu";
import { Scrollbars } from "react-custom-scrollbars";
import { useNavigate } from "react-router-dom";
import PopMenuTable from "../utils/PopMenuTable";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiRefreshCw } from "react-icons/fi";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Tooltip,
} from "@mui/material";
import {
  Dns,
  Folder,
  Home,
  ArrowDropDown,
  ArrowRight,
} from "@mui/icons-material";
import Swal from "sweetalert2";
const Sidebar = () => {
  const Navigator = useNavigate();
  const [databases, setDatabases] = useState<
    { name: string; collation: string }[]
  >([]);

  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const [openDatabases, setOpenDatabases] = useState<{
    [key: string]: boolean;
  }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenTable, setIsMenuOpenTable] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [openTables, setOpenTables] = useState<{ [key: string]: string[] }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoagind] = useState(false);
  const [isLoadingTable, setIsLoagindTable] = useState(false);

  useEffect(() => {
    loadDatabases(); // Cargar bases de datos al montar el componente
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsMenuOpenTable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SweetAlertError = (data: any) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleMenuToggle = (
    event: React.MouseEvent<HTMLSpanElement>,
    database: any
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 100;
    const windowHeight = window.innerHeight;
    let menuY = rect.bottom;
    if (rect.bottom + menuHeight > windowHeight) {
      menuY = Math.max(rect.top - menuHeight, 0);
    }

    // Establecer la posición del menú
    setMenuPosition({ x: rect.left, y: menuY });
    setIsMenuOpen(!isMenuOpen);
    setSelectedDatabase(database);
  };

  const handleMenuToggleTable = (
    event: React.MouseEvent<HTMLSpanElement>,
    database: any,
    table: any
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuHeight = 100;
    const windowHeight = window.innerHeight;
    let menuY = rect.bottom;
    if (rect.bottom + menuHeight > windowHeight) {
      menuY = Math.max(rect.top - menuHeight, 0);
    }

    // Establecer la posición del menú
    setMenuPosition({ x: rect.left, y: menuY });
    setIsMenuOpenTable(!isMenuOpenTable);
    setSelectedDatabase(database);
    setSelectedTable(table);
  };

  const loadDatabases = async () => {
    try {
      setIsLoagind(true);
      const data = await getDatabases();
      const databaseList = data.databases
        .map((database: any) => ({
          name: database.name,
          collation: database.collation,
        }))
        .filter(
          (database: any) =>
            database.name !== "master" &&
            database.name !== "tempdb" &&
            database.name !== "model" &&
            database.name !== "msdb"
        );
      setDatabases(databaseList);
      setIsLoagind(false);
      const tablesPromises = data.databases.map(async (database: any) => {
        try {
          setIsLoagindTable(true);
          const tables = await getTables(database.name);
          setIsLoagindTable(false);
          return { database: database.name, tables };
        } catch (error) {
          console.error(`Error al obtener tablas de ${database.name}:`, error);
          return null;
        }
      });

      const tablesResults = await Promise.all(tablesPromises);
      const tablesByDatabase: { [key: string]: string[] } = {};
      tablesResults.forEach((result) => {
        if (result) {
          tablesByDatabase[result.database] = result.tables;
        }
      });
      setOpenTables(tablesByDatabase);
    } catch (error) {
      console.error("Error al obtener bases de datos:", error);
      SweetAlertError(
        "Ocurrió un error al cargar las bases de datos. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
    }
  };

  const handleDatabaseClick = async (database: string) => {
    const isOpen = openDatabases[database] || false; // Verifica si la base de datos está abierta o cerrada

    setOpenDatabases({ ...openDatabases, [database]: !isOpen }); // Cambia el estado de la base de datos
    if (!isOpen) {
      // Si la base de datos está cerrada, carga las tablas
      try {
        const tables = await getTables(database);
        setOpenTables({ ...openTables, [database]: tables }); // Actualiza el estado de las tablas de esta base de datos
      } catch (error) {
        console.error(`Error al obtener tablas de ${database}:`, error);
        SweetAlertError(
          "Ocurrió un error al cargar las tablas. Por favor, inténtalo de nuevo más tarde"
        );
      }
    }
  };

  return (
    <div className='menu'>
      <div className='menu-content'>
        <div className='logo'>
          <BiData className='logo-icon' />
          <h2>PrimeSQL</h2>
        </div>
        <div className='menu--list'>
          <List component='div' disablePadding>
            <ListItem>
              <ListItemIcon>
                <Home sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "white", marginLeft: -3 }}
                primary='Bases de Datos'
              />
              <Tooltip title='Refrescar'>
                <IconButton
                  onClick={loadDatabases}
                  sx={{
                    "& svg": {
                      color: "rgba(255,255,255,0.8)",
                      transition: "0.2s",
                      transform: "translateY(0) rotate(0)",
                    },
                    "&:hover": {
                      bgcolor: "gray",
                    },
                  }}
                >
                  <FiRefreshCw />
                </IconButton>
              </Tooltip>
            </ListItem>
            <Scrollbars
              autoHeight
              autoHeightMin={"70vh"}
              style={{ marginTop: 8 }}
            >
              {databases.map((database, index) =>
                isLoading ? (
                  <Skeleton width={220} height={30} />
                ) : (
                  <>
                    <ListItem
                      sx={{ marginLeft: -2 }}
                      secondaryAction={
                        <IconButton
                          sx={{
                            marginTop: -2,
                            backgroundColor: "#2e3f63",
                            "&:hover": { backgroundColor: "#1e3460" },
                          }}
                          onClick={(event) => handleMenuToggle(event, database)}
                        >
                          <GiHamburgerMenu color='white' />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        onClick={() => {
                          handleDatabaseClick(database.name);
                        }}
                        sx={{ marginTop: -2 }}
                      >
                        <ListItemIcon sx={{ marginRight: -3, color: "white" }}>
                          {openDatabases[database.name] ? (
                            <ArrowDropDown />
                          ) : (
                            <ArrowRight />
                          )}
                        </ListItemIcon>
                        <ListItemIcon>
                          <Dns sx={{ color: "turquoise" }} />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "white", marginLeft: -4 }}
                          primary={database.name}
                        />
                      </ListItemButton>
                    </ListItem>

                    <Collapse
                      in={openDatabases[database.name]}
                      timeout='auto'
                      unmountOnExit
                    >
                      {openTables[database.name]?.map((table, index) =>
                        isLoadingTable ? (
                          <Skeleton width={220} height={30} />
                        ) : (
                          <List component='div' disablePadding>
                            <ListItem
                              sx={{
                                marginLeft: -2,
                              }}
                              secondaryAction={
                                <IconButton
                                  sx={{ marginTop: -2 }}
                                  onClick={(event) =>
                                    handleMenuToggleTable(
                                      event,
                                      database,
                                      table
                                    )
                                  }
                                >
                                  <GiHamburgerMenu color='white' />
                                </IconButton>
                              }
                            >
                              <ListItemButton
                                onClick={() =>
                                  Navigator(`/View/${database.name}/${table}`, {
                                    state: {
                                      selectedTable: table,
                                      selectedDatabase: database.name,
                                    },
                                  })
                                }
                                sx={{ marginTop: -2 }}
                              >
                                <ListItemIcon>
                                  <Folder sx={{ color: "wheat" }} />
                                </ListItemIcon>
                                <ListItemText
                                  sx={{ color: "white", marginLeft: -3 }}
                                  primary={table}
                                />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        )
                      )}
                    </Collapse>
                  </>
                )
              )}
            </Scrollbars>
          </List>
        </div>
        {isMenuOpen && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
            }}
          >
            <PopMenu
              ClosePop={() => setIsMenuOpen(false)}
              selectedDatabase={selectedDatabase}
              onUpdateDatabases={loadDatabases}
              Conected={""}
            />
          </div>
        )}
        {isMenuOpenTable && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
            }}
          >
            <PopMenuTable
              onClose={() => setIsMenuOpenTable(false)}
              selectedDatabase={selectedDatabase}
              onUpdateDatabases={loadDatabases}
              selectedTable={selectedTable}
              Conected={""}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
