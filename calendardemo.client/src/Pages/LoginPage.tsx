import React, { useEffect } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import PageTitle from '../Components/PageTitle'
import LoginForm from '../Components/LoginForm'
import { User } from '../Common/Models'

interface ILoginPage {
    onLogin: (user: User) => void
    onLoad: () => void
}

const LoginPage = (props: ILoginPage) => {

    useEffect(() => {
        props.onLoad();
    }, []);
    

    function handleLogin(user: User) {
        props.onLogin(user);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <PageTitle titleText="Calendar Demo Login" />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg="4">
                    <LoginForm onLogin={handleLogin} />
                </Col>
            </Row>
        </Container>
    );

}

export default LoginPage;