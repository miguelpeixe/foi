import React, { Component } from 'react';
import Table from 'components/table';
import TGLink from 'components/telegram-link';

class Dashboard extends Component {
  render () {
    return (
      <div className="sections">
        <div className="env-info content-section">
          <h3>
            <span className="fa fa-info-circle"></span>
            Environment information
          </h3>
          <Table>
            <tbody>
              <tr>
                <th>Site url</th>
                <td>{foi.public}</td>
              </tr>
              <tr>
                <th>Server url</th>
                <td>{foi.server}</td>
              </tr>
              <tr>
                <th>Files url (cdn)</th>
                <td>{foi.cdn}</td>
              </tr>
              <tr>
                <th>Bot name</th>
                <td><TGLink /></td>
              </tr>
              <tr>
                <th>Default user roles</th>
                <td>{foi.defaultUserRoles.join(', ')}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="admin-options content-section">
          <h3>
            <span className="fa fa-gear"></span>
            Site options
          </h3>
        </div>
      </div>
    )
  }
}

export default Dashboard;
