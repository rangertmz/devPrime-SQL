import React, { useState } from "react";
import { BiData } from "react-icons/bi";
import { login } from "../request/login";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/getCurrentDbReducer";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  LockRounded,
} from "@mui/icons-material";
import Swal from "sweetalert2";

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorPass, setError] = useState(false);
  const [errorName, setErrorName] = useState(false);

  const Navigator = useNavigate();

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const SweetAlert = () => {
    Swal.fire({
      title: "Sesion Iniciada",
      text: "Has iniciado sesion exitosamente",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const SweetAlertError = () => {
    Swal.fire({
      icon: "error",
      title: "Sesion no iniciada",
      text: "Usuario o Contraseña incorrectos",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (username === "") {
        setErrorName(true);
      } else {
        setErrorName(false);
      }
      if (password === "") {
        setError(true);
      } else {
        setError(false);
      }
      if (username && password) {
        const result = await login(username, password);
        if (result) {
          setIsLoggedIn(true);
          dispatch(setUser({ user: username }));
          SweetAlert();
          setTimeout(() => {
            Navigator("Dashboard");
          }, 1600);
        } else {
          SweetAlertError();
        }
      }
    } catch (e) {
      console.log("Ha ocurrido un error", e);

      SweetAlertError();
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className='form'>
        <h1 style={{ fontSize: "40px", color: "#27374d" }}>
          <BiData
            style={{ fontWeight: "bold", fontSize: "60px", color: "#af0d0d " }}
          />
          PrimeSQL
        </h1>
        <div className='form-container'>
          <FormControl>
            <InputLabel>Usuario</InputLabel>
            <Input
              sx={{
                width: 263,
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              }
            />
            {errorName && (
              <div style={{ color: "red", fontSize: "10px" }}>
                Por favor ingrese un nombre de usuario.
              </div>
            )}
          </FormControl>

          <div style={{ marginTop: 10 }}>
            <FormControl sx={{ marginTop: 2 }}>
              <InputLabel>Password</InputLabel>
              <Input
                size='small'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position='start'>
                    <LockRounded />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errorPass && (
                <div style={{ color: "red", fontSize: "10px" }}>
                  Por favor ingrese una contraseña.
                </div>
              )}
            </FormControl>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Button
            type='submit'
            variant='contained'
            sx={{ backgroundColor: "#2e3f63", color: "white", width: 230 }}
          >
            Conectar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
