import React, { useState } from "react";
import "../../styles/modal.css";
import { updateDatabase } from "../../request/database";
import { toast } from "react-toastify";
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";

function UpdateDatabase({ DatabaseName, CloseModal ,onUpdateDatabases }: any) {
  const [collation, setCollation] = useState("");
  const [name, setName]= useState(DatabaseName.name)
  const [errorName, setErrorName] = useState(false);
  const [errorCollation, setErrorCollation] = useState(false);

  const collations = [
    { value: "Latin1_General_CI_AS", label: "Latin1_General_CI_AS" },
    {
      value: "SQL_Latin1_General_CP1_CI_AS",
      label: "SQL_Latin1_General_CP1_CI_AS",
    },
  ];

  const handleUpdateDatabase = async (e:React.FormEvent) => {
   e.preventDefault()
   try {
    if(!name){
      toast.info("Por favor coloque el nombre de la base de datos")
    }
    
    if(name){
      const result = await updateDatabase(DatabaseName.name,name,collation)
    if(result){
      CloseModal()
      onUpdateDatabases()
      toast.success('Base de datos actualizada')
      
    }
    }
  } catch (error:any) {
    toast.error(error.message)
  }
    
  }

  return (
    <div className='updateBackground'>
      <div className='modalUpdateDb'>
        <div className='modal-content-up'>
          <h1>Editar Propiedades de {DatabaseName.name}</h1>
          <form >
            <div className='form-group'>
            <FormControl sx={{ marginTop: 2, width:270 }}>
              <InputLabel>Nombre</InputLabel>
              <Input
                error={errorName}
                size='small'
                
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errorName && <div style={{color:'red', fontSize:'11px', fontWeight:'lighter'}}>Por favor coloque el nombre de la base de datos</div> }
            </FormControl>
            </div>
            <div className='form-group'>
            
              <select
              style={{
                width:280,
                marginTop:10
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
              <Button onClick={handleUpdateDatabase} variant="contained" size="small" sx={{
                backgroundColor:'#2e3f63',
                marginRight:2
              }}>
                Confirmar
              </Button>
              <Button onClick={CloseModal} variant="contained" color="error">
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
