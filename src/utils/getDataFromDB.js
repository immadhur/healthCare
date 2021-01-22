const idb = window.indexedDB;

export function getPatientsListFromDB() {
    const tempPatientsArr = []
    return new Promise((res, rej) => {

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
                    res([...tempPatientsArr]);
                }
            };
        };
    });
}

export function getCheckupDataFromDB(id) {
    return new Promise((res, rej) => {

        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('checkupData', "readwrite").objectStore('checkupData');
            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.patientId == id)
                        res(cursor.value)
                    cursor.continue();
                }
                else
                    rej('Not Found!');
            };
        };
    });
}

export async function getPatientFromId(id) {
    let patients = await getPatientsListFromDB();
    return patients.find(p => p.patientId == id);
}

export async function getPatientFromUsername(name) {
    return new Promise((res, rej) => {

        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('patient', "readwrite").objectStore('patient');
            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.username == name) {
                        res(cursor.value.patientId);
                    }
                    cursor.continue();
                }
                else {
                    rej('Not found!');
                }
            };
        };
    });
}

export async function getPatientPharmaDetails(id) {
    return new Promise((res, rej) => {
        let req = idb.open('healthCareDB', 1);
        req.onsuccess = () => {
            const db = req.result;
            const store = db.transaction('billData', "readwrite").objectStore('billData');
            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.patientId == id) {
                        console.log(cursor.value);
                        res(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    rej('Not found!');
                }
            };
        };
    });
}