import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import GraphComponentWeekly from './GraphWeek';
import GraphComponentDaily from './GraphDaily';
import GraphComponentHourly from './GraphHourly';

const ConsumerUsage = ({ isAuthenticated }) => {
    const { uid } = useParams();
    const navigate = useNavigate();

    const [isDefaulter, setIsDefaulter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateInProgress, setUpdateInProgress] = useState(false);

    useEffect(() => {
        const fetchDefaulterStatus = async () => {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-fraud-status/${uid}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${userToken}`,
                    },
                });
                const data = await response.json();
                setIsDefaulter(data.fraud_status.fraud_status);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching defaulter status:', error);
            }
        };

        fetchDefaulterStatus();
    }, [uid]);

    if (!isAuthenticated) {
        navigate('/');
    }

    const handleToggleDefaulterStatus = async () => {
        
        //also write code to delete all PENDING RAIDS FOR THAT CONSUMER ID IN RAID_STATUS TABLE

        try {
            if (updateInProgress) {
                return;
            }

            setUpdateInProgress(true);

            const updatedStatus = !isDefaulter;
            const userToken = localStorage.getItem('access');
            const dataToUpdate = {
                fraud_status: updatedStatus,
            };
            const response = await fetch(`${process.env.REACT_APP_API_URL}/update-fraud-status/${uid}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${userToken}`,
                },
                body: JSON.stringify(dataToUpdate),
            });
            const data = await response.json();
            setIsDefaulter(data.fraud_status.fraud_status);
            navigate(-1);
        } catch (error) {
            console.error('Error updating defaulter status:', error);
        } finally {
            setUpdateInProgress(false);
        }
    };

    const [targetDate, setTargetDate] = useState(new Date('2022-01-01')); // Initialize with the current date

    const handleDateChange = (date) => {
        setTargetDate(date);
    };

    return (
        <div>
            <h1>ConsumerUsage</h1>
            <p>Consumer ID: {uid}</p>

            <button onClick={handleToggleDefaulterStatus} disabled={loading || updateInProgress}>
                {loading ? 'Loading...' : isDefaulter ? 'Remove from Defaulters' : 'Add to Defaulters'}
            </button>

            <h3>Hourly</h3>
            <div>
                <DatePicker
                selected={targetDate}
                onChange={handleDateChange}
                minDate={new Date('2022-01-01')}
                maxDate={new Date('2022-12-31')}
                className="custom-datepicker"
                showPopperArrow={false}
                dateFormat="dd-MM-yyyy" // Specify the date format to enforce
                calendarIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
                />
                <GraphComponentHourly consumer_number={uid} target_date={targetDate.toISOString().split('T')[0]} />
            </div>

            <h3>Daily</h3>
            <div>
                <GraphComponentDaily consumer_number={uid} />
            </div>

            <h3>Weekly</h3>
            <div>
                <GraphComponentWeekly consumer_number={uid} />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ConsumerUsage);
