import React from 'react';


const PatientsView = () => {
    const headerRow={
        display: 'grid',
        'grid-template-columns': 'repeat(7, 1fr)',
        'margin': '40px 80px',
        'font-weight': 'bold',
        'text-align': 'center'
    }
    
    return (
        <div>
            <div style={headerRow}>
                {/* <p></p> */}
                <p>Patient ID</p>
                <p>Name</p>
                <p>Age</p>
                <p>DOB</p>
                <p>Gender</p>
                <p>Nationality</p>
                <p></p>
            </div>
        </div>
    );
}


export default PatientsView;