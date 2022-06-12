import { useRef, useState } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
	const navigate = useNavigate();
	const emailField = useRef("");
	const passwordField = useRef("");

	const [errorResponse, setErrorResponse] = useState({
		isError: false,
		message: "",
	});

	const onLogin = async (e) => {
		e.preventDefault();

		try {
			const userToLoginPayload = {
				email: emailField.current.value,
				password: passwordField.current.value,
			};

			const loginRequest = await axios.post(
				"http://localhost:2000/auth/login",
				userToLoginPayload
			);

			const loginResponse = loginRequest.data;

			if (loginResponse.status) {
				localStorage.setItem("token", loginResponse.data.token);

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

	const onLoginGoogleSuccess = async (credentialResponse) => {
		try {
			const userToLoginPayload = {
				google_credential: credentialResponse.credential,
			};

			const loginGoogleRequest = await axios.post(
				"http://localhost:2000/auth/login-google",
				userToLoginPayload
			);

			const loginGoogleResponse = loginGoogleRequest.data;

			if (loginGoogleResponse.status) {
				localStorage.setItem("token", loginGoogleResponse.data.token);

				navigate("/");
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="background">
			<Container className="w-100 text-white" style={{padding: "70px 0px"}}>
				<Card
					className="text-center mx-auto"
					style={{ width: "400px", backgroundColor: "#141414" }}
				>
					<Card.Body>
						<h1 className="mb-3">N̴̘̏ơ̴͚t̷̢̊e̴̠͋ ̴̱̌T̴̪̍o̶͎̾d̵̰̒a̶̤͠y̴̦͒.̶̠̽</h1>
						<Form onSubmit={onLogin}>
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
							<Button className="w-100" type="submit">
								Masuk
							</Button>
							<div className="my-3">
								<GoogleOAuthProvider clientId="267430728849-02slttimlpr1advqpcfr8i4dfki3l13k.apps.googleusercontent.com">
									<GoogleLogin
										onSuccess={onLoginGoogleSuccess}
										onError={() => {
											console.log("Login Failed");
										}}
									/>
								</GoogleOAuthProvider>
							</div>
							{errorResponse.isError && (
								<Alert variant="danger">{errorResponse.message}</Alert>
							)}
						</Form>
					</Card.Body>
				</Card>
				<Card
					className="mx-auto mt-2 text-center"
					style={{ width: "400px", backgroundColor: "#141414" }}
				>
					<Card.Body>
						<p>
							Belum punya akun? Silakan <Link to="/register">Daftar</Link>
						</p>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
}
