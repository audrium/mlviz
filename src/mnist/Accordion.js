import React, { Component } from 'react';
import { Accordion, Icon, Image } from 'semantic-ui-react';
import datasetExample from './dataset.png';

export default class AccordionInfo extends Component {

    state = { activeIndex: 0 }

    onAccordionClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        this.setState({ activeIndex: activeIndex === index ? -1 : index })
    }

    render() {
        const { activeIndex } = this.state
        return (
            <div style={{ paddingBottom: 20 }}>
                <Accordion fluid styled>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.onAccordionClick}>
                        <Icon name='dropdown' />
                        Info
                </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            In this page we will train a simple neural network to recognize handwritten digits from the MNIST dataset.
                        </p>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.onAccordionClick}>
                        <Icon name='dropdown' />
                        What is MNIST?
                </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1} style={{ height: 100 }}>
                        <Image src={datasetExample} size='tiny' floated='left' wrapped />
                        <p>
                            MNIST is dataset for handwritten digits. It contains 70,000 28x28 black and white images representing the digits zero through nine.<br />
                            The data is split into two subsets, with 60,000 images belonging to the training set and 10,000 images belonging to the testing set.<br />
                            More info <a href='http://yann.lecun.com/exdb/mnist/' target="_blank" rel="noopener noreferrer">here</a>.
                        </p>
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }
}
