import React, { useState, useEffect } from 'react';
import style from './Login.module.css';
import { withRouter } from 'react-router-dom';

const Login = (props) => {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [loginTabCssClass, setLoginTabCssClass] = useState(style.tab + ' ' + style.tabActive);
    const [registerTabCssClass, setRegisterTabCssClass] = useState(style.tab);
    const [selectedRole, setSelectedRole] = useState('doctor');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const idb = window.indexedDB;

    useEffect(() => {
        // localStorage.removeItem('currentRole');
    }, []);

    const tabSwitchHandler = (isLogin) => {
        if (isLogin) {
            setIsLoginTab(true);
            setLoginTabCssClass(style.tab + ' ' + style.tabActive);
            setRegisterTabCssClass(style.tab);
        }
        else {
            setIsLoginTab(false);
            setRegisterTabCssClass(style.tab + ' ' + style.tabActive);
            setLoginTabCssClass(style.tab);
        }
    };

    const roleChangeHandler = (e) => {
        setError('');
        let role = e.target.value;
        setSelectedRole(role);
    };

    const upperCase = (str) => {
        return str[0].toUpperCase() + str.slice(1);
    };

    const textChangeHandler = (e, isUsername) => {
        setError('');
        isUsername ?
            setUsername(e.target.value) :
            setPassword(e.target.value);
    };

    const loginClickHandler = (e) => {
        e.preventDefault();
        try {
            setError('');
            let req = idb.open('healthCareDB', 1);
            req.onsuccess = (e) => {
                const db = req.result;
                const store = db.transaction(selectedRole, "readwrite").objectStore(selectedRole);
                let index = store.index("username");
                if (isLoginTab) {
                    index.get(username).onsuccess = (e) => {
                        let cursor = e.target.result;
                        if (!cursor) {
                            setError('Invalid credentials!');
                            console.log('Invalid credentials!');
                            return;
                        }
                        if (cursor.password === password) {
                            props.loginSuccess(selectedRole, username);
                            props.history.push('/home');
                        }
                        else {
                            setError('Invalid credentials!');
                        }
                    };
                }
                else {
                    index.get(username).onsuccess = function (event) {
                        if (event.target.result) {
                            setError('Username already exists!');
                            console.log('Exists!');
                            return;
                        }
                        else {
                            let req2 = store.add({ username, password });
                            req2.onsuccess = () => {
                                localStorage.setItem('currentRole', selectedRole);
                                props.history.push('/home');
                            };
                            setError('');
                            req2.onerror = (e) => {
                                console.log(e);
                                setError('Error in registering ' + upperCase(selectedRole));
                            };
                        }
                    };
                }
            };
        } catch (error) {
            console.log(error);
        }

    };

    const arr = new Array(9);
    arr.fill(0);

    return (
        <div className={style.body}>
            {/* <Navigation /> */}
            <div className={style.pattern}>
                {arr.map((x, i) => i === 2 ?
                    <div key={i} className={style.circle2} style={{ background: 'yellow' }} /> :
                    <div key={i} className={!isLoginTab ? style.circle2 : style.circle} />
                )}
            </div>

            {/* <div className={style.pattern2}>
                {arr.map((x, i) => i == 2 ?
                    <div className={style.circle2} style={{ background: 'yellow' }} /> :
                    <div className={isLoginTab ? style.circle2 : style.circle} />
                )}
            </div> */}
            <form className={style.login_box} onSubmit={loginClickHandler}>
                <p onClick={() => tabSwitchHandler(true)} className={loginTabCssClass}>Login</p>
                <p onClick={() => tabSwitchHandler(false)} className={registerTabCssClass}>Register</p>
                {/* <h1>Login</h1> */}
                <p className={style.formTitle}>{`${upperCase(selectedRole)} ${isLoginTab ? 'Login' : 'Registration'}`}</p>
                <label>You're a (Role)</label>
                <select onChange={roleChangeHandler}>
                    <option value='doctor'>Doctor</option>
                    <option value='patient'>Patient</option>
                    <option value='pharmacist'>Pharmacist</option>
                </select>
                <label>Username</label>
                <input type='text' onChange={(e) => textChangeHandler(e, true)} value={username} />
                <label>Password</label>
                <input type='password' onChange={(e) => textChangeHandler(e, false)} value={password} />
                <p className={style.errorText}>{error}</p>
                <button type='submit' >Login</button>
            </form>
        </div>
    );
};

export default withRouter(Login);
