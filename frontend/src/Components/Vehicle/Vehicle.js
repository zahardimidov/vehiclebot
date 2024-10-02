import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cardGIF from '../../Assets/gif/card.gif';
import Input from '../Input/Input';
import Layout from '../Layout/Layout';
import Footer from '../Footer/Footer';
import Modal from '../Modal/Modal';
import Row from '../Row/Row';
import './Vehicle.css';

function Vehicle() {
    const [loading, setLoading] = useState(true);
    const [rowModalState, rowModalSetState] = useState(false);

    const [rows, setRows] = useState([]);
    let { state } = useLocation();
    let navigate = useNavigate();

    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.onEvent('backButtonClicked', () => {
        window.Telegram.WebApp.BackButton.hide();
        navigate('/');
    })

    React.useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: state.uuid })
        };
        fetch(process.env.REACT_APP_API_URL + '/rows', requestOptions)
            .then(response => response.json())
            .then(data => {
                setRows(data);
                setLoading(false);
            });
    }, [])

    const addRow = (e) => {
        e.preventDefault();
        console.log(e.form);
        const formData = new FormData(e.target);

        console.log(formData)

        const row = { vehicle_id: state.uuid, name: formData.get('name'), date: formData.get('date'), spending: formData.get('spending') }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row)
        };
        fetch(process.env.REACT_APP_API_URL + '/add_row', requestOptions)
            .then(response => response.json())
            .then(new_row => {
                setRows((prevRows) => [new_row, ...prevRows]);
                rowModalSetState(false);
            });
    }

    function removeRow(row_id) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ row_id: row_id })
        };
        fetch(process.env.REACT_APP_API_URL + '/remove_row', requestOptions)
            .then(response => {
                if (response.status == 200) {
                    console.log(rows);
                    let filteredRows = rows.filter(row => !(row.uuid==row_id));
                    console.log(filteredRows)
                    setRows(filteredRows);
                }
            });
    }

    function filterRows(update) {
        console.log(state.uuid, update);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: state.uuid, range: update })
        };

        fetch(process.env.REACT_APP_API_URL + '/filterRows', requestOptions)
            .then(response => response.json())
            .then(data => {
                setRows(data);
            });
    }

    const sum = rows.reduce((accumulator, currentValue) => accumulator + currentValue.spending, 0);

    return (
        <>
            <Layout gif={cardGIF} loading={loading}>
                <div className='date-range-container'>
                    <Input type='date-range' placeholder='Временной промежуток' onChange={filterRows}></Input>
                </div>

                <h1>{state.name}</h1>

                <div className='rows-container'>
                    <div className='add-row' onClick={() => {
                        rowModalSetState(true);

                        //document.querySelector('.date-range-container input.date-range').value = '';
                        document.querySelector('.input-wrapper input[name="name"]').value = '';
                        document.querySelector('.input-wrapper input[name="spending"]').value = '';
                    }}>
                        <div>+</div>
                        <div>Добавить запись</div>
                    </div>
                    <div className='rows'>
                        {rows.map(row => (
                            <Row row_id={row.uuid} name={row.name} date={row.date} spending={row.spending} onRemove={() => removeRow(row.uuid)}></Row>
                        ))}
                    </div>
                </div>
            </Layout>
            <Footer spending={sum}></Footer>
            <Modal title="Добавить запись" isOpen={rowModalState} onClose={() => rowModalSetState(false)}>
                <div className='content-inner'>
                    <form onSubmit={addRow}>
                        <Input type='date'></Input>
                        <Input name='name' placeholder='Наименование'></Input>
                        <Input name='spending' type='number' placeholder='Стоимость'></Input>

                        <button className='kit-button' type="submit">
                            <div className='label'>Сохранить</div>
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default Vehicle;