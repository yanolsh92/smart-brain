import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto' />
                {
                    box.map(function (singlebox, index) {
                        return <div key={index} className='bounding-box' style={{ top: singlebox.topRow, right: singlebox.rightCol, bottom: singlebox.bottomRow, left: singlebox.leftCol }}></div>

                    })
                }
            </div>
        </div>
    );
}

export default FaceRecognition;