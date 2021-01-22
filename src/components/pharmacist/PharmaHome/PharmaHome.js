import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'
import { getPatientsListFromDB, getPatientPharmaDetails, getCheckupDataFromDB } from '../../../utils/getDataFromDB';
import Patient from '../../PatientsList/Patient/Patient';
import PatientsHeader from '../../PatientsList/PatientsHeader';
import PortalHeader from '../../utilities/PortalHeader/PortalHeader';
import PrescreptionTable from '../PrescreptionTable';
import style from './PharmaHome.module.css';
import MaterialTable from 'material-table';

const PharmaHome = (props) => {

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState({});
    const [pharmaData, setPharmaData] = useState({});
    const [prescreption, setPrescreption] = useState([]);
    const [qty, setQty] = useState([]);
    const [price, setPrice] = useState([]);
    const [billingTable, setBillingTable] = useState([])

    const columns = [
        { title: 'Medicine Name', field: 'name' },
        { title: 'Quantity prescribed', field: 'qty' },
        { title: 'Quantity given', field: 'qtyGiven' },
        { title: 'Price/Tablet', field: 'price' },
    ];

    useEffect(() => {
        getPatientsListFromDB().then(p => {
            if (p.length === 0)
                return;
            console.log('ppp', p);
            setPatients([...p]);
            setSelectedPatient({ ...p[0] });
            getPatientPharmaDetails(p[0].patientId).then(bill => setPharmaData({ ...bill }));
            getCheckupDataFromDB(p[0].patientId).then(pres => {
                const prescreption = [...pres.prescreption]
                setPrescreption(prescreption);
                setBillingTable(prescreption.map(p => {
                    return {
                        name: p.name,
                        qty: p.days * p.dose,
                        qtyGiven: 0,
                        price: 0
                    }

                }))
            });
        })
    }, [])

    const patientSelectionChangeHandler = (e) => {
        const id = e.target.value;
        const patient = patients.find(p => p.patientId == id);
        setSelectedPatient({ ...patient });
        getPatientPharmaDetails(id)
            .then(bill => setPharmaData({ ...bill }))
            .catch(() => setPharmaData({}));
        getCheckupDataFromDB(id).then(pres => {
            const prescreption = [...pres.prescreption]
            setPrescreption(prescreption);
            setBillingTable(prescreption.map(p => {
                return {
                    name: p.name,
                    qty: p.days * p.dose,
                    qtyGiven: 0,
                    price: 0
                }

            }))
        })
            .catch(() => {
                console.log();
                setBillingTable([]);
            });
        setQty([]);
        setPrice([]);
        // getCheckupDataFromDB(id).then(pres => setPrescreption([...pres.prescription]));
    }

    function subtotal() {
        let sum = 0;
        price.forEach((price, i) => sum += (price * qty[i]));
        return sum;
    }

    const generateBillHandler = (e) => {
        e.preventDefault();
        const req = window.indexedDB.open('healthCareDB', 1);
        const amount = subtotal();
        const obj = {
            patientId: selectedPatient.patientId,
            prescription: billingTable,
            withouTax: amount,
            total: amount + amount * 0.05
        };
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('billData', "readwrite").objectStore('billData');
            let req2 = store.add(obj);
            req2.onsuccess = () => setPharmaData({ ...obj });
            req2.onerror = (e) => console.log('errror', e);
        };
    }

    const textChangeHandler = (e, i, type) => {
        const val = e.target.value;
        if (type === 'qty') {
            setQty(prev => {
                let arr = [...prev];
                arr[i] = val;
                return arr;
            });
            setBillingTable(prev => {
                const arr = [...prev];
                arr[i].qtyGiven = val;
                return arr;
            })
        }
        else {
            setPrice(prev => {
                let arr = [...prev];
                arr[i] = val;
                return arr;
            });
            setBillingTable(prev => {
                const arr = [...prev];
                arr[i].price = val;
                return arr;
            })
        }
    }

    return (
        <>
            <PortalHeader role='Pharmacist' />
            <div className={style.outer}>
                <Form.Group controlId="formGridState" className={style.patientId}>
                    <Form.Label>Select Patient ID</Form.Label>
                    <Form.Control as="select" defaultValue={patients[0]?.patientId} onChange={patientSelectionChangeHandler}>
                        {
                            patients.map(patient =>
                                (<option key={patient}>{patient.patientId}</option>)
                            )}
                    </Form.Control>
                </Form.Group>
                <PatientsHeader />
                <Patient details={selectedPatient} />

                <div className={style.billing}>
                    {pharmaData.total ?
                        <>
                            <MaterialTable data={pharmaData.prescription} columns={columns} title='Billing Details' />
                            <div className={style.totalTable}>
                                <p>Subtotal :</p>
                                <p>{pharmaData.withouTax}/-</p>
                                <p>GST :</p>
                                <p>5%</p>
                                <p>Total :</p>
                                <p>{pharmaData.total}/-</p>
                            </div>
                        </> :
                        <>
                            {billingTable.length > 0 ?
                                <>
                                    <PrescreptionTable pres={billingTable} change={textChangeHandler} qty={qty} price={price} />
                                    <div className={style.submitButton} >
                                        <Button variant="primary" type="submit" onClick={generateBillHandler}>
                                            Generate Bill
                            </Button>
                                    </div>
                                </> :
                                <h2>No Prescription Found!</h2>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
}


export default PharmaHome;