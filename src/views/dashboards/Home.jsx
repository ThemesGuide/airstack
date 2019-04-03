import React from 'react';
import { Featured, CatsAndResources } from '../../views';

class Home extends React.Component{
    render(){
        return (
            <div>
                <h1>{global.appConfig.HomeHeading}</h1>
                <h5>{global.appConfig.HomeSubHeading}</h5>
                <Featured showHeading={false} count={6} showMore={true} />
                <CatsAndResources showHeading={false} />
                <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlHomeFooter}} />
            </div>
        );
    }
}

export default Home;
