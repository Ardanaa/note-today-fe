import { Link, useNavigate } from "react-router-dom";
import { Form, Container, Button, Alert, } from "react-bootstrap";
import { useState, useRef } from "react";
import axios from "axios";

export default function Post() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");
  const [pictureField, setPictureField] = useState();

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onPost = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const postPayload = new FormData();

      postPayload.append("title", titleField.current.value);
      postPayload.append("description", descriptionField.current.value);
      postPayload.append("picture", pictureField);

      const postRequest = await axios.post(
        "http://localhost:2000/posts",
        postPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const postResponse = postRequest.data;

      if (postResponse.status) {
        navigate("/");
      }
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
      <Container className="text-white" style={{padding:"88.5px 0px"}}>
        <Alert style={{ width: "400px", margin: "auto" }}>
          What's going on today?
        </Alert>
        <Form onSubmit={onPost} style={{ width: "400px", margin: "auto" }}>
          <Form.Group className="py-3">
            <Form.Label>Judul</Form.Label>
            <Form.Control
              type="text"
              ref={titleField}
              placeholder="Masukkan Judul"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              type="text"
              ref={descriptionField}
              placeholder="Masukkan Deskripsi"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setPictureField(e.target.files[0])}
            />
          </Form.Group>
          {errorResponse.isError && (
            <Alert variant="danger">{errorResponse.message}</Alert>
          )}
          <Button className="w-100" type="submit">
            Post
          </Button>
          <Link to="/">
            <Button className="mt-3" variant="success">
              Go to home page
            </Button>
          </Link>
        </Form>
      </Container>
    </div>
  );
}
