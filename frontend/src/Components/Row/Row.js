import React, { useState } from 'react';
import './Row.css';

function Row({ row_id, name, date, spending, onRemove }) {
    const [timeoutId, setTimeoutId] = useState(null);

    const handleMouseDown = () => {
        const id = setTimeout(() => {
            if (window.confirm("Удалить запись?")) {
                onRemove();
                console.log('remove')
            }
        }, 1500); // Длительность нажатия в миллисекундах
        setTimeoutId(id);
    };

    const handleMouseUp = () => {
        clearTimeout(timeoutId);
    };

    return (
        <div data-row-id={row_id} className='row'
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            <div style={{ maxWidth: '75%' }}>
                <div className='row-name'>{name}</div>
                <span className='row-date'>{date}</span>
            </div>
            <div>
                <span className='row-spending'>{spending}₽</span>
            </div>
        </div>
    )
}

export default Row;