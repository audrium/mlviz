import React from 'react';
import { Container, Grid, Button, Item, Segment } from 'semantic-ui-react';
import { IMAGE_H, IMAGE_W, NUM_TRAIN_ELEMENTS, MnistData } from './dataset';
import { getModel } from './model';
import CanvasDraw from "react-canvas-draw";
import StatusChart from '../components/StatusChart';
import Controls from './Controls';
import Accordion from './Accordion';
import * as tf from '@tensorflow/tfjs';

class Mnist extends React.Component {

    constructor() {
        super();
        this.state = {
            datasetLoaded: false,
            datasetLoading: false,
            training: false,
            trained: false,
            status: null,
            errorData: [],
            errorValData: [],
            accData: [],
            accValData: [],
            prediction: null,
            predictionScore: null
        }
        this.predCanvas = React.createRef();
    }

    loadDataset = async () => {
        this.setState({ datasetLoading: true });
        this.data = new MnistData();
        await this.data.load();
        this.setState({ datasetLoaded: true, datasetLoading: false });
    }

    train = async () => {
        this.setState({ training: true, status: 'Training model...' });
        this.model = getModel();

        const batchSize = 550;
        const validationSplit = 0.15;
        const trainEpochs = 3;

        const trainData = this.data.getTrainData();
        const testData = this.data.getTestData();

        const totalBatches = Math.ceil(NUM_TRAIN_ELEMENTS * (1 - validationSplit) / batchSize) * trainEpochs;
        let currentBatch = 0;

        await this.model.fit(trainData.xs, trainData.labels, {
            batchSize,
            validationSplit,
            epochs: trainEpochs,
            callbacks: {
                onBatchEnd: async (batch, logs) => {
                    currentBatch++;
                    this.setState({
                        status: `Training... (` +
                            `${(currentBatch / totalBatches * 100).toFixed(1)}%` +
                            ` complete). To stop training, refresh or close page.`,
                        errorData: this.state.errorData.concat(logs.loss),
                        accData: this.state.accData.concat(logs.acc)
                    });
                    await tf.nextFrame();
                },
                onEpochEnd: async (epoch, logs) => {
                    this.setState({
                        errorValData: this.state.errorValData.concat([[currentBatch, logs.val_loss]]),
                        accValData: this.state.accValData.concat([[currentBatch, logs.val_acc]])
                    });
                    await tf.nextFrame();
                }
            }
        });

        const testResult = this.model.evaluate(testData.xs, testData.labels);
        const testAccPercent = testResult[1].dataSync()[0] * 100;

        this.setState({
            trained: true,
            status: `Final test accuracy: ${testAccPercent.toFixed(1)}%`
        });
    }

    getImageData = () => {
        const contxt = this.predCanvas.current.getContext('2d');
        contxt.clearRect(0, 0, IMAGE_W, IMAGE_H);
        contxt.drawImage(this.drawCanvas.canvas.drawing, 0, 0, IMAGE_W, IMAGE_H);
        const imgData = contxt.getImageData(0, 0, IMAGE_W, IMAGE_H);

        let img = tf.browser.fromPixels(imgData, 1)
        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, 'float32');
        return img.div(tf.scalar(255));
    }

    predict = async () => {
        await tf.tidy(() => {
            const imgData = this.getImageData()
            const outputObj = this.model.predict(imgData).dataSync();
            const output = Array.from(outputObj);

            const prediction = output.indexOf(Math.max(...output));
            const predictionScore = output[prediction] * 100;

            console.log(output);
            console.log(prediction);
            console.log(predictionScore);

            this.setState({ prediction: prediction, predictionScore: predictionScore.toFixed(1) });
        });
    }

    clear = () => {
        this.drawCanvas.clear();
        const contxt = this.predCanvas.current.getContext('2d');
        contxt.clearRect(0, 0, IMAGE_W, IMAGE_H);
        this.setState({ prediction: null, predictionScore: null });
    }

    render() {
        const { errorData, accData, prediction } = this.state;
        return (
            <Container style={{ padding: '5em 0em' }}>
                <Accordion />

                <Controls
                    datasetLoaded={this.state.datasetLoaded}
                    datasetLoading={this.state.datasetLoading}
                    loadDataset={this.loadDataset}
                    train={this.train}
                    training={this.state.training}
                    status={this.state.status}
                />

                <Grid columns={2}>
                    <Grid.Row>
                        {errorData.length > 0 &&
                            <Grid.Column>
                                <StatusChart
                                    title="Error"
                                    trainData={errorData}
                                    valData={this.state.errorValData}
                                    yTitle="error"
                                />
                            </Grid.Column>
                        }
                        {accData.length > 0 &&
                            <Grid.Column>
                                <StatusChart
                                    title="Accuracy"
                                    trainData={accData}
                                    valData={this.state.accValData}
                                    yTitle="accuracy"
                                />
                            </Grid.Column>
                        }
                    </Grid.Row>
                    {this.state.trained &&
                        <Grid.Row>
                            <Grid.Column>
                                <Segment.Group>
                                    <Segment>
                                        <b>Draw</b>
                                        <span style={{ display: 'inline', float: 'right', verticalAlign: 'top' }}>
                                            <Button compact
                                                content='Clear'
                                                onClick={this.clear}
                                                size='mini'
                                            />
                                            <Button compact positive
                                                content={'Predict'}
                                                onClick={this.predict}
                                                size='mini'
                                            />
                                        </span>
                                    </Segment>
                                    <Segment style={{ padding: 0 }}>
                                        <CanvasDraw
                                            ref={canvasDraw => (this.drawCanvas = canvasDraw)}
                                            lazyRadius={0}
                                            brushRadius={40}
                                            canvasWidth={"100%"}
                                            canvasHeight={540}
                                        />
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment.Group>
                                    <Segment><b>Prediction</b></Segment>
                                    <Segment style={{ height: 540 }}>
                                        <Item.Group>
                                            <Item>
                                                <Item.Content verticalAlign='top'>
                                                    <Item.Header className='item-header'>{
                                                        prediction !== null
                                                            ? "Neural network input (28 x 28 pixels):"
                                                            : "Draw any number and press 'Predict'."
                                                    }
                                                    </Item.Header>
                                                    <canvas ref={this.predCanvas} width={28} height={28} />
                                                </Item.Content>
                                            </Item>
                                            {prediction !== null &&
                                                <Item>
                                                    <Item.Content verticalAlign='middle'>
                                                        <Item.Header className='item-header'>
                                                            Prediction: {prediction}
                                                        </Item.Header>
                                                    </Item.Content>
                                                </Item>
                                            }
                                            {prediction !== null &&
                                                <Item>
                                                    <Item.Content verticalAlign='middle'>
                                                        <Item.Header className='item-header'>
                                                            Prediction accuracy: {this.state.predictionScore}%
                                                        </Item.Header>
                                                    </Item.Content>
                                                </Item>
                                            }
                                        </Item.Group>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>

            </Container>
        );
    }
}

export default Mnist;
