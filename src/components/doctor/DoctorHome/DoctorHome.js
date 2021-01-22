import React from 'react';
import style from './DoctorHome.module.css';
import {withRouter} from 'react-router-dom';
import PatientsList from '../../PatientsList/PatientsList';
import PortalHeader from '../../utilities/PortalHeader/PortalHeader';

const DoctorHome = (props) => {

    const registerPatientHandler=(e)=>{
        e.preventDefault();
        props.history.push('/register');
    }

    return (
        <div className={style.outer}>
            <PortalHeader role={'Doctor'}/>
            {/* <p className={style.title}>Doctor's Portal</p> */}
            <button onClick={registerPatientHandler} className={style.registerButton}>Register new Patient</button>
            <PatientsList/>
        </div>
    );
}


export default withRouter(DoctorHome);