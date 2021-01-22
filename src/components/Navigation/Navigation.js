import React from 'react';
import style from './Navigation.module.css';

const Navigation = (props) => {
    return (
        <div className={style.nav}>
            <h2>Medidata HealthCare</h2>
            {props.isLoggedIn?
            <p onClick={props.logout}>Logout</p>:
            null
        }
        </div>
    );
}

export default Navigation;