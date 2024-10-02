import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import carGIF from '../../Assets/gif/car-min.gif';
import Layout from '../Layout/Layout';
import './Home.css';

function Home() {
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    let navigate = useNavigate();

    window.Telegram.WebApp.expand();

    React.useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(process.env.REACT_APP_API_URL + '/vehicles', requestOptions)
            .then(response => response.json())
            .then(data => {
                setVehicles(data);
                setLoading(false);
            });
    }, [])

    return (
        <>
            <Layout gif={carGIF} loading={loading}>
                <h1>Выбери машину</h1>

                <ul className='vehicle-list'>
                    {vehicles.map(vehicle => (
                        <li className='vehicle' onClick={() => navigate('/vehicle', { state: vehicle })}>
                            <div className='vehicle-name'>{vehicle.name}</div>
                        </li>
                    ))}
                </ul>
            </Layout>
        </>
    );
}

export default Home;