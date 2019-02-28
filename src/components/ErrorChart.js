import React from 'react';
import Highcharts from 'highcharts';
import { Segment } from 'semantic-ui-react';

const UPDATE_STEP = 100;

class ErrorChart extends React.Component {

    constructor() {
        super();
        this.chart = null;
        this.id = 'errorChart';
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data && (this.props.data.length % UPDATE_STEP === 0)) {
            this.chart.series[0].update({ data: this.props.data });
        }
    }

    componentDidMount() {
        const options = {
            chart: {
                type: 'line',
                height: 250,
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: {
                enabled: true,
                title: {
                    text: 'iteration'
                }
            },
            yAxis: {
                title: {
                    text: 'error'
                },
                minPadding: 0,
                maxPadding: 0
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    lineWidth: 1
                }
            },
            series: [
                { id: 'data', name: 'Data', data: this.props.data }
            ]
        };
        this.chart = new Highcharts.chart(this.id, options);
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    render() {
        return (
            <Segment.Group>
                <Segment><b>Error data</b></Segment>
                <Segment style={{ padding: 0 }}>
                    <div id={this.id} />
                </Segment>
            </Segment.Group>
        );
    }

}

export default ErrorChart;
