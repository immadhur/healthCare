import React, { useState, useEffect } from 'react';
import Patient from './Patient/Patient';
import style from './PatientsList.module.css';
import { useHistory } from 'react-router-dom';
import DialogBox from '../utilities/DialogBoxModel/DialogBox';
import PatientRegistration from '../doctor/PatientRegistration/PatientRegistration';
import CheckupDetails from '../doctor/CheckupDetails/CheckupDetails';
import PatientsHeader from './PatientsHeader';

const PatientsList = (props) => {

    const idb = window.indexedDB;
    const [patients, setPatients] = useState([]);
    const [tempPatients, setTempPatients] = useState([]);
    const [currPatient, setCurrPatient] = useState({});
    const [updateDialog, setUpdateDialog] = useState(false);
    const [patientClicked, setPatientClicked] = useState(false);
    const tempPatientsArr = [];
    const history = useHistory();

    useEffect(() => {
        getPatientsListFromDB();
    }, [])

    function getPatientsListFromDB() {
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('patientData', "readwrite").objectStore('patientData');
            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    tempPatientsArr.push(cursor.value);
                    cursor.continue();
                }
                else {
                    console.log("Got all patients: ", tempPatientsArr);
                    setPatients([...tempPatientsArr]);
                    setTempPatients([...tempPatientsArr]);
                }
            };
        };
    }

    const updatePatientHandler = (e, id) => {
        let data = tempPatients.filter(p => p.patientId == id)[0];
        setCurrPatient({ ...data });
        setUpdateDialog(true);
        // console.log(e);
        e.stopPropagation();
    }

    const deletePatientHandler = (e, id) => {
        e.stopPropagation();
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            let store = db.transaction('patientData', "readwrite").objectStore('patientData');
            store.delete(id).onsuccess = x => console.log('Deleted!');
            store = db.transaction('patient', "readwrite").objectStore('patient');
            store.delete(id).onsuccess = x => console.log('Deleted!');
            getPatientsListFromDB();
        }
    }

    const searchtextHandler = (e) => {
        let txt = e.target.value;
        let tempArr = tempPatients.filter(p => {
            return p.name.toLowerCase().includes(txt) || p.patientId == txt;
        });
        console.log(tempArr);
        setPatients([...tempArr]);
    }

    const closeUpdateDialogHandler = () => {
        setUpdateDialog(false);
        getPatientsListFromDB();
    }

    const patientClickHandler = (id) => {
        let data = tempPatients.filter(p => p.patientId == id)[0];
        setCurrPatient({...data});
        setPatientClicked(true);
        history.push(`/home/${id}`);
    }

    const patientsView = () => {
        return (
            <div>
                <input className={style.searchBox} onChange={searchtextHandler} type='text' placeholder='Search patient' />
                <PatientsHeader/>
                {patients.map(p => <Patient key={p.patientId} details={p}
                    edit={updatePatientHandler} delete={deletePatientHandler} click={patientClickHandler} />)}
            </div>
        )
    }

    return (
        <div>
            {/* <p>Patients</p> */}
            <DialogBox show={updateDialog} close={closeUpdateDialogHandler}>
                <PatientRegistration update={true} data={currPatient} closeDialog={closeUpdateDialogHandler} />
            </DialogBox>
            {
                patientClicked ?
                    <CheckupDetails details={currPatient} /> :
                    patients.length>0?
                    patientsView():
                    <p className={style.noPatient}>Click on the Register new patient button to register a Patient.</p>
            }
        </div>
    );
}

export default PatientsList;
