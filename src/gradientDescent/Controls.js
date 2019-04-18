import React from 'react';
import { Dropdown, Button, Form } from 'semantic-ui-react';

const Controls = props => (
    <Form>
        <Form.Group inline>
            <Form.Field>
                <label>Dataset:</label>
                <Button as='div' labelPosition='left'>
                    <Dropdown
                        placeholder='Dataset'
                        options={props.datasets}
                        selection
                        className='label'
                        value={props.dataset}
                        onChange={props.onDatasetChange}
                    />
                    <Button
                        content='Load'
                        onClick={props.loadDataset}
                        disabled={props.training}
                    />
                </Button>
            </Form.Field>
            {props.training ?
                <Button content='Stop' icon='stop' labelPosition='right' onClick={props.stopTraining} /> :
                <Button content='Train' icon='play' labelPosition='right' onClick={props.startTraining} />
            }
            {(!props.training && props.epoch > 0) &&
                <Button content='Clear' icon='redo' labelPosition='right' onClick={props.clearData} />
            }
        </Form.Group>
    </Form>
);

export default Controls;