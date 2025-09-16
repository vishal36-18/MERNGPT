import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import server from './server.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    
    try {
      const res = await fetch(`${server}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField margin="normal" fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField margin="normal" fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextField margin="normal" fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} required
            helperText={
              form.password.length > 0 && form.password.length < 6
                ? "Password must be at least 6 characters"
                : ""
            } />
          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>Signup</Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" align="center">Already have an account?</Typography>
        <Button onClick={handleLogin} fullWidth variant="outlined" sx={{ mt: 1 }}>Login</Button>
      </Paper>
    </Container>
  );
}
