import { useRef, useState } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const nameField = useRef("");
  const emailField = useRef("");
  const roleField = useRef("");
  const passwordField = useRef("");

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onRegister = async (e) => {
    e.preventDefault();

    try {
      const userToRegisterPayload = {
        name: nameField.current.value,
        email: emailField.current.value,
        role: roleField.current.value,
        password: passwordField.current.value,
      };

      const registerRequest = await axios.post(
        "https://note-today-be.herokuapp.com/register",
        userToRegisterPayload
      );

      const registerResponse = registerRequest.data;

      if (registerResponse.status) navigate("/login");
    } catch (err) {
      console.log(err);
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return (
    <div className="background">
      <Container className="py-5 text-white">
        <Card
          className="text-center mx-auto"
          style={{ width: "400px", backgroundColor: "#141414" }}
        >
          <Card.Body>
            <h1 className="mb-3">Register</h1>
            <Form onSubmit={onRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select ref={roleField}>
                  <option>Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nama</Form.Label>
                <Form.Control
                  type="text"
                  ref={nameField}
                  placeholder="Masukkan nama"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  ref={emailField}
                  placeholder="Masukkan Email"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordField}
                  placeholder="Masukkan Password"
                />
              </Form.Group>
              <p>
                Sudah punya akun? Silakan <Link to="/login">Login</Link>
              </p>
              {errorResponse.isError && (
                <Alert variant="danger">{errorResponse.message}</Alert>
              )}
              <Button className="w-100" type="submit">
                Daftar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
