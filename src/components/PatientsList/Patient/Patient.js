import React from 'react';
import style from './Patient.module.css';

const Patient = (props) => {
    const data = props.details;
    return (
        <>
            <div className={style.outer} onClick={() => props.click?props.click(data.patientId):null}>
                {/* <div className={style.first}> */}
                {/* <p>></p> */}
                <p>{data.patientId}</p>
                <p >{data.name}</p>
                {/* </div> */}
                {/* <div className={style.middle}> */}
                <p>{data.age}</p>
                <p>{data.dob}</p>
                <p>{data.gender}</p>
                <p>{data.nationality}</p>
                {/* </div> */}
                {props.edit ?
                    <div className={style.last}>
                        <button onClick={(e) => props.edit(e, data.patientId)} className={style.btn}>Update</button>
                        <button onClick={(e) => props.delete(e, data.patientId)} className={style.btn}>Delete</button>
                    </div> :
                    null
                }
            </div>
        </>
    );
}


export default Patient;