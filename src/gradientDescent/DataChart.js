import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import { Segment, Label } from 'semantic-ui-react';
import { isEqual } from 'lodash';

HighchartsExporting(Highcharts);

class DataChart extends React.Component {

    constructor() {
        super();
        this.chart = null;
        this.id = 'linearRegression';
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.chart.series[0].update({ data: this.props.data });
        }
        if (prevProps.regressionData !== this.props.regressionData) {
            this.chart.series[1].update({ data: this.props.regressionData });
        }
    }

    addPoint = e => {
        const x = e.xAxis[0].value;
        const y = e.yAxis[0].value;
        const point = [x, y];
        const data = this.props.data.concat([point]);
        this.props.updateData(data);
    }

    removePoint = e => {
        if (e.point.series.userOptions.id !== 'data') return;
        if (this.props.data.length <= 2) return;

        const point = [e.point.x, e.point.y];
        const data = this.props.data.filter(p => !isEqual(p, point));
        this.props.updateData(data);
    }

    componentDidMount() {
        const options = {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                events: {
                    click: this.addPoint
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Click the plot area to add a point. Click a point to remove it.'
            },
            xAxis: {
                enabled: true,
                title: {
                    text: 'x'
                },
                gridLineWidth: 1,
                minPadding: 0.5,
                maxPadding: 0.5
            },
            yAxis: {
                title: {
                    text: 'y'
                },
                minPadding: 0.5,
                maxPadding: 0.5
            },
            exporting: {
                enabled: true
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            'click': this.removePoint
                        }
                    }
                }
            },
            series: [
                { id: 'data', name: 'Data', data: this.props.data },
                {
                    type: 'line',
                    id: 'regression',
                    name: 'Regression Line',
                    data: this.props.regressionData,
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            lineWidth: 0
                        }
                    },
                    enableMouseTracking: false
                }
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
                <Segment>
                    <b>Regression data</b>
                    {this.props.epoch > 0 &&
                        <Label.Group size='medium' style={{ display: 'inline' }}>
                            <Label className='first-label'>epoch: {this.props.epoch}</Label>
                            <Label className='labels'>k: {this.props.k.toFixed(3)}</Label>
                            <Label className='labels'>b: {this.props.b.toFixed(3)}</Label>
                            <Label className='labels'>learning rate: {this.props.lr}</Label>
                        </Label.Group>
                    }
                </Segment>
                <Segment style={{ padding: 0 }}>
                    <div id={this.id} />
                </Segment>
            </Segment.Group>
        );
    }
}

export default DataChart;
