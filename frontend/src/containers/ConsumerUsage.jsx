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
            <div className='mt-4'>
      <h1 style={h1color} className='display-4 text-center'>CONSUMER USAGE</h1>
      </div>
            <div className='mt-3 '>
          <div className="d-flex align-items-center justify-content-center">
          <div style={cardStyle} className='card col p-3'>
          <h3 className='display'>Consumer ID: {uid}</h3>

            <button style={buttonStyle} className='btn card col-3' onClick={handleToggleDefaulterStatus} disabled={loading || updateInProgress}>
                {loading ? 'Loading...' : isDefaulter ? 'Remove from Defaulters' : 'Add to Defaulters'}
            </button>

            

            {(isDefaulter && user_role === 'tier2') && (
                <div>
                    <label className='mt-3 display-5 '>Select Tier 3 Officer</label>
                    <div>
                    <select className='mt-2 col-3'
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
                    </div>
                    <button style={buttonStyle} className='mt-3 btn card col-3' onClick={handleAssignRaid}>Assign Raid</button>
                </div>
            )}
            </div>
            </div>
            </div>

            <h3 style={h1color} className='display-5 text-center mt-3'>Hourly Consumption Analysis</h3>
            <div>
            <div className='container-fluid'> 
            <h5 style={h1color} className='display-5 mt-3 col-2 ml-4'>Select Date</h5>
                
                <DatePicker
                    selected={targetDate}
                    onChange={handleDateChange}
                    minDate={new Date('2022-01-01')}
                    maxDate={new Date('2022-12-31')}
                    className='ml-5'
                    showPopperArrow={false}
                    dateFormat="dd-MM-yyyy"
                    calendarIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
                />
                </div>    
                <div className='container-fluid mt-2'>
                <div className='d-flex align-center-items justify-content-center'>
                <div className='card col-11'>
                <GraphComponentHourly consumer_number={uid} target_date={targetDate.toISOString().split('T')[0]} />
                </div>
                </div>
                </div>
            </div>

            <h3 style={h1color} className='display-5 text-center mt-3'>Daily Consumption Analysis</h3>

            <div className='container-fluid mt-2'>
                <div className='d-flex align-center-items justify-content-center'>
                <div className='card col-11 border'>
                <GraphComponentDaily consumer_number={uid} />
            </div>
            </div>
            </div>

            <h3 style={h1color} className='display-5 text-center mt-3'>Weekly Consumption Analysis</h3>
            <div className='container-fluid mt-2'>
                <div className='d-flex align-center-items justify-content-center'>
                <div className='card col-11'>
                <GraphComponentWeekly consumer_number={uid} />
            </div>
            <button onClick={handleGoToViewReport}>View Report</button>
        </div>
    );
};

const cardStyle = {
    backgroundColor: '#96B6C5',
    color: '#eeeeee'
  };

const h1color = {
color: '#116A7B'
};

const buttonStyle = {
backgroundColor: '#1D3E53',
color: '#eeeeee',
fontSize: '1.3rem',
borderRadius: '10px'
};  


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ConsumerUsage);
