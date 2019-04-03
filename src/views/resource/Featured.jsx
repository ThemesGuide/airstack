import React from 'react';
import airtable from '../../airtable';
import { Card } from '../../views';

class Featured extends React.Component{
    constructor(props) {
        super(props);
        this.state = { resources: [], categories: [] };
        this.fetchFeatured = this.fetchFeatured.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
    }
    
    async componentWillMount() {
        await this.fetchFeatured(this.props);
    }
    
    async fetchFeatured(props) {
        //console.log(props);
        var resp = await fetch(airtable.getList("Resource")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            var resources = json.records.filter(function(item,i){
                return (item.fields.Featured);
            });
            
            this.setState({ resources });
            
            var _self = this;
            var promises = await resources.map(async (r) => {
                //console.log(r);
                r.fields.Categories = await _self.fetchCategories(r);
                return r;
            });
            Promise.all(promises).then((resources) => {this.setState({ resources })});
        }
    }
  
    async fetchCategories(Resource) {
        //console.log("Resource",Resource.fields.Name);
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
        return (
            <div className="row">
                {this.props.showHeading?(
                <div className="col-12"><h5 className="mt-4 text-muted"><span>{global.appConfig.LblFeatured}</span></h5></div>):('')}
                {resources && resources.length > 0 ? resources.slice(0,(this.props.count||3))
                .map((resource,key) =>
                (
                <summary key={key} data-wow-delay={'.'+(key+1)+'3s'} onClick={() => window.location='/rn/'+resource.fields.Name.toLowerCase()} className={`py-3 wow fadeIn ${(this.props.orientation==='vert')?'col-12':'col-lg-4'}`}>
                  <Card resource={resource} hideImg={this.props.hideImages} showThumb={this.props.showThumbs} hideLink={this.props.hideLinks} />
                </summary>
                )
                ):<div className="col-12" />}
                <div className={(!this.props.showMore || this.props.showMore===false)?'d-none':'col-12 text-center py-3'}>
                    <a href="/r/" className="btn btn-outline-primary">{global.appConfig.LblShowMore}</a>
                </div>
            </div>
        );
    }
    
    async componentWillUnmount() {
        this.fetchFeatured = undefined;
        this.state = undefined;
        this.props = undefined;
    }
}

export default Featured;