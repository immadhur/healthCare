import React, { useState, useEffect } from 'react';
import style from './CheckupDetails.module.css'
import Patient from '../../PatientsList/Patient/Patient';
import PatientsHeader from '../../PatientsList/PatientsHeader';
import { getPatientFromId } from '../../../utils/getDataFromDB';
import MaterialTable from 'material-table';
import { Form, Button, Col } from 'react-bootstrap'

const CheckupDetails = (props) => {
    const id = props.location.pathname.split('/').pop();
    const idb = window.indexedDB;
    const [patientDetails, setPatientDetails] = useState({});
    const [mediData, setMediData] = useState([]);
    const [symptoms, setSymptoms] = useState();
    const [date, setDate] = useState();
    const [prevCheckupData, setPrevCheckupData] = useState([]);
    getPatientFromId(id).then(p => setPatientDetails(p));

    const columns = [
        { title: 'Medicine Name', field: 'name' },
        { title: 'Days', field: 'dose', type: 'numeric' },
        { title: 'Dose/day', field: 'days', type: 'numeric' },
    ];

    useEffect(() => {
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('checkupData', "readwrite").objectStore('checkupData');
            let tempPatientsArr = []
            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.patientId == id)
                        tempPatientsArr.push(cursor.value);
                    cursor.continue();
                }
                else {
                    console.log("Got all data: ", tempPatientsArr[0]?.prescreption);
                    if (tempPatientsArr.length === 0)
                        return;
                    setPrevCheckupData([...tempPatientsArr]);
                    setMediData([...tempPatientsArr[0].prescreption]);
                    setSymptoms(tempPatientsArr[0].symptoms)
                }
            };
        }
    }, [])

    const editTable = {
        onRowAdd: newData => new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                setMediData(prev => {
                    let updated = [...prev];
                    updated.push(newData);
                    return [...updated];
                });
            }, 600);
        }),
        onRowUpdate: (newData, old) => new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                console.log(mediData.indexOf(old))
                setMediData(prev => {
                    let updated = [...prev];
                    updated[updated.indexOf(old)] = newData;
                    return [...updated];
                })
            }, 600);
        }),
        onRowDelete: (data) => new Promise((resolve) => {
            setTimeout(() => {
                console.log(data)
                resolve();
                setMediData(prev => {
                    let updated = [...prev];
                    updated.splice(updated.indexOf(data), 1);
                    return [...updated];
                })
            }, 600);
        })
    }

    const valueChangeHandler = (e, type) => {
        const value = e.target.value;
        if (type === 'date') {
            setDate(value)
        }
        else {
            setSymptoms(value);
        }
    }

    const submitButtonHandler = (e) => {
        e.preventDefault();
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = (e) => {
            const db = req.result;
            const store = db.transaction('checkupData', "readwrite").objectStore('checkupData');

            let req2 = store.put({
                patientId: id,
                symptoms:symptoms.split('\n').join(','),
                date,
                prescreption: mediData
            });

            req2.onsuccess = () => props.history.push('/home')
        }
    }

    return (
        <>
            <PatientsHeader />
            <Patient details={patientDetails} />
            <div >
                <Form validated={true} id={style.main} onSubmit={submitButtonHandler}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Enter Symptoms as described by patient</Form.Label>
                            <Form.Control required as="textarea" rows="3" value={symptoms} onChange={(e) => valueChangeHandler(e, 'area')} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="date">
                            <Form.Label>Next visit Date</Form.Label>
                            <Form.Control required type="date" onChange={(e) => valueChangeHandler(e, 'date')} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row >
                        <Form.Group as={Col} >
                            <MaterialTable id={style.table} title="Prescription"
                                columns={columns} editable={editTable}
                                data={mediData} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Button variant="primary"
                                className={style.submitButton} type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
                <div className={style.history}>
                    <p className={style.previousTitle}>Previous Visit History</p>
                    {prevCheckupData.map(data => (
                        <>
                            <div className={style.historyData}>
                                <p className={style.lbl}>Date: </p>
                                <p>{data.date}</p>
                            </div>
                            <div className={style.historyData}>
                                <p className={style.lbl}>Symptoms: </p>
                                <p>{data.symptoms}</p>
                            </div>
                            <MaterialTable id={style.table} title="Prescription"
                                columns={columns}
                                data={data.prescreption} />
                        </>
                    ))}
                </div>
            </div>
        </>
    );
}


export default CheckupDetails;