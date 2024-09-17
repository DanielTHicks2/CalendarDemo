import React, { useState, SyntheticEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { ToastAlert, ToastParams, WaitAnimation } from '../Common/Components'
import { AuthenticationRepo } from '../Repository/Repo'
import { APIResult, LoginCredentials, User } from '../Common/Models'
import { LocalStorageUtils } from '../Common/Utils'
import { Constants } from '../Common/Constants'


const LoginForm = (props: {onLogin: (user: User) => void }) => {
    const [formData, setFormData] = useState<LoginCredentials>(new LoginCredentials());
    const [errorData, setErrorData] = useState(new ToastParams());
    const [isCallingAPI, setIsCallingAPI] = useState(false);

    function handleChange (e: SyntheticEvent) {
        const field = e.currentTarget as HTMLInputElement;
        setFormData({
            ...formData,
            [field.id]: field.value
        });
    }

    function tryLogin(e: SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();

        setIsCallingAPI(true);

        AuthenticationRepo.Login(formData)
            .then(result => {
                if (!showError(result)) {
                    LocalStorageUtils.SetItem(Constants.AuthenticationToken, JSON.stringify({ 'Token': result.data.Token }));
                    props.onLogin(result.data.User);
                }
            })
            .finally(() => {
                setTimeout(() => { setIsCallingAPI(false); }, 250);
            });
    }

    function showError(response: APIResult<any>) {
        let toastParms = new ToastParams();

        switch (response.status) {
            case 200:
                {
                    break;
                }
            case 404:
                {
                    toastParms.showToast = true;
                    toastParms.toastText = 'Username or password is incorrect.';
                    break;
                }
            default:
                {
                    toastParms.showToast = true;
                    toastParms.toastText = 'Something went wrong.  Please try again.';
                    break;
                }
        }

        setErrorData(toastParms);
        return toastParms.showToast;
    }


    return (
        <>
        <ToastAlert
            onClose={() => setErrorData(new ToastParams())}
            showToast={errorData.showToast}
            toastText={errorData.toastText}
            variant={errorData.variant}
            delay={errorData.delay}
            />
        {
        (isCallingAPI && !errorData.showToast) &&
            <WaitAnimation hover={true} />
        }
        <Form onSubmit={tryLogin} className="mb-3 text-start text-secondary">
            <Form.Group controlId="Username" className=" p-3 fw-bold" >
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" placeholder="User Name" value={formData.Username} onChange={handleChange} required maxLength={20} />
            </Form.Group>

            <Form.Group controlId="Password" className="p-3 fw-bold" >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={formData.Password} onChange={handleChange} required className="p-2" maxLength={20} />
            </Form.Group>
            <div className="text-end">
                <Button className="primary me-2" type="submit">
                    Login
                </Button>
            </div>
        </Form>
        </>
    );
}

export default LoginForm;