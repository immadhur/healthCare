let req = window.indexedDB.open('healthCareDB', 1);

req.onupgradeneeded = (e) => {
    let db = e.target.result;

    let docStore = db.createObjectStore('doctor', { keyPath: 'doctorId' , autoIncrement:true });
    docStore.createIndex('username', 'username', {unique:true})

    let patientStore = db.createObjectStore('patient', { keyPath: 'patientId', autoIncrement:true })
    patientStore.createIndex('username', 'username', {unique:true})
    patientStore.createIndex('isResigtered', 'isResigtered')
    
    let pharmaStore = db.createObjectStore('pharmacist', { keyPath: 'pharmaId' , autoIncrement:true })
    pharmaStore.createIndex('username', 'username', {unique:true})

    let patientDataStore = db.createObjectStore('patientData', {keyPath:'patientId'});
    patientDataStore.createIndex('name', 'name');
    patientDataStore.createIndex('dob', 'dob');
    patientDataStore.createIndex('gender', 'gender');
    patientDataStore.createIndex('age', 'age');
    patientDataStore.createIndex('nationality', 'nationality');

    let checkupDataStore = db.createObjectStore('checkupData', {keyPath:'patientId'});
    checkupDataStore.createIndex('symptoms', 'symptoms');
    checkupDataStore.createIndex('date', 'date');
    checkupDataStore.createIndex('prescription', 'prescription');

    let billStore = db.createObjectStore('billData', {keyPath:'patientId'});
    billStore.createIndex('prescription', 'prescription');
    billStore.createIndex('withoutTax', 'withoutTax');
    billStore.createIndex('total', 'total');


}
