import React from 'react';
import { Container, Segment, Accordion, Icon } from 'semantic-ui-react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Controls from './Controls';

const BORDER_COLOR = '#f44336';
const LABEL_COLOR = '#ffffff';

class ObjectDetection extends React.Component {

    constructor() {
        super();
        this.state = {
            loaded: false,
            loading: false,
            activeIndex: 0
        }
        this.webcam = null;
        this.canvasRef = React.createRef();
    }

    loadModel = async () => {
        this.setState({ loading: true });
        this.model = await cocoSsd.load();
        this.setState({ loaded: true, loading: false }, () => this.detectFrame());
    }

    detectFrame = () => {
        this.model.detect(this.webcam.video)
            .then(predictions => {
                this.renderPredictions(predictions);
                requestAnimationFrame(() => this.detectFrame());
            });
    }

    renderPredictions = predictions => {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px sans-serif";
        ctx.textBaseline = "top";
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            // Bounding box
            ctx.strokeStyle = BORDER_COLOR;
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            // Label background
            ctx.fillStyle = BORDER_COLOR;
            const textWidth = ctx.measureText(prediction.class).width;
            ctx.fillRect(x, y, textWidth + 4, 20);
            // Label text
            ctx.fillStyle = LABEL_COLOR;
            ctx.fillText(prediction.class, x, y);
        });
    }

    onAccordionClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        this.setState({ activeIndex: activeIndex === index ? -1 : index })
    }

    render() {
        const { loaded, loading, activeIndex } = this.state;
        return (
            <Container style={{ padding: '5em 0em' }}>

                <div style={{ paddingBottom: 20 }}>
                    <Accordion fluid styled>
                        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.onAccordionClick}>
                            <Icon name='dropdown' />
                            Object Detection
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <p>
                                This mini project uses already pretrained TensorFlow.js COCO-SSD model. This model detects objects
                                defined in the COCO dataset, which is a large-scale object detection, segmentation,
                                and captioning dataset. You can find more information
                                <a href='http://cocodataset.org/#home' target="_blank" rel="noopener noreferrer"> here</a>.
                                The model is capable of detecting 90 classes of objects. (SSD stands for Single Shot MultiBox Detection).
                            </p>
                        </Accordion.Content>
                    </Accordion>
                </div>

                <Controls
                    loaded={loaded}
                    loading={loading}
                    loadModel={this.loadModel}
                />

                {loaded &&
                    <Segment style={{ position: 'relative', height: 496, width: 657, padding: 8 }} raised>
                        <canvas
                            ref={this.canvasRef}
                            style={{ position: 'absolute' }}
                            width="640"
                            height="480"
                        />
                        <Webcam
                            ref={webcam => { this.webcam = webcam }}
                            audio={false}
                        />
                    </Segment>
                }
            </Container>
        );
    }
}

export default ObjectDetection;
