import React, { useEffect, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap'
import style from './PatientRegistration.module.css';
import { withRouter } from 'react-router-dom';

const PatientRegistration = (props) => {
    const isUpdate = props.update;
    const idb = window.indexedDB;
    let data = props.data;
    const initialForm = {
        name: data ? data.name : '',
        age: data ? data.age : '',
        gender: data ? data.gender : 'Male',
        dob: data ? data.dob : '',
        nationality: data ? data.nationality : ''
    }
    const [patientsId, setpatientsId] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState();
    const [error, setError] = useState('');
    const [patientForm, setPatientForm] = useState(initialForm)

    useEffect(() => {
        setPatientForm({...initialForm});
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('patient', "readwrite").objectStore('patient');
            let tempPatientsArr = []
            store.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;
                if (cursor) {
                    console.log(cursor.value.isResigtered)
                    if (isUpdate || !cursor.value.isResigtered)
                        tempPatientsArr.push(cursor.value);
                    cursor.continue();
                }
                else {
                    console.log("Got all patients: ", tempPatientsArr);
                    if (tempPatientsArr.length === 0)
                        return;
                    setPatients([...tempPatientsArr])
                    setSelectedPatientId(data?data.patientId:tempPatientsArr[0].patientId);
                    setpatientsId(tempPatientsArr.map((x) => x.patientId))
                }
            };
        }
    }, [props.data?.patientId])


    const patientSelectionChangeHandler = (e) => {
        const id = e.target.value;
        setSelectedPatientId(id);
        setPatientForm({ ...initialForm });
    }

    const valueChangeHandler = (e, field) => {
        let data = e.target.value;
        let formData = { ...patientForm };
        formData[field] = data;
        setPatientForm({ ...formData })
    }

    const submitButtonHandler = (e) => {
        e.preventDefault();
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = (e) => {
            const db = req.result;
            const store = db.transaction('patientData', "readwrite").objectStore('patientData');
            if(isUpdate){
                let updateReq=
                    store.put({
                        patientId: selectedPatientId,
                        ...patientForm
                    });
                    updateReq.onsuccess=()=>props.closeDialog();
                return;
            }
            let req2 = store.add({
                patientId: selectedPatientId,
                ...patientForm
            });
            req2.onsuccess = () => {
                const storePatient = db.transaction('patient', "readwrite").objectStore('patient');
                let req3 = storePatient.get(selectedPatientId);
                req3.onsuccess = (e) => {
                    let data = e.target.result;
                    console.log('data', data);
                    console.log('sel', selectedPatientId);
                    data.isResigtered = 'true';
                    storePatient.put(data).onsuccess = () => props.history.push('/home');
                }

            }
            setError('');
            req2.onerror = (e) => {
                console.log(e);
                setError('Error in registering patient!');
            }
        }
    }

    return (
        <>
            {patientsId.length === 0 && !isUpdate ?
                <p className={style.title}>No patients registered, Kindly request patients to register from registration tab on Login screen</p>
                :
                <div className={isUpdate?null:style.outer}>
                    {!isUpdate ?
                        <p className={style.title}>Patient Registration Form</p> :
                        null}
                    <Form style={isUpdate?null:{ margin: '50px 100px' }} validated={true} onSubmit={submitButtonHandler}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Patient ID</Form.Label>
                                <Form.Control as="select" disabled={isUpdate} defaultValue={patientsId[0]} onChange={patientSelectionChangeHandler}>
                                    {isUpdate ?
                                        (<option>{data.patientId}</option>) :
                                        patientsId.map(patient =>
                                            (<option key={patient}>{patient}</option>)
                                        )}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Patient Username</Form.Label>
                                <Form.Control type="text" placeholder="Username" disabled
                                    value={patients.filter(x => x.patientId ==
                                        selectedPatientId)[0]?.username} />
                            </Form.Group>
                        </Form.Row>


                        <Form.Group controlId="validationCustom01">
                            <Form.Label>Patient Name</Form.Label>
                            <Form.Control required placeholder="Name" value={patientForm.name}
                                onChange={(e) => valueChangeHandler(e, 'name')} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="date">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control required type="date" value={patientForm.dob}
                                    onChange={(e) => valueChangeHandler(e, 'dob')} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="age">
                                <Form.Label>Age</Form.Label>
                                <Form.Control required type="number" value={patientForm.age}
                                    onChange={(e) => valueChangeHandler(e, 'age')} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>

                            <Form.Group as={Col} controlId="gender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control required as="select" value={patientForm.gender}
                                    onChange={(e) => valueChangeHandler(e, 'gender')}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Others</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} controlId="nation">
                                <Form.Label>Nationality</Form.Label>
                                <Form.Control required value={patientForm.nationality}
                                    onChange={(e) => valueChangeHandler(e, 'nationality')} />
                            </Form.Group>
                        </Form.Row>
                        <p className={style.errorTxt}>{error}</p>
                        <Button variant="primary"
                            className={style.submitButton} type="submit">
                            Submit
                </Button>
                    </Form>
                </div>
            }
        </>
    );
}


export default withRouter(PatientRegistration);