import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { Container, Col, Row, Button, Form, Table } from 'react-bootstrap'
import { Pencil, Trash3, PlusLg } from 'react-bootstrap-icons'
import { PageTitle, ToastAlert, ToastParams, WaitAnimation } from '../Common/Components'
import CalendarEventModal from '../Components/CalendarEventModal'
import { CalendarEventRepo, UserRepo } from '../Repository/Repo'
import { DateUtils, LocalStorageUtils } from '../Common/Utils'
import { APIResult, CalendarEvent, CalendarSearchParams, User } from '../Common/Models'
import { Constants } from '../Common/Constants'


const SearchPage = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const currentUser = LocalStorageUtils.GetItem(Constants.CurrentUser);
    const [users, setUsers] = useState<User[]>([]);
    const [calendarEvents, setEvents] = useState<CalendarEvent[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<CalendarEvent>();
    const [formData, setFormData] = useState<CalendarSearchParams>(new CalendarSearchParams());
    const [errorData, setErrorData] = useState(new ToastParams());
    const [isCallingAPI, setIsCallingAPI] = useState(false);

    useEffect(() => {
        setIsCallingAPI(true);

        UserRepo.GetUsers()
            .then(result => {
                if (!showError(result)) {
                    setUsers(result.data);
                }
                setFormData({ ...formData, EventOwnerID: currentUser?.UserId })
            })
            .finally(() => {
                setTimeout(() => { setIsCallingAPI(false);}, 250);
            });
        
    }, []);

    function showError(response: APIResult<any>) {
        let toastParms = new ToastParams();

        switch (response.status) {
            case 200:
                {
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

    function getCurrentForm(): HTMLFormElement {
        return formRef.current!;
    }

    function formIsValid(): boolean {
        const isValid = DateUtils.DateGreaterOrEqual(formData.StartDateTime, formData.EndDateTime);
        setFormData({ ...formData, Errors: {...formData.Errors, EndDateTime: !isValid} });
        return isValid;
    }
    
    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!formIsValid()) {
            return;
        }

        Search();
    }

    function handleChange (e: SyntheticEvent) {
        const field = e.currentTarget as HTMLInputElement;
        setFormData({
            ...formData!,
            [field.id]: field.value
        });
    }

    function resetForm(e: SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();

        getCurrentForm().reset();
        setFormData(new CalendarSearchParams());
    }
    
    function handleDelete(e: SyntheticEvent, evt: CalendarEvent) {
        e.preventDefault();
        e.stopPropagation();

        if(confirm('Are you sure you want to delete "'.concat(evt.Title).concat('"?'))){
            DeleteEvent(evt.EventID!);
        }
    }

    function handleEdit(e: SyntheticEvent, evt: CalendarEvent) {
        e.preventDefault();
        e.stopPropagation();

        EditEvent(evt);
    }

    function handleAddNew(e: SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation();

        AddNewEvent();
    }

    function handleModalSave() {
        closeEventModal();
        Search();
    }

    function closeEventModal(): void {
        setShowModal(false);
    }
    
    function Search() {
        setIsCallingAPI(true);

        CalendarEventRepo.SearchCalendar(formData!)
            .then(results => {
                if (!showError(results)) {
                    setEvents(results.data);
                }
            })
            .finally(() => {
                setTimeout(() => { setIsCallingAPI(false); }, 250);
            });
    }

    function EditEvent(evt: CalendarEvent) {
        setEventToEdit(evt);
        setShowModal(true);
    }

    function AddNewEvent() {
        setEventToEdit(new CalendarEvent());
        setShowModal(true);
    }

    function DeleteEvent(eventId: number) {
        setIsCallingAPI(true);

        CalendarEventRepo.DeleteCalendarEvent(eventId)
            .then(result => {
                if (!showError(result)) {
                    Search();
                }
            })
            .finally(() => {
                setTimeout(() => { setIsCallingAPI(false); }, 250);
            });
    }
    
    return (
        <Container fluid>
            <ToastAlert
                onClose={() => setErrorData(new ToastParams())}
                showToast={errorData.showToast}
                toastText={errorData.toastText}
                variant={errorData.variant}
                delay={errorData.delay}
            />
            <Row className="justify-content-md-center" >
                <Col>
                    <PageTitle titleText="Search Calendar Events" />
                </Col>
            </Row>
            <Form ref={formRef} onSubmit={handleSubmit} className="mb-3 text-start text-secondary">
            <Row className="justify-content-md-center">
                <Col lg="3">
                    <Form.Group controlId="EventOwnerID" className="p-3 fw-bold"  >
                        <Form.Label>User</Form.Label>
                            <Form.Select value={formData.EventOwnerID} onChange={handleChange}>
                            <option value="0" key="0">Please Select</option>
                            {
                                users.map((u) => {
                                    return (<option
                                        value={u.UserId}
                                        key={u.UserId}
                                        >{u.FirstName.concat(' ').concat(u.LastName)}</option>);
                                })
                            }
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col lg="3">
                    <Form.Group controlId="Title" className=" p-3 fw-bold" >
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Title" maxLength={100} value={formData.Title} onChange={handleChange} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg="3">
                    <Form.Group controlId="StartDateTime" className="p-3 fw-bold" >
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" value={formData.StartDateTime} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col lg="3">
                    <Form.Group controlId="EndDateTime" className="p-3 fw-bold" >
                        <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={handleChange}
                                isInvalid={formData.Errors.EndDateTime}
                                value={formData.EndDateTime}
                            />
                        <Form.Control.Feedback type="invalid">End Date must be later than Start Date</Form.Control.Feedback>    
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-md-center pb-5">
                <Col lg="6">
                    <div className="text-end">
                        <Button variant="secondary" className="me-2" onClick={resetForm}>
                            Reset
                        </Button>
                        <Button variant="primary" className="me-2" type="submit">
                            Search
                        </Button>
                    </div>
                </Col>
            </Row>
            </Form>
            <Row className="justify-content-md-center">
                <Col>
                    {
                    (isCallingAPI)
                        ? <WaitAnimation hover={false} className="mb-2" />
                        : <h2 className="fw-bold">Search Results</h2>
                    }
                </Col>
            </Row>
            <Row className="justify-content-md-center ">
                <Col lg="12">
                    <CalendarEventModal show={showModal} event={eventToEdit!} onClose={closeEventModal} onSave={handleModalSave} />
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th className="width-5">
                                    <Button
                                        onClick={handleAddNew}
                                        variant="primary"
                                        size="sm"
                                        className="p-1 pt-0"
                                    >
                                        <PlusLg title="Add New Event" size="18" />
                                    </Button>
                                </th>
                                <th className="width-5">{' '}</th>
                                <th className="width-15">Organizer</th>
                                <th className="width-15">Event Date/Time</th>
                                <th className="width-20">Title</th>
                                <th className="width-40">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                calendarEvents.map(ce => {
                                    return (
                                        <tr key={ce.EventID} className="text-start">
                                            <td
                                                onClick={(event) => handleEdit(event, ce)}
                                                className="text-center  cursor-hand"
                                            >
                                                <Pencil title="Edit Event" size="18" />
                                            </td>
                                            <td
                                                onClick={(event) => handleDelete(event, ce)}
                                                className="text-center cursor-hand"
                                            >
                                                <Trash3 title="Delete Event" size="18" />
                                            </td>
                                            <td>{ce.EventOwnerFirstName?.concat(' ').concat(ce.EventOwnerLastName!)}</td>
                                            <td>{new Date(ce.EventStartDateTime).toLocaleString()}</td>
                                            <td>{ce.Title}</td>
                                            <td><div>{ce.Description.substring(0, 75).trim().concat(ce.Description.length > 75 ? '...' : '')}</div></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );

}

export default SearchPage;