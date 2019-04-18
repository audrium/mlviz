import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from "react-router-dom";

export default () => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item header>
        <Link to="/">mlviz</Link>
      </Menu.Item>
      <Menu.Item><Link to="/gradient_descent">Gradient Descent</Link></Menu.Item>
      <Menu.Item><Link to="/mnist">MNIST</Link></Menu.Item>
    </Container>
  </Menu>
);