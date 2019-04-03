import React from 'react';
import airtable from '../../airtable';

class Footer extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { appLinks:[], profile:null };
        this.fetchAppLinks = this.fetchAppLinks.bind(this);
    }
    
    async componentWillMount() {
        await this.fetchAppLinks();
    }
    
    async fetchAppLinks() {
        // get AppLinks
        var resp = await fetch(airtable.getList("AppLinks")).catch(err => {console.log(err)})
        //console.log("fetching");
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const appLinks = json.records;
            this.setState({ appLinks });
        }
    }
    
    componentDidMount() {
        var profile = JSON.parse(localStorage.getItem('profile'))
        if (profile) {
            //console.log("profile",profile);
            this.setState({ profile });
        }
    }
    
    render(){
        var {appLinks} = this.state;
        var footerLinks = {};
        if (appLinks && appLinks.length>0) {
            //console.log(appLinks);
            appLinks.sort((a,b) => {
               return a.fields.Order - b.fields.Order;
            });
            appLinks.forEach((item,idx) => {
                console.log(item);
                if (item.fields.Links.length>0) {
                    footerLinks[item.fields.Name] = JSON.parse(item.fields.Links);
                }
            });
        }
        
        return (
            <footer className="bg-light pt-4 pb-1 mt-5">
                <div className={(global.appConfig.ContainNavbar)?'container':'container-fluid'}>
                    <div className="row">
                    {Object.keys(footerLinks).map((section, key) => {
                        return (
                            <div key={key} className="col-md-3 col-sm-6 py-3">
                                <h6>{section}</h6>
                                {
                                footerLinks[section].map((item,idx) => {
                                    return(<div key={idx}><a rel="nofollow" target="_new" href={item.URL} key={idx}>{item.Name}</a></div>);
                                    })
                                }
                            </div>
                        );
                    })}
                    </div>
                    <div className="row py-5">
                        <div className="col-sm-6 small">
                            {this.state.profile ?
                            <h5>Hey { this.state.profile.fields.Username }, Thanks for Visiting!</h5>:<span />}
                            <span role="img" aria-label="Airstack">🚀</span> Powered by <a rel="nofollow" target="_new" href="https://github.com/ThemesGuide/airstack">Airstack</a>
                        </div>
                        <div className="col-sm-6 text-sm-right text-left small">
                            <div dangerouslySetInnerHTML={{__html: global.appConfig.AppCopyright}} />
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
