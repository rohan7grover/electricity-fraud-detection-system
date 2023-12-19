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
            <h1>Make Report</h1>
            <h6>Consumer Id: {consumer_id}</h6>
            {submitClicked && !isDefaulter && console.log(error)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Was Fraud Detected?:
                        <input
                            type="radio"
                            name="isDefaulter"
                            value="yes"
                            checked={isDefaulter === true}
                            onChange={() => setIsDefaulter(true)}
                        />
                        Yes
                    </label>
                    <label>
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
                <div>
                    <label>
                        Comment:
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </label>
                </div>
                <div>
                    <input type="file" onChange={handleImageChange} />
                </div>
                <button type="submit">Submit Report</button>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(MakeReport);