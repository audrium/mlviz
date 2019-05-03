import React from 'react';
import { Dropdown, Button, Form } from 'semantic-ui-react';

const MODELS = [{ key: 'coco', value: 'coco', text: 'COCO-SSD' }];

const Controls = props => (
    <Form>
        <Form.Group inline>
            <Form.Field>
                <label>Model:</label>
                <Button as='div' labelPosition='left'>
                    <Dropdown
                        placeholder='Dataset'
                        options={MODELS}
                        selection
                        className='label'
                        value={'coco'}
                        onChange={null}
                    />
                    <Button
                        content={props.loaded ? 'Loaded' : 'Load'}
                        onClick={props.loadModel}
                        loading={props.loading}
                        disabled={props.loading || props.loaded}
                    />
                </Button>
            </Form.Field>
        </Form.Group>
    </Form >
);

export default Controls;