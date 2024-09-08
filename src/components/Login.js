import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

import Logo from "../assets/logo.jpg";

import {
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await loginUser(email, password);
      localStorage.setItem("accessToken", token);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 400, padding: "20px" }}>
          <CardContent>

            <div style={{ textAlign: "center", marginBottom: "5px" }}>
              <img src={Logo} alt="Logo" style={{ width: "250px" }} />
            </div>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <Typography color="error" align="center" sx={{ marginTop: 2 }}>
                  {error}
                </Typography>
              )}

              <CardActions sx={{ justifyContent: "center", marginTop: 2 }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ padding: 1.5 }}
                  >
                    Giriş Yap
                  </Button>
                )}
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
