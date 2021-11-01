import React from "react";
import {Bar} from 'react-chartjs-2';

const BarChart = ({name, data, color, labels}) => {
    return (
        <Bar 
        data={{
            labels: labels,
            datasets: [{
                label: name,
                data: data,
                backgroundColor: [
                    `rgba(${color}, 0.2)`,
                ],
                borderColor: [
                    `rgba(${color}, 1)`,
                ],
                borderWidth: 1
            }]
        }} 
        options= {{
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true
                }
            }
        }}
        />
    );
}

export default BarChart;