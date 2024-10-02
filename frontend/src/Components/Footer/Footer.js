import React from 'react';
import './Footer.css';

function Footer({ spending }) {
    return (
        <footer>
            <div className='spending-container'>
                <div className='all-spending'>Итого: {spending}₽</div>
            </div>
        </footer>
    );
}

export default Footer;