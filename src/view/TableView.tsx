import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import ContentTable from "../components/ContentTable";
import "../App.css";
import { BarLoader } from "react-spinners";

const TableView = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='dashboard--content'>
        {isLoading ? (
          <BarLoader
            color={"#2e3f63"}
            cssOverride={{
              left: "45%",
              top: "45%",
            }}
          />
        ) : (
          <ContentTable />
        )}
      </div>
    </div>
  );
};

export default TableView;
