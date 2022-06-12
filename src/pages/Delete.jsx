import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const { id } = useParams();

  const onDelete = async (e) => {
    try {
      const token = localStorage.getItem("token");

      const createRequest = await axios.delete(
        `http://localhost:2000/posts/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const createResponse = createRequest.data;

      if (createResponse.status) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onDelete();
  }, []);

  return <Container className="my-5 w-50"></Container>;
}