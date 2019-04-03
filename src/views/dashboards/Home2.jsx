import React from 'react';
import { Featured, CatsAndResources } from '../../views';

class Home extends React.Component{
    render(){
        return (
            <div>
                <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlJumbo}} />
                <div className="my-3">
                    <CatsAndResources showHeading={false} className="my-3" />
                </div>
                <div className="my-5">
                    <h5>{global.appConfig.LblFeatured}</h5>
                    <Featured count={6} showMore={true} />
                </div>
                <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlHomeFooter}} />
            </div>
        );
    }
}

export default Home;
