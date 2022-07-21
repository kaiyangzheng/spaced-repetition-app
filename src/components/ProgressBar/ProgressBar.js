import { green } from '@mui/material/colors';
import React from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

export default function ProgressBar(props) {
    const { progressVal, maxVal, width, height, text, pathColor } = props;
    return (
        <div style={{width: width, height: height, marginBottom: '10px'}}>
            <CircularProgressbarWithChildren value={progressVal} maxValue={maxVal} styles={{
                path:{
                    stroke: pathColor
                }
            }}>
            <div className="circular-progressbar-text">
                <div className="percentage">
                {Math.round((progressVal/maxVal) * 100 * 100)/100}% 
                </div>
                <div className="text">
                {text}
                </div>
            </div>
            </CircularProgressbarWithChildren>
        </div>
    )
}
