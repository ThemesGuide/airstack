import React from 'react';
import { Featured, Categories } from '../../views';

class Home extends React.Component{
    render(){
        return (
            <div>
                <div className="my-3">
                    <Categories showShort={true} limitTo={6} colSize="col-md-4" showHeading={false} className="my-3" />
                </div>
                <div className="my-5">
                    <Featured count={10} orientation="vert" showMore={true} hideImages={true} hideLinks={true} showThumbs={true} />
                </div>
                <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlHomeFooter}} />
            </div>
        );
    }
}

export default Home;
