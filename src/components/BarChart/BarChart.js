import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChart(props) {
    const { taskData, title, color1, color2 } = props;

    let labels = [];
    let dataset1 = [];
    let dataset2 = [];

    for (let i = 0; i < taskData?.length; i++){
        labels.push(taskData[i].name);
        dataset1.push(taskData[i].ease_factor);
        dataset2.push(taskData[i].quality);

    }

    const max1 = Math.max(...dataset1);
    const max2 = Math.max(...dataset2);
    const maxData = Math.max(max1, max2);

    const min1 = Math.min(...dataset1);
    const min2 = Math.min(...dataset2);
    const minData = Math.min(min1, min2);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' 
            },
            title: {
                display: true,
                text: title
            }
        },
        scales: {
            y: {
                min: minData,
                max: maxData,
                stepSize: 0.1
            },
        }
    }
    

    const data = {
        labels,
        datasets: [
            {
                label: 'Ease Factor',
                data: dataset1,
                backgroundColor: color1,
                barThickness: 'flex',
            },
            {
                label: 'Quality',
                data: dataset2,
                backgroundColor: color2,
                barThickness: 'flex',
            }
        ]
    }

    return (
       <Bar options={options} data={data}/>
    )
}
