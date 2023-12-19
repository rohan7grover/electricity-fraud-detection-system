import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const MakeReport = ({ isAuthenticated }) => {
    const { consumer_id } = useParams();
    const [isDefaulter, setIsDefaulter] = useState(null);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [submitClicked, setSubmitClicked] = useState(false);

    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', 'fraud');

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGUR_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            return { img_URL: data.data.url, img_ID: data.data.id };
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitClicked(true);

        if (isDefaulter === null || !comment || !image) {
            setError('All fields are required.');
            return;
        }

        let uploadedImage = null;

        if (image) {
            try {
                uploadedImage = await handleUpload();
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError.message);
                setError('Error uploading image.');
                return;
            }
        }

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/submit-report/${consumer_id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('access')}`,
                },
                body: JSON.stringify({
                    is_defaulter: isDefaulter === true ? 'yes' : 'no',
                    image_id: uploadedImage ? uploadedImage.img_ID : null,
                    comment: comment || null,
                }),
            });

            navigate(-1);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
            <div className='mt-4'>
                <h1 style={h1color} className='display-4 text-center'>MAKE REPORT</h1>
            </div>

            {submitClicked && !isDefaulter && console.log(error)}
            <div className='form-group'>
            <form onSubmit={handleSubmit}>
                
                <div className='container-fluid mt-5 mb-4'>
                <div className="d-flex align-items-center justify-content-center">
                <div style={cardStyle} className='card col-4 p-3'> 
                <div>
                <h3 className='display  text-center'>Consumer ID: {consumer_id}</h3>

                    <h4 className='display mt-3 mb-3'>
                        Was Fraud Detected?
                    </h4>
                    <div>
                    <label class="form-check-label" for="exampleRadios1">
                        <input
                            type="radio"
                            name="isDefaulter"
                            value="yes"
                            checked={isDefaulter === true}
                            onChange={() => setIsDefaulter(true)}
                        />
                        Yes
                    </label></div>
                    <div><label class="form-check-label" for="exampleRadios2">
                        <input
                            type="radio"
                            name="isDefaulter"
                            value="no"
                            checked={isDefaulter === false}
                            onChange={() => setIsDefaulter(false)}
                        />
                        No
                    </label>
                    </div>
                </div>
                <div class="form-group mt-3 mb-2">
                    <label for="formGroupExampleInput2">
                        <h4 className='display'>
                        Comment:
                        </h4>
                    </label>
                    <textarea rows="3" class="col form-control" id="formGroupExampleInput2" value={comment} onChange={(e) => setComment(e.target.value)} 
                    placeholder="Add Comment Here"/>
                </div>
                <div class="form-group mt-3 mb-2">
                    <label for="exampleFormControlFile1">
                        <h4 className='display'>
                        Choose File:
                        </h4>
                    </label>
                    <input type="file" class="form-control-file" id="exampleFormControlFile1" onChange={handleImageChange} />
                </div>
                </div>
                </div>
                </div>
                <div className='container-fluid'>
                <div className='d-flex align-items-center justify-content-center'>
                <button style={buttonStyle} type="submit" class="btn btn-primary mt-3">Submit Report</button>
                </div>
                </div>
            </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});


const cardStyle = {
    borderRadius: '10px',
    backgroundColor: '#96B6C5',
    color: '#eeeeee',
    fontSize: '1.4rem',
};
const h1color = {
    color: '#116A7B'
};
const buttonStyle = {
    backgroundColor: '#1D3E53',
    color: '#eeeeee',
}; 

export default connect(mapStateToProps)(MakeReport);