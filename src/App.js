import React from 'react';
import config from './conf';
import airtable from './airtable';
import Layouts from './layouts';
import { Loading } from './components';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/css/index.css";

class App extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { appConf: [], user: null, ComponentToRender: Layouts['Layout1'] };
        this.fetchAppConfig = this.fetchAppConfig.bind(this);
        
        // init global config vars from conf.js
        global.appConfig = config;
    }
    
    async componentWillMount() {
        await this.fetchAppConfig();
    }
    
    async fetchAppConfig() {
        // get active App config
        var resp = await fetch(airtable.findRecordsByBoolean("App","Active",1)).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const appConf = json.records;
            
            // reset global config vars from App table
            global.appConfig = appConf[0].fields;
            
            this.setDocumentTags(appConf[0].fields);
            this.setState({ appConf:appConf, ComponentToRender: Layouts[appConf[0].fields.Layout] });
        }
    }
    
    async setDocumentTags(dataObj) {
        document.title = dataObj.AppTitle||dataObj.AppName;
        
        if (document.querySelectorAll('[property="og:title"]')) {
            document.querySelectorAll('[property="og:title"]')[0].content = dataObj.AppTitle;
        }
        
        if (document.getElementsByTagName('meta')["description"]) {
            document.getElementsByTagName('meta')["description"].content = dataObj.AppDesc;
        }
        
        if (document.getElementsByTagName('meta')["twitter:site"]) {
            document.getElementsByTagName('meta')["twitter:site"].content = dataObj.SocialTwitter||config.SocialTwitter;
        }
        
        if (document.getElementsByTagName('meta')["twitter:creator"]) {
            document.getElementsByTagName('meta')["twitter:creator"].content = dataObj.SocialTwitter||config.SocialTwitter;
        }
    }
    
    render(){
        var {appConf, ComponentToRender} = this.state;
       
        return (
            // don't render the layout until appConf is ready
            <div>
                {appConf && appConf.length>0 ?
                    (<ComponentToRender currUser={this.state.user} />):
                    (
                    <div className="container-fluid h-100">
                        <div className="row h-100">
                            <div className="col-12 p-0 h-100">
                                <div className="jumbotron bg-transparent h-100 text-center m-0 d-flex flex-column justify-content-center">
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }
            </div>
        );
    }
    
}

export default App;