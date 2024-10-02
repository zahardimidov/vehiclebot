import ru from "date-fns/locale/ru";
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Input.css';

registerLocale("ru", ru);

function Input({ type = null, ...props }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [date, setDate] = useState(new Date());

    if (type == 'date-range') {
        return (
            <DatePicker className='date-range' locale="ru"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                isClearable={true}
                dateFormat="dd/MM/yyyy"
                placeholderText={props.placeholder}

                onChange={update => {
                    if (props.onChange) {
                        props.onChange(update);
                    }
                    setDateRange(update);
                }}
                onFocus={(e) => e.target.readOnly = true}
                withPortal
            />
        );
    };

    if (type == 'date') {
        return (
            <DatePicker name='date' locale="ru"
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText={props.placeholder}

                onFocus={(e) => e.target.readOnly = true}
                withPortal
            />
        )
    }
    else {
        return (<div className='input-wrapper'>
            <input {...props} type={type}></input>
        </div>)
    };
}

export default Input;