import React, { Component } from 'react';
import styled from 'styled-components';
import { Twemoji } from 'react-emoji-render';

const TextBox = styled.div`
  margin: 2rem;
`

class PostText extends Component {

  render() {
    const { data } = this.props;

    return <TextBox>
      <p>{data.split('\n').map((item, key) => {
        return <span key={key}><Twemoji text={item} /><br/></span>
      })}</p>
    </TextBox>;
  }

}

export default PostText;