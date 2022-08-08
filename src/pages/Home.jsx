import { Link, Navigate } from "react-router-dom";
import {
	Button,
	Alert,
	Container,
	Dropdown,
	Col,
	Row,
	Card,
	Modal,
	Navbar,
	NavDropdown,
	Badge,
	OverlayTrigger,
	Popover,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [user, setUser] = useState({});
	const [post, setPost] = useState([]);
	const [postToDelete, setPostToDelete] = useState();
	const [showModal, setShowModal] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const [successResponse, setSuccessResponse] = useState({
		isSuccess: false,
		message: "",
	});

	const [errorResponse, setErrorResponse] = useState({
		isError: false,
		message: "",
	});

	const handleCloseModal = () => {
		setPostToDelete(null);
		setShowModal(false);
	};
	const handleShowModal = (e, post) => {
		e.preventDefault();
		setPostToDelete(post);
		setShowModal(true);
	};

	useEffect(() => {
		const validateLogin = async () => {
			try {
				// Check status user login
				// 1. Get token from localStorage
				const token = localStorage.getItem("token");

				// 2. Check token validity from API
				const currentUserRequest = await axios.get(
					"https://note-today-be.herokuapp.com/auth/me",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const currentUserResponse = currentUserRequest.data;

				if (currentUserResponse.status) {
					setUser(currentUserResponse.data.user);
				}
			} catch (err) {
				setIsLoggedIn(false);
			}
		};

		const postData = async () => {
			const response = await axios.get(`https://note-today-be.herokuapp.com/api/posts`);
			console.log(response);
			const data = await response.data.data.posts;
			console.log(data);

			setPost(data);
		};

		validateLogin();
		postData();
		setIsRefresh(false);
	}, [isRefresh]);

	const onDelete = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");

			const createRequest = await axios.delete(
				`https://note-today-be.herokuapp.com/posts/${postToDelete.id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const successResponse = createRequest.data.message;

			setSuccessResponse({
				isSuccess: true,
				message: successResponse,
			});

			console.log(createRequest);
			setPostToDelete(null);
			setShowModal(false);

			setIsRefresh(true);
		} catch (err) {
			console.log(err);

			const response = err.response.data;

			setErrorResponse({
				isError: true,
				message: response.message,
			});
		}
	};

	const logout = () => {
		localStorage.removeItem("token");

		setIsLoggedIn(false);
		setUser({});
	};

	const popover = (
		<Popover id="popover-basic">
			<Popover.Header as="h3">What you wanna do?</Popover.Header>
			<Popover.Body>
				<Link to="/post">
					<Button className="mb-3 w-100" variant="success">
						Create Post
					</Button>
				</Link>
				<Link to="/about">
					<Button className="w-100" variant="success">Go to about page</Button>
				</Link>
			</Popover.Body>
		</Popover>
	);

	return isLoggedIn ? (
		<div className="background">
			<Container className="pb-5">
				<Navbar variant="dark">
					<Container>
						<NavDropdown title="Account" id="basic-nav-dropdown">
							<NavDropdown.Item>Signed in as: {user.name}</NavDropdown.Item>
							<NavDropdown.Item>
								Logout
							</NavDropdown.Item>
						</NavDropdown>
						<Navbar.Brand className="justify-content-start">
							Take a look of our journey,
						</Navbar.Brand>
					</Container>
				</Navbar>
				{successResponse.isSuccess && (
					<Alert
						variant="success"
						onClose={() => setSuccessResponse(true)}
						dismissible
					>
						{successResponse.message}
					</Alert>
				)}

				{errorResponse.isError && (
					<Alert
						variant="danger"
						onClose={() => setErrorResponse(true)}
						dismissible
					>
						{errorResponse.message}
					</Alert>
				)}

				<Alert variant="dark" className="w-25 text-center ms-auto">
					{user.name}!
				</Alert>
				<OverlayTrigger trigger="click" placement="right" overlay={popover}>
					<Button variant="dark">Looking for something?</Button>
				</OverlayTrigger>

				<Container className="mt-5">
					{post.map((post) => (
						<Row key={post.id}>
							<Col md={10} className="m-auto">
								<Card
									className="shadow text-white bg-transparent "
									style={{ marginTop: "2rem" }}
									border="dark"
								>
									<img
										src={`https://note-today-be.herokuapp.com/public/files/${post.picture}`}
										alt=""
										style={{ objectFit: "cover", minHeight: "300px" }}
									/>

									<div className="card-body">
										<p className="card-text fw-bold fs-1">
											{post.title}{" "}
											{/* <span className="fs-6 text-white-50">
												by: {user.name}
											</span> */}
										</p>
										<Badge bg="info">Created At: {post.createdAt}</Badge>{" "}
										<br></br>
										<Badge bg="info">Updated At: {post.updatedAt}</Badge>{" "}
										<p className="card-text mt-4 fs-5">{post.description}</p>
										<Dropdown style={{ marginLeft: "720px" }}>
											<Dropdown.Toggle variant="dark" id="dropdown-basic">
												Hate this post?
											</Dropdown.Toggle>

											<Dropdown.Menu variant="dark">
												<Dropdown.Item>
													<Link className="" to={`/update/${post.id}`}>
														<Button className="w-100" variant="warning">
															Edit
														</Button>
													</Link>
												</Dropdown.Item>
												<Dropdown.Item>
													<Button
														className="w-100"
														variant="danger"
														onClick={(e) => handleShowModal(e, post)}
													>
														Delete
													</Button>
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</Card>
							</Col>
						</Row>
					))
						.reverse()}
				</Container>

				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>Catatan ini akan di hapus</Modal.Title>
					</Modal.Header>
					<Modal.Body>Yakin mau di hapus?</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseModal}>
							Maaf kepencet
						</Button>
						<Button variant="danger" onClick={(e) => onDelete(e)}>
							Hapus aja
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		</div>
	) : (
		<Navigate to="/login" replace />
	);
}

export default Home;
