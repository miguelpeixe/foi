import React, { Component } from 'react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { hasUser, hasRole } from 'services/auth';
import ContentHeader from 'components/content/header';
import ContentBody from 'components/content/body';
import Loader from 'components/loader';

import Dashboard from './dashboard';
import Users from './users';

class Admin extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    const { match, auth } = this.props;
    if(auth.user) {
      return (
        <section id="admin-area">
          {!hasRole(auth, 'admin') &&
            <Redirect to="/" />
          }
          <ContentHeader icon="lock">
            <h2>
              <Link to="/admin">Administration</Link>
            </h2>
            <nav>
              <NavLink exact={true} to="/admin">
                <span className="fa fa-gear"></span>
                Dashboard
              </NavLink>
              <NavLink to="/admin/users">
                <span className="fa fa-users"></span>
                Users
              </NavLink>
            </nav>
          </ContentHeader>
          <ContentBody>
            <Switch>
              <Route path={`${match.url}/users`} component={Users} />
              <Route component={Dashboard} />
            </Switch>
          </ContentBody>
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
