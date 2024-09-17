import '../css/App.css';
import React, { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Container, Col, Row, Nav, Navbar } from 'react-bootstrap'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import SearchPage from './SearchPage'
import { AuthenticationRepo } from '../Repository/Repo'
import { User } from '../Common/Models'
import { LocalStorageUtils } from '../Common/Utils'
import { Constants } from '../Common/Constants'

interface IProtectedRoute {
    loggedInTest: boolean,
    redirectPath?: string
}

const ProtectedRoute = ({loggedInTest, redirectPath = '/Login'}: IProtectedRoute) => {
    if (!loggedInTest) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const App = () => {
    const [currentUser, setCurrentUser] = useState<User>(LocalStorageUtils.GetItem(Constants.CurrentUser));
    const navigate = useNavigate();

    
    function handleLogin(user: User) {
        setCurrentUser(user);
        
        LocalStorageUtils.SetItem(Constants.CurrentUser, JSON.stringify(user));
        
        navigate('/Search');
    }

    function logOut() {

        AuthenticationRepo.Logout()
            .then(() => {
                LocalStorageUtils.SetItem(Constants.AuthenticationToken, null);
                LocalStorageUtils.SetItem(Constants.CurrentUser, null);
                setCurrentUser(null!);
            });

    }
    
    return (
        <>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col className="p-0">
                        <Navbar expand="lg" data-bs-theme="dark" className="theme-medium-blue bg-gradient">
                            <Container>
                                <Navbar.Brand href="/" className="fs-3">
                                    <img
                                        alt=""
                                        src="/src/images/CalendarIcon.png"
                                        width="30"
                                        height="30"
                                        className="d-inline-block align-top m-1"
                                    />
                                    {' '}Calender Demo
                                </Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <Nav.Link href="/">Home</Nav.Link>
                                        <Nav.Link href="/login">Login</Nav.Link>
                                        {
                                        (!!currentUser) &&
                                        <Nav.Link href="/Search">Search</Nav.Link>
                                        }
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="page-content text-secondary">
                <Row className="justify-content-md-center">
                    <Col>
                        
                        <Routes>
                            <Route path="/" element={<HomePage/>} />
                            <Route path="/Login" element={<LoginPage onLoad={logOut} onLogin={handleLogin} />} />
                            
                            <Route element={<ProtectedRoute loggedInTest={!!currentUser} />}>
                                <Route path="/Search" element={<SearchPage />} />
                            </Route>
                            
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        
                    </Col>
                </Row>
            </Container>
            <Container fluid className="theme-medium-blue page-footer bg-gradient">
                <Row>
                    <Col className="page-footer-contents">
                        &copy; Calendar Demo
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;