import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import DataChart from './DataChart';
import StatusChart from '../components/StatusChart';
import Controls from './Controls';
import getData from './dataset';
import { gradient } from './gradient';
import { getLinearRegression } from './regression';

const DATASETS = [
    { key: 'setosa', value: 'setosa', text: 'Iris: Setosa sepals' },
    { key: 'versicolor', value: 'versicolor', text: 'Iris: Versicolor sepals' },
    { key: 'virginica', value: 'virginica', text: 'Iris: Virginica sepals' },
    { key: 'empty', value: 'two_points', text: 'Two points' }
];

const LEARNING_RATE = 0.0001;
const GRADIENT_STEP_TIME = 100;
const GRADIENT_STEP = 10;

class GradientDescent extends React.Component {

    constructor() {
        super();
        this.chart = null;
        this.state = {
            data: getData('setosa'),
            dataset: 'setosa',
            regressionData: [],
            errorData: [],
            logs: [],
            training: false,
            epoch: 0,
            k: 0,
            b: 0
        }
    }

    loadDataset = () => this.setState({
        data: getData(this.state.dataset),
        regressionData: [],
        logs: [],
        errorData: [],
        k: 0,
        b: 0,
        epoch: 0
    });

    updateData = data => {
        if (this.state.training) return;
        this.setState({ data: data });
    }

    clearData = () => this.setState({
        regressionData: [],
        logs: [],
        errorData: [],
        k: 0,
        b: 0,
        epoch: 0
    });

    startTraining = () => {
        this.setState({ training: true });
        this.interval = setInterval(() => {
            const { data, k, b, errorData, logs, epoch } = this.state;
            const epochEnd = epoch + GRADIENT_STEP;
            const g = gradient(data, k, b, epoch, epochEnd, LEARNING_RATE);
            this.setState({
                regressionData: getLinearRegression(data, g.k, g.b),
                logs: g.logs.length > 0 ?
                    logs.concat(g.logs) : logs,
                errorData: g.errorData.length > 0 ?
                    errorData.concat(g.errorData) : errorData,
                k: g.k,
                b: g.b,
                epoch: epochEnd
            });
        }, GRADIENT_STEP_TIME);
    }

    stopTraining = () => {
        this.setState({ training: false });
        clearInterval(this.interval);
    }

    render() {
        const { data, regressionData, errorData, logs, training } = this.state;
        return (
            <Container style={{ padding: '5em 0em' }}>
                <Controls
                    datasets={DATASETS}
                    dataset={this.state.dataset}
                    onDatasetChange={(e, { value }) => this.setState({ dataset: value })}
                    loadDataset={this.loadDataset}
                    stopTraining={this.stopTraining}
                    startTraining={this.startTraining}
                    clearData={this.clearData}
                    training={training}
                    epoch={this.state.epoch}
                />
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <DataChart
                                data={data}
                                updateData={this.updateData}
                                regressionData={regressionData}
                                epoch={this.state.epoch}
                                k={this.state.k}
                                b={this.state.b}
                                lr={LEARNING_RATE}
                                training={training}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {logs.length > 0 &&
                            <Grid.Column>
                                <Segment.Group>
                                    <Segment><b>Gradient descent logs</b></Segment>
                                    <Segment style={{ height: 250, overflowY: 'scroll' }}>
                                        {logs.map((log, i) => <div key={i}>{log}</div>)}
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        }
                        {errorData.length > 0 &&
                            <Grid.Column>
                                <StatusChart
                                    title="Error"
                                    trainData={errorData}
                                    yTitle="error"
                                    xTitle="epoch"
                                    updateStep={100}
                                />
                            </Grid.Column>
                        }
                    </Grid.Row>
                </Grid>
            </Container >
        );
    }
}

export default GradientDescent;
