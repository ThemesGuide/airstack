import React from 'react';
import { routes } from '../../routes';
import { Link } from 'react-router-dom';
import FirebaseAuth from '../../firebaseAuth.js';

class Navbar extends React.Component{
    
  render(){
    //console.log("Navbar",this.state.user);
    //var user = this.state.user;
    return (
      <nav className="navbar navbar-expand navbar-dark fixed-top bg-primary">
        <div className={(global.appConfig.ContainNavbar)?'container px-3':'container-fluid'}>
          <Link className="navbar-brand py-0" to="/" title={global.appConfig.AppName}>
            {(global.appConfig.ShowNavLogo)?<img src={(global.appConfig.AppThumb)?global.appConfig.AppThumb[0].url:'/assets/logo.png'} className="align-top mr-2" style={{height:"30px"}} alt="Logo" />:null}
            {(global.appConfig.ShowNavBrand)?global.appConfig.AppName:null}
          </Link>
          <div className="navbar-nav align-items-center">
            {
              routes
              .filter((prop,key) => {return prop.showInNav === true})
              .map((prop,key) => {
                return (
                  <Link className={'nav-item nav-link ' + (prop.className||'')} to={prop.path} key={key}>{prop.name}</Link>
                );
              })
            }
            {this.props.enableLogin?(
            <FirebaseAuth className="ml-3" />):null}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
