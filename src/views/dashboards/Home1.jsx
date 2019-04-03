import React from 'react';
import { Featured, CatsAndResources } from '../../views';

class Home extends React.Component{
    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h1>{global.appConfig.HomeHeading}</h1>
                        <h5>{global.appConfig.HomeSubHeading}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-9">
                        <CatsAndResources showHeading={false} colSize={'col-md-6'} />
                    </div>
                    <div className="col-lg-3">
                        <div className="sticky-top sticky-top-60">
                            <Featured orientation="vert" showHeading={false} count={3} hideImages={true} />
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
