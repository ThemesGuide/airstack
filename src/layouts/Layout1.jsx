import React from 'react';
import { routes } from '../routes';
import { Switch, Route } from 'react-router-dom';
import { Header, Footer } from '../components';

class Layout extends React.Component{

  render(){
    return(
      <main className="mvh-100 d-flex flex-column">
        <Header />
        <div className="container flex-grow-1 py-4 mt-5">
            <Switch>
                {
                    routes.map((rte,key) => {
                      if (rte.renderProps) {
                        // pass props from router
                        var Comp = rte.component;
                        return (<Route exact path={rte.path} render={(props) => <Comp {...rte.renderProps } />} key={key} />);
                      } else {
                        // standard route to component
                        return (<Route exact path={rte.path} component={rte.component} key={key} />);
                      }
                    })
                }
            </Switch>
        </div>
        <Footer />
      </main>);
  }
}

export default Layout;