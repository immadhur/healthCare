import React from 'react';
// import PatientRegistration from '../Doctor/PatientRegistration/PatientRegistration';
import DoctorHome from '../doctor/DoctorHome/DoctorHome';
import style from './Home.module.css';
import PharmaHome from '../pharmacist/PharmaHome/PharmaHome';
import PatientHome from '../patient/PatientHome/PatientHome';

const Home = (props) => {
    const role = localStorage.getItem('currentRole');

    const pageToDisplay = () => {
        switch (role) {
            case 'doctor':
                return <DoctorHome />
            case 'pharmacist':
                return <PharmaHome />

            default:
                return <PatientHome/>
        }
    }


    return (
        <div className={style.pageBody}>
            {pageToDisplay()}
        </div>
    );
}

export default Home;