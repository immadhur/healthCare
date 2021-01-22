import React, { useState, useEffect } from 'react';
import style from './PatientHome.module.css';
import PortalHeader from '../../utilities/PortalHeader/PortalHeader';
import { getPatientFromUsername, getCheckupDataFromDB } from '../../../utils/getDataFromDB'
import MaterialTable from 'material-table';

const PatientHome = (props) => {

    const [id, setId] = useState();
    const [nextDate, setNextDate] = useState();
    const [prescreption, setPrescreption] = useState([]);

    const columns = [
        { title: 'Medicine Name', field: 'name' },
        { title: 'Days', field: 'dose', type: 'numeric' },
        { title: 'Dose/day', field: 'days', type: 'numeric' },
    ];

    useEffect(() => {
        getPatientFromUsername(localStorage.getItem('username')).then(id => {
            setId(id);
            getCheckupDataFromDB(id).then(data => {
                setNextDate(data.date);
                setPrescreption(data.prescreption);
            });
        })
    })

    return (
        <div>
            <PortalHeader role='Patient' />
            <div className={style.main}>
                <marquee>
                    {nextDate ?
                        <>
                            <span>Your next visit is scheduled on </span>
                            <span>{nextDate}</span>
                        </> :
                        <span>You dont have any scheduled visit!</span>
                    }
                </marquee>
                <MaterialTable columns={columns} data={prescreption} title="Prescription" />
            </div>
        </div>
    );
}


export default PatientHome;