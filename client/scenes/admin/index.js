import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { hasUser, hasRole } from 'services/auth';
import Loader from 'components/loader';

import 'styles/tables.css';

class Admin extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  render () {
    const { auth } = this.props;
    if(auth.user !== null) {
      return (
        <section id="admin-area">
          {!hasRole(auth, 'admin') &&
            <Redirect to="/" />
          }
          <header id="content-header">
            <h2>Administration</h2>
          </header>
          <div className="sections">
            <div className="env-info content-section">
              <h3>Environment information</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Site url</th>
                    <td>{foi.url}</td>
                  </tr>
                  <tr>
                    <th>Bot name</th>
                    <td>{foi.botName}</td>
                  </tr>
                  <tr>
                    <th>Default user roles</th>
                    <td>{foi.defaultUserRoles}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="admin-options content-section">
              <h3>Site options</h3>
            </div>
          </div>
        </section>
      )
    } else {
      return <Loader size={20} />
    }
  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
};

export default connect(mapStateToProps)(Admin);
