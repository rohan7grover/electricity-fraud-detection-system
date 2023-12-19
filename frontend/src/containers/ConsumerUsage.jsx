import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import GraphComponentWeekly from './GraphWeek';
import GraphComponentDaily from './GraphDaily';
import GraphComponentHourly from './GraphHourly';

const ConsumerUsage = ({ isAuthenticated }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const user_role = searchParams.get('user_role');

    const { uid } = useParams();
    const navigate = useNavigate();

    const [isDefaulter, setIsDefaulter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateInProgress, setUpdateInProgress] = useState(false);

    const [tier3Officers, setTier3Officers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState(null);

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

        const fetchTier3OfficersIfNeeded = async () => {
            if (isDefaulter && user_role === 'tier2') {
                try {
                    const userToken = localStorage.getItem('access');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/get-tier3-officers/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `JWT ${userToken}`,
                        },
                    });
                    const data = await response.json();
                    setTier3Officers(data.tier3_officers);
                } catch (error) {
                    console.error('Error fetching tier3 officers:', error);
                }
            }
        };

        fetchDefaulterStatus();
        fetchTier3OfficersIfNeeded();
    }, [uid, isDefaulter, user_role]);

    if (!isAuthenticated) {
        navigate('/');
    }

    const handleToggleDefaulterStatus = async () => {
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

    const [targetDate, setTargetDate] = useState(new Date('2022-01-01'));

    const handleDateChange = (date) => {
        setTargetDate(date);
    };

    const handleAssignRaid = async () => {
        if (selectedOfficer) {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/assign-raid/${selectedOfficer.id}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${userToken}`,
                    },
                    body: JSON.stringify({ consumer_number: uid }),
                });

                if (response.ok) {
                    console.log('Raid assigned successfully!');
                } else {
                    console.error(`Error assigning raid. Status: ${response.status}`);
                }
                navigate(-1);
            } catch (error) {
                console.error('Error assigning raid:', error);
            }
        } else {
            console.error('No officer selected');
        }
    };

    const handleGoToViewReport = () => {
        navigate(`/view-report/${uid}`);
    };

    return (
        <div>
            <h1>ConsumerUsage</h1>
            <p>Consumer ID: {uid}</p>

            <button onClick={handleToggleDefaulterStatus} disabled={loading || updateInProgress}>
                {loading ? 'Loading...' : isDefaulter ? 'Remove from Defaulters' : 'Add to Defaulters'}
            </button>

            {(isDefaulter && user_role === 'tier2') && (
                <div>
                    <label>Select Tier 3 Officer:</label>
                    <select
                        value={selectedOfficer ? selectedOfficer.id : ''}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            const officer = tier3Officers.find((o) => o.id === selectedId);
                            setSelectedOfficer(officer);
                        }}
                    >
                        <option value="" disabled>
                            Select Officer
                        </option>
                        {tier3Officers.map((officer) => (
                            <option key={officer.id} value={officer.id}>
                                {`${officer.name} (pending raids: ${officer.pending_raids_count})`}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAssignRaid}>Assign Raid</button>
                </div>
            )}

            <h3>Hourly</h3>
            <div>
                <DatePicker
                    selected={targetDate}
                    onChange={handleDateChange}
                    minDate={new Date('2022-01-01')}
                    maxDate={new Date('2022-12-31')}
                    className="custom-datepicker"
                    showPopperArrow={false}
                    dateFormat="dd-MM-yyyy"
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
            <button onClick={handleGoToViewReport}>View Report</button>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ConsumerUsage);
