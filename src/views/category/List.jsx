import React from 'react';
import airtable from '../../airtable';
import { Link } from 'react-router-dom';
import { createPermalink } from '../../helpers';

class Categories extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { categories: [] };
        this.fetchAirtable = this.fetchAirtable.bind(this);
        this.cancellable = {
            setState: this.setState.bind(this)
        };
    }
    
    async componentDidMount() {
        document.title = global.appConfig.AppTitle + " " + global.appConfig.LblCategories;
        await this.fetchAirtable();
    }
    
    async fetchAirtable() {
        var resp = await fetch(airtable.getListView("Category","Visible")).catch(err => {console.log(err)})
        //console.log(resp);
        if(resp.status >= 200 && resp.status < 300) {
            var json = await resp.json();
            const categories = json.records;
            this.setState({ categories });
        }
    }

    render(){
        var {categories} = this.state;
        return (
            <div className="row">
                <div className="col-12">
                    {this.props.showHeading?
                    <h2>{global.appConfig.LblCategories}</h2>:null}
                    <div className="row">
                    {categories && categories.length > 0 ? categories.slice(0,this.props.limitTo||100).map((cat,key) =>
                      (
                        <div className={'py-3 ' + (this.props.colSize?this.props.colSize:'col-md-4') + (cat.fields.Resources?'':' d-none')} key={key}>
                        {cat.fields.Resources && cat.fields.Resources.length?
                            <div className="card h-100 my-2 shadow">
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="text-truncate"><a href={'/cn/'+createPermalink(cat.fields.Name)}>{cat.fields.Name}</a></h5>
                                    </div>
                                    <div className="col-auto">
                                        <span className="badge badge-pill badge-dark float-right">{cat.fields.Resources.length}</span>
                                    </div>
                                </div>
                                {this.props.showShort?
                                <p>{cat.fields.Short}</p>:
                                <p>{cat.fields.Description}</p>
                                }
                                <div className="text-right mt-auto">
                                    <Link className="btn btn-outline-primary btn-sm" to={'/c/'+cat.id}>View</Link>
                                </div>
                              </div>
                            </div>
                        :<div/>}
                        </div>
                      )
                    ):<div className="col-sm-12">No records found.</div>}
                    </div>
                </div>
            </div>
        );
    }
    
    componentWillUnmount () {
        this.cancellable.setState = undefined; // drop all references.
    }
}

export default Categories;
