import React from 'react';
import airtable from '../../airtable';
import { BtnView } from '../../components';

class ByCategoryId extends React.Component{
    constructor(props) {
        super(props);
        this.state = { resources: [], categories: [] };
        this.fetchAirtable = this.fetchAirtable.bind(this);
        this.cancellable = { setState: this.setState.bind(this) };
    }
    
    async componentWillMount() {
        await this.fetchAirtable();
    }
    
    componentWillUnmount () {
        this.cancellable.setState = undefined;
    }
    
    async fetchAirtable() {
        //console.log(props);
        var _self = this;
        var resp = await fetch(airtable.getListView("Resource","Visible")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const resources = json.records.filter(function(item,i){
                if (item.fields.Category) {
                    return (item.fields.Category.indexOf(_self.props.categoryId)>-1);
                }
                else {
                    return 0;
                }
            }).slice(0,this.props.count||5);
            this.setState({ resources });
        }
    }
  
    render(){
        var {resources} = this.state;
        return (
            <div>
                {resources && resources.length > 0 ? resources
                .map((resource,key) =>
                (
                <div className="py-1 text-truncate" key={key}>
                    <BtnView className="btn-link pl-0" resource={resource} label={resource.fields.Name} />
                </div>
                )):
                <div className="py-1">...</div>}
            </div>
        );
    }
}

export default ByCategoryId;