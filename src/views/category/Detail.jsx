import React from 'react';
import airtable from '../../airtable';
import { Card } from '../../views';

class Detail extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { Category:{fields:{}} };
        this.fetchCategory = this.fetchCategory.bind(this);
        this.fetchCategoryByName = this.fetchCategoryByName.bind(this);
        this.fetchResources = this.fetchResources.bind(this);
    }
    
    async componentDidMount() {
        if (this.props && this.props.match.params.id) {
            await this.fetchCategory(this.props.match.params.id);
        }
        else if (this.props && this.props.match.params.name) {
            await this.fetchCategoryByName(this.props.match.params.name);
        }
        
        document.title = global.appConfig.AppTitle + " " + this.state.Category.fields.Name;
        window.scrollTo(0, 0);
    }
    
    async fetchCategory(id) {
        //console.log(id);
        var resp = await fetch(airtable.getRecord("Category",id)).catch(err => {console.log(err)})
        //console.log("Category",resp);
        if(resp.status >= 200 && resp.status < 300) {
            var Category = await resp.json();
            await this.fetchResources(Category);
            this.setState({ Category });
        }
    }
    
    async fetchCategoryByName(name) {
        //console.log(id);
        var resp = await fetch(airtable.findRecords("Category","Name",name,"Visible")).catch(err => {console.log(err)})
        //console.log("Category",resp);
        if(resp.status >= 200 && resp.status < 300) {
            var Matches = await resp.json();
            if (Matches && Matches.records && Matches.records.length>0) {
                var Category = Matches.records[0];
                await this.fetchResources(Category);
                this.setState({ Category });
            }
            else {
                this.props.history.push('/404');
            }
        }
    }
    
    async fetchResources(Category) {
        //console.log(id);
        var resp = await fetch(airtable.findRecords("Resource","Category",Category.fields.Name,"Visible")).catch(err => {console.log(err)})
        //console.log("Category",resp);
        if(resp.status >= 200 && resp.status < 300) {
            var resources = await resp.json();
            Category.fields.Resources = resources.records;
            //this.setState({ Category });
        }
    }

    render(){
        var { Category } = this.state;
        //console.log(Category);
        return (
            <div className="row">
                <div className="col-12">
                    <h3>{Category.fields.Name}</h3>
                    <p className="lead">{Category.fields.Description}</p> 
                    <div className="row">
                    {Category.fields.Resources && Category.fields.Resources.length > 0 ? Category.fields.Resources.map((res,key) =>
                    (
                        <div className="col-md-4 py-3" key={key}>
                            <Card resource={res} />
                        </div>
                    )
                    ):null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;

