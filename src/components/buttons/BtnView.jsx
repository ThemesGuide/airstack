import React from 'react';
import { Link } from 'react-router-dom';
import { createPermalink } from '../../helpers';

class BtnView extends React.Component{
    
    render(){
        if (global.appConfig.EnableDirectLinks) {
            return (
                <a className={`btn ${ this.props.className }`} href={this.props.resource.fields.URL} target="_new" rel="nofollow">{this.props.label||global.appConfig.LblView}</a>
            )
        }
        else {
            return (
                <Link className={`btn ${ this.props.className }`} to={'/rn/'+createPermalink(this.props.resource.fields.Name)}>{this.props.label||global.appConfig.LblView}</Link>
            )
        }
    }
}

export default BtnView;