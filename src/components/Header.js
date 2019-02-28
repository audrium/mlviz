import React from 'react';
import { Container, Menu } from 'semantic-ui-react';

export default () => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item as='a' header>
        mlviz
      </Menu.Item>
      <Menu.Item as='a'>Linear Regression</Menu.Item>
    </Container>
  </Menu>
);