import React from 'react';
import { Navbar } from '../../components';

class Header extends React.Component{
  
  render(){
    return (
      <header>
        <Navbar enableLogin={global.appConfig.EnableLogin} />
      </header>
    );
  }
  
}

export default Header;