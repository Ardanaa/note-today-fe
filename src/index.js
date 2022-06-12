import React from "react";
import { render } from "react-dom";
import "./index.css";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Delete from "./pages/Delete";
import Update from "./pages/Update";

const root = document.getElementById("root");
render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/post" element={<Post />} />
      <Route path="/delete/:id" element={<Delete />} />
      <Route path="/update/:id" element={<Update />} />
    </Routes>
  </Router>,
  root
);
