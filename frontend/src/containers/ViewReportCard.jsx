import React from 'react';

const ViewReportCard = ({ raid_detail }) => {
    const cardStyle = {
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
    };

    const formatRaidDate = (dateString) => {
        if (dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }
        return 'N/A';
    };

    const img_URL = raid_detail.image_id
        ? `https://i.ibb.co/${raid_detail.image_id}/fraud.png`
        : 'https://via.placeholder.com/150';

    return (
        <div style={cardStyle}>
            <h4>Raid Status: {raid_detail.raid_status === 'pending' ? 'Pending' : 'Completed'}</h4>
            <h4>Tier 3 Officer: {raid_detail.tier3_officer}</h4>
            <h4>Raid Date: {formatRaidDate(raid_detail.raid_date)}</h4>
            <h4>Comment: {raid_detail.comment || 'N/A'}</h4>
            <h4>Is Defaulter: {raid_detail.is_defaulter === 'yes' ? 'YES' : 'NO'}</h4>
            <h4>Image:</h4>
            {raid_detail.image_id ? (
                <img src={img_URL} alt='' style={{ maxWidth: '100%', maxHeight: '200px' }} />
            ) : (
                <img src={img_URL} alt='' style={{ maxWidth: '100%', maxHeight: '200px' }} />
            )}
        </div>
    );
};

export default ViewReportCard;
