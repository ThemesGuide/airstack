import React from 'react';
import { Featured, CatsAndResources } from '../../views';

class Home extends React.Component{
    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-12 text-center">
                        <h1 className="display-4">{global.appConfig.HomeHeading}</h1>
                        <h6>{global.appConfig.HomeSubHeading}</h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <CatsAndResources showHeading={false} colSize={'col-md-12'} />
                    </div>
                    <div className="col-lg-4">
                        <div className="sticky-top sticky-top-60">
                            <Featured orientation="vert" showHeading={false} count={3} hideImages={true} hideLinks={true} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlHomeFooter}} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
