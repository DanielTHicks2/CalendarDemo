import React, { SyntheticEvent, useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, Stack, Spinner } from 'react-bootstrap'
import { ToastAlert, ToastParams, WaitAnimation } from '../Common/Components';
import { CalendarEventRepo, UserRepo } from '../Repository/Repo';
import { DateUtils } from '../Common/Utils'
import { APIResult, CalendarEvent, User } from '../Common/Models'

interface ICalendarEventModal {
    show: boolean,
    event: CalendarEvent,
    onClose: () => void,
    onSave: () => void
}

const CalendarEventModal = (props: ICalendarEventModal) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<CalendarEvent>(new CalendarEvent());
    const [toastData, setToastData] = useState(new ToastParams());

    let times: {Value: string, Text: string}[] = [];

    for (let half = 0; half <= 1; half++){
        for (let h = 0; h < 12; h++) {
            const hour = h == 0 ? 12 : h;
            for (let m = 0; m < 60; m += 15) {
                const val = DateUtils.FormatDateTimePart(h + (half * 12)).concat(":").concat(DateUtils.FormatDateTimePart(m));
                const txt = DateUtils.FormatDateTimePart(hour).concat(":").concat(DateUtils.FormatDateTimePart(m)).concat(half == 0 ? ' am' : ' pm');
                times.push({Value: val, Text: txt});
            }
        }
    }

    useEffect(() => {
        UserRepo.GetUsers().then(result => {
            if (checkResponse(result, false)) {
                setUsers(result.data);
            }
        });
        
    }, []);

    useEffect(() => {
        setFormData({ ...new CalendarEvent(), ...props.event });
    }, [props]);

    function checkResponse(response: APIResult<any>, showSuccess: boolean): boolean {
        
        switch (response.status) {
            case 200:
                {
                    if(showSuccess){
                        showToast('Event saved successfully.', true);
                    }
                    break;
                }
            default:
                {
                    showToast('Something went wrong. Please try again.', false);
                    return false;
                }
        }

        return true;
    }

    function showToast(message: string, isSuccess: boolean) {
        let toastParms = new ToastParams();

        toastParms.showToast = true;
        toastParms.toastText = message;
        toastParms.variant = isSuccess ? 'primary' : 'danger';
        setToastData(toastParms);
    }

    function getCurrentForm(): HTMLFormElement {
        return formRef.current!;
    }

    function handleChange (e: SyntheticEvent) {
        const field = e.currentTarget as HTMLInputElement;
        const form = getCurrentForm();

        switch (field.id) {
            case 'EventStartDate':
            case 'EventStartTime':
                {
                    const startDate = DateUtils.FormatDateTimeFromParts(form.EventStartDate.value, form.EventStartTime.value);
                    if (DateUtils.IsValidDate(startDate)){
                        setFormData({
                            ...formData,
                            EventStartDateTime: startDate
                        });
                    }
                    break;
                }
            case 'EventEndDate':
            case 'EventEndTime':
                {
                    setFormData({
                        ...formData,
                        EventEndDateTime: DateUtils.FormatDateTimeFromParts(form.EventEndDate.value, form.EventEndTime.value)
                    });
                    break;
                }
            default:
                {
                setFormData({
                    ...formData,
                    [field.id]: field.value
                });
            }
        }
    }
    
    function formIsValid(): boolean {
        let isValid = true;
        let errors = {};
        const form = getCurrentForm();

        if (formData.Title.length === 0) {
            isValid = false;
            errors = { ...errors, Title: true };
        }

        if (formData.EventOwnerID == 0) {
            isValid = false;
            errors = { ...errors, EventOwnerID: true };
        }

        if (!DateUtils.IsValidDate(DateUtils.FormatDateTimeFromParts(form.EventStartDate.value, form.EventStartTime.value))) {
            isValid = false;
            errors = { ...errors, EventStartDateTime: true };
        }

        if (!DateUtils.IsValidDate(DateUtils.FormatDateTimeFromParts(form.EventEndDate.value, form.EventEndTime.value)) 
            || !DateUtils.DateGreaterOrEqual(formData.EventStartDateTime, formData.EventEndDateTime)) {
            isValid = false;
            errors = { ...errors, EventEndDateTime: true };
        }

        if (formData.Description.length === 0) {
            isValid = false;
            errors = { ...errors, Description: true };
        }

        setFormData({ ...formData, Errors: errors });
        return isValid;
    }

    function handleSubmit (e: SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!formIsValid()) {
            return;
        }
        
        setIsSaving(true);

        if (formData.EventID > 0) {
            CalendarEventRepo.EditCalendarEvent(formData).then(result => {
                    handleSaveResponse(result);
                });
        }
        else {
            CalendarEventRepo.AddCalendarEvent(formData).then(result => {
                    handleSaveResponse(result);
                });
        }
    }

    function handleSaveResponse(result: APIResult<any>) {
        // Response is so fast, set a 1 second delay so screen doesn't flash
        setTimeout(() => {
            if (checkResponse(result, true)) {
                // Delay close so the user sees confirmation 
                setTimeout(() => { props.onSave(); props.onClose(); setIsSaving(false); }, toastData.delay);
            }
        }, 500);
    }

    return ( 
        <>
        <Modal show={props.show} onHide={props.onClose} backdrop="static" keyboard={false}>
            <Form ref={formRef} onSubmit={handleSubmit} className="mb-3 text-start text-secondary">
                <Modal.Header closeButton>
                    <Modal.Title>{formData.EventID > 0 ? 'Edit' : 'Add' } Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ToastAlert
                        onClose={() => setToastData(new ToastParams())}
                        showToast={toastData.showToast}
                        toastText={toastData.toastText}
                        variant={toastData.variant}
                        delay={toastData.delay}
                    />
                    {
                    (isSaving && !toastData.showToast) &&
                        <WaitAnimation hover={true} />
                    }
                    <Form.Group controlId="Title" className="ps-3 fw-bold" >
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            value={formData.Title}
                            onChange={handleChange}
                            maxLength={100}
                            isInvalid={formData.Errors.Title}
                        />
                        <Form.Control.Feedback type="invalid">Please enter a title</Form.Control.Feedback> 
                    </Form.Group>
                    <Form.Group controlId="EventOwnerID" className="p-3 fw-bold" >
                        <Form.Label>Organizer</Form.Label>
                        <Form.Select
                            value={formData.EventOwnerID} 
                            onChange={handleChange}
                            isInvalid={formData.Errors.EventOwnerID}
                            required
                        >
                            <option value="0" key="0">Please Select</option>
                            {
                            users.map((u) => {
                                return (<option value={u.UserId} key={u.UserId}>{u.FirstName.concat(' ').concat(u.LastName)}</option>);
                            })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Please select an organizer</Form.Control.Feedback> 
                    </Form.Group>
                    <Form.Group className="ps-3 fw-bold" >
                        <Form.Label>Event Date/Time</Form.Label>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control
                                id="EventStartDate"
                                type="date"
                                defaultValue={DateUtils.FormatDate(props.event?.EventStartDateTime)}
                                onChange={handleChange}
                                isInvalid={formData.Errors.EventStartDateTime}
                            />
                            <Form.Select
                                id="EventStartTime"
                                defaultValue={DateUtils.FormatTime(props.event?.EventStartDateTime)}
                                onChange={handleChange}
                                isInvalid={formData.Errors.EventStartDateTime}
                            >
                                {
                                times.map((t) => {
                                    return (<option value={t.Value} key={t.Value}>{t.Text}</option>);
                                })
                                }
                            </Form.Select>
                        </Stack>
                        {
                            (formData.Errors.EventStartDateTime) &&
                            <div className="text-start">
                                <input type="hidden" className="is-invalid" />
                                <Form.Control.Feedback type="invalid">Start Time must be a valid date/time and earlier than End Time</Form.Control.Feedback>
                            </div>
                        }
                    </Form.Group>
                    <Form.Group className="text-center ps-3 fw-bold" >
                        <Form.Label className="pe-4 pt-2">To</Form.Label>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control
                                id="EventEndDate"
                                type="date"
                                defaultValue={DateUtils.FormatDate(props.event?.EventEndDateTime)}
                                onChange={handleChange}
                                isInvalid={formData.Errors.EventEndDateTime}
                            />
                            <Form.Select
                                id="EventEndTime"
                                defaultValue={DateUtils.FormatTime(props.event?.EventEndDateTime)}
                                onChange={handleChange}
                                isInvalid={formData.Errors.EventEndDateTime}
                            >
                                {
                                    times.map((t) => {
                                        return (<option value={t.Value} key={t.Value}>{t.Text}</option>);
                                    })
                                }
                            </Form.Select>
                        </Stack>
                        {
                        (formData.Errors.EventEndDateTime) &&
                            <div className="text-start">
                                <input type="hidden" className="is-invalid" />
                                <Form.Control.Feedback type="invalid">End Time must be a valid date/time and later than Start Time</Form.Control.Feedback> 
                            </div>
                        }
                    </Form.Group>
                    <Form.Group controlId="Description" className="p-3 fw-bold" >
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Description"
                            rows={5}
                            value={formData.Description}
                            onChange={handleChange}
                            maxLength={500}
                            isInvalid={formData.Errors.Description}
                        />
                        <Form.Control.Feedback type="invalid">Please enter a description</Form.Control.Feedback> 
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose} disabled={isSaving}>Close </Button>
                    <Button variant="primary" type="submit" disabled={isSaving}>Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        </>
    );
}

export default CalendarEventModal;