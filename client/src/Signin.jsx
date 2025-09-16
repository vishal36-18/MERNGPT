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


export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField margin="normal" fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextField margin="normal" fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <Button type="submit" fullWidth variant="contained" color="success" size="large" sx={{ mt: 3, mb: 2 }}>Login</Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Button onClick={() => navigate("/")} fullWidth variant="outlined">Signup</Button>
      </Paper>
    </Container>
  );
}
