import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import client from 'services/feathers';
import styleUtils from 'services/style-utils';
import Button, { ButtonGroup } from 'components/button';

const HomeWrapper = styled.section`
  header {
    border-bottom: 1px solid #000;
    ${styleUtils.media.desktop`
      height: 10rem;
    `}
    h2 {
      max-width: 200px;
      padding-top: 1rem;
      padding-bottom: 2rem;
      line-height: 1.2;
      font-size: 3em;
      text-transform: uppercase;
      ${styleUtils.media.desktop`
        padding-top: 0;
      `}
    }
  }
  h2 {
  }
  .description {
    margin: 0 0 2rem;
    font-size: 1.5em;
  }
`

class Home extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { auth } = this.props;
    return (
      <HomeWrapper id="home">
        <header id="content-header">
          <h2>FOI is a publishing bot</h2>
        </header>
        <div className="description">
          <p>Made for journalists and activists.</p>
          <p>Focused on real-time coverage of events.</p>
        </div>
        <ButtonGroup>
          <Button
            href="https://github.com/miguelpeixe/foi"
            target="_blank"
            rel="external">
            <span class="fa fa-github"></span>
            Learn more
          </Button>
          {(auth.isSignedIn && auth.user.anonymous) &&
            <Button
              primary
              href={`https://telegram.me/${foi.botName}?start=${auth.token}`}
              target="_blank"
              rel="external">
              <span class="fa fa-unlock-alt"></span>
              Authenticate with Telegram
            </Button>
          }
        </ButtonGroup>
      </HomeWrapper>
    )
  }
}

function mapStateToProps (state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Home);
