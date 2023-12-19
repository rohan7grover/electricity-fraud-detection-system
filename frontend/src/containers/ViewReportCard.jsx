import React from 'react';

const ViewReportCard = ({ raid_detail }) => {
    const cardStyle = {
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px',
        borderRadius: '10px',
        backgroundColor: '#96B6C5',
        color: '#eeeeee'
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
            <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-center">
            <div style={cardStyle} className="card mb-3 col-8">
              <div className="row no-gutters">
                <div className="col-md-8">
                  <div className="card-body">
                    <h4 className='display'>Raid Status: {raid_detail.raid_status === 'pending' ? 'Pending' : 'Completed'}</h4>
                    <h4 className='display'> Tier 3 Officer: {raid_detail.tier3_officer}</h4>
                    <h4 className='display'>Raid Date: {formatRaidDate(raid_detail.raid_date)}</h4>
                    <h4 className='display'>Comment: {raid_detail.comment || 'N/A'}</h4>
                    <h4 className='display'>Is Defaulter: {raid_detail.is_defaulter === 'yes' ? 'YES' : 'NO'}</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <img src={img_URL} alt='' style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>
            </div>
            </div>
          );
};

export default ViewReportCard;
