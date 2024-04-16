import React, { useState, useEffect } from "react";
import Content from "../components/content";
import Sidebar from "../components/sidebar";
import "../App.css";
import { BarLoader } from "react-spinners";

function Dashboard(isLoggedIn: any) {
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
          <Content />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
