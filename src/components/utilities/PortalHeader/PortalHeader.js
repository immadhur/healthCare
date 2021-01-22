import React from 'react';
import style from './PortalHeader.module.css'

const PortalHeader = (props) => {
    const sal=props.role=='Doctor'?'Dr.':'Mr.';
    const name=props.name?props.name:localStorage.getItem('username');
    return (
        <>
            <p className={style.title}>{props.role}'s Portal</p>
            <p className={style.name}>Welcome {`${sal} ${name}`}</p>
        </>
    );
}


export default PortalHeader;