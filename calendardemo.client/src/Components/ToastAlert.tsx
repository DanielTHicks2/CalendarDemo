import React from 'react'
import Toast from 'react-bootstrap/Toast'
import { ToastContainer } from 'react-bootstrap';

class ToastParams {
    showToast: boolean = false;
    toastText: string = '';
    variant: string = 'danger';
    delay: number = 2000;
    onClose: () => void = () => { };
}

const ToastAlert = (props: ToastParams) => {

    return (
        <ToastContainer containerPosition="position-fixed" position="top-center" style={{ zIndex: 1000 }} >
            <Toast
                onClose={props.onClose}
                show={props.showToast}
                animation={true}
                autohide
                delay={props.delay}
                bg={props.variant}>
                <Toast.Body className="text-white fw-bold text-nowrap">{props.toastText}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export { ToastParams }
export default ToastAlert;