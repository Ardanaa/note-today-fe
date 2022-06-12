import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Container, Button, Alert } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Update() {
  const navigate = useNavigate();
  const { id } = useParams();

  const titleField = useRef("");
  const descriptionField = useRef("");
  const [pictureField, setPictureField] = useState();
  const [data, setData] = useState([]);

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const postPayload = new FormData();

      postPayload.append("title", titleField.current.value);
      postPayload.append("description", descriptionField.current.value);
      postPayload.append("picture", pictureField);

      const postRequest = await axios.put(
        `http://localhost:2000/posts/${id}`,
        postPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const postResponse = postRequest.data;

      if (postResponse.status) navigate("/");
    } catch (err) {
      console.log(err);
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  const getPosts = async () => {
    try {
      const responsePosts = await axios.get(
        `http://localhost:2000/api/posts/${id}`
      );

      const dataPosts = await responsePosts.data.data.getdata;

      setData(dataPosts);
      console.log(dataPosts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  console.log(data);

  return (
    <div className="background h-100">
      <Container className="text-white" style={{padding:"88.5px 0px", width: "400px"}}>
        <Alert>Look like someone is typo</Alert>
        <Form onSubmit={onUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Judul</Form.Label>
            <Form.Control
              type="text"
              ref={titleField}
              placeholder="Masukkan Judul Baru"
              defaultValue={data.title}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              type="text"
              ref={descriptionField}
              placeholder="Masukkan Deskripsi Baru"
              defaultValue={data.description}
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
            Update Post
          </Button>
        </Form>
        <Link to="/">
          <Button className="mt-3 w-100" variant="success">
            Go to home page
          </Button>
        </Link>
      </Container>
    </div>
  );
}
