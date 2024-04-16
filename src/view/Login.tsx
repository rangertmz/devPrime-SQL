import React, { useEffect, useState } from "react";
import { BiData } from "react-icons/bi";
import { login } from "../request/login";
import '../styles/login.css'
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { SelectUser, setUser } from "../redux/reducers/getCurrentDbReducer";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, LockRounded } from "@mui/icons-material";

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; 
}

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorPass, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const location = useLocation()
  const Navigator = useNavigate()
  const { showToast } = location.state || {}
  const dispatch = useDispatch()
  const user = useSelector(SelectUser)
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
 useEffect(() => {
   
  if(showToast && user.user !== undefined){
    toast.dark('Hasta luego ' + user.user)
    dispatch(setUser({name:""}))
  }
 
 }, [showToast])
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(username===""){
        setErrorName(true)
      }else{
        setErrorName(false)
      }
      if(password===""){
        setError(true)
      }else{
        setError(false)
      }
      if(username && password){
        const result = await login(username, password);
      if (result) {
        setIsLoggedIn(true);
        dispatch(setUser({user:username}))
        toast.dark('Bienvenido ' + username)
        setTimeout(()=>{
          Navigator('Dashboard')
        },2000)
      }else{
        toast.error("Usuario o Contraseña incorrectos")
      }
      }
    } catch (e) {
      console.log("Ha ocurrido un error", e);
      toast.error("Error al iniciar sesion. Por favor, intentelo de nuevo");
    }
  };

  return (
    <div className="container">
      <form className="form">
        <h1 style={{ fontSize: "40px", color: "#27374d" }}>
          <BiData
            style={{ fontWeight: "bold", fontSize: "60px", color: "#af0d0d " }}
          />
          PrimeSQL
        </h1>
        <div className="form-container">
          <FormControl>
            <InputLabel>Usuario</InputLabel>
            <Input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
              <AccountCircle/>
            </InputAdornment>
            }
           
            />
            {errorName && <div style={{ color: 'red', fontSize:'10px' }}>Por favor ingrese un nombre de usuario.</div> }
          </FormControl>
         
         
         <div style={{marginTop:10}}>
         <FormControl sx={{marginTop:2}}>
            <InputLabel>Password</InputLabel>
            <Input
            
            size="small"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={
              <InputAdornment position="start" >
              <LockRounded/>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
              <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            }
           
            />
            {errorPass && <div style={{ color: 'red', fontSize:'10px' }}>Por favor ingrese una contraseña.</div>}
          </FormControl>
          
         </div>
        </div>
       
        <Button onClick={handleSubmit} variant="contained" sx={{backgroundColor:'#2e3f63', color:'white', marginTop:1, width:230}}>
            Conectar
        </Button>
      </form>
      <ToastContainer
      position="top-center"
      hideProgressBar={true}
      limit={100}
      />
    </div>
  );
}

export default Login
