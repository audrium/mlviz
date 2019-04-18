import React from 'react';
import { Dropdown, Button, Form, Label } from 'semantic-ui-react';

const DATASETS = [{ key: 'mnist', value: 'mnist', text: 'MNIST' }];

const Controls = props => (
    <Form>
        <Form.Group inline>
            <Form.Field>
                <label>Dataset:</label>
                <Button as='div' labelPosition='left'>
                    <Dropdown
                        placeholder='Dataset'
                        options={DATASETS}
                        selection
                        className='label'
                        value={'mnist'}
                        onChange={null}
                    />
                    <Button
                        content={props.datasetLoaded ? 'Loaded' :  'Load'}
                        onClick={props.loadDataset}
                        loading={props.datasetLoading}
                        disabled={props.datasetLoading || props.datasetLoaded}
                    />
                </Button>
            </Form.Field>

            {props.datasetLoaded &&
                <Button
                    content='Train'
                    icon='play'
                    labelPosition='right'
                    onClick={props.train}
                    disabled={props.training}
                />
            }

            {props.status &&
                <Label size='medium' style={{ alignSelf: 'flex-end', marginBottom: 2 }}>
                    {props.status}
                </Label>
            }
        </Form.Group>
    </Form >
);

export default Controls;