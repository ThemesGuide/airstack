import React from 'react';
import WOW from "wowjs";
import airtable from '../airtable';
import { Card } from '../views';

class Tag extends React.Component{
    constructor(props) {
        super(props);
        this.state = { resources: [] };
        this.fetchResources = this.fetchResources.bind(this);
        //this.fetchCategories = this.fetchCategories.bind(this);
    }
    
    async componentDidMount() {
        if (this.props && this.props.match.params.tag) {
            await this.fetchResources(this.props.match.params.tag);
        }
        
        // animate
        const wow = new WOW.WOW();
        wow.init();
    }
    
    async fetchResources(tag) {
        this.setState({ loading: true });
        //var _self = this;
        var resp = await fetch(airtable.findRecords("Resource","Tags",tag,"Visible")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            //console.log("resp",resp);
            var json = await resp.json();
            const resources = json.records;
            this.setState({resources});
        }
    }
    
    async fetchCategories(Resource) {
        //console.log(id);
        var resp = await fetch(airtable.getChildRecords("Category",Resource.fields.Category,"Visible")).catch(err => {console.log(err)})
        if(resp.status && resp.status >= 200 && resp.status < 300) {
            var categories = await resp.json();
            //console.log("categories",categories);
            return categories.records;
        }
        else {
            return [];
        }
    }
    
    render(){
        
        var {resources} = this.state;
        //console.log(filtered);
        return (
            <div className="row">
                <div className="col-12 py-3">
                    
                </div>
                {resources && resources.length > 0 ? resources
                .map((resource,key) =>
                (
                <div className="col-sm-4 py-3 wow fadeInUp" key={key} data-wow-delay={'.'+(key+1)+'3s'}>
                  <Card hideImg={true} resource={resource} />
                </div>
                )) : <div/>}
            </div>
        );
    }
}

export default Tag;