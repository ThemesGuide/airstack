import React from 'react';
import { Link } from 'react-router-dom';
import WOW from "wowjs";
import airtable from '../airtable';
import { ByCategoryId } from '../views';
import { createPermalink } from '../helpers';
import { Loading } from '../components';

class CatsAndResources extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { categories: [] };
        this.fetchCategories = this.fetchCategories.bind(this);
        this.cancellable = {
            setState: this.setState.bind(this)
        };
    }
    
    async componentDidMount() {
        await this.fetchCategories();
        new WOW.WOW({live:false}).init();
    }
    
    componentWillUnmount () {
        this.cancellable.setState = undefined;
    }

    async fetchCategories() {
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
                {this.props.showHeading?(
                <div className="col-12"><h5 className="mt-3 text-muted"><span>{global.appConfig.LblCategories}</span></h5></div>):('')}
                
                {this.props.cardColumns?(
                
                    <div className="col-12">
                        <div class="card-columns">
                            {categories && categories.length > 0 ? categories.map((cat,key) =>(
                            <div className="card card-body h-100 my-3 shadow wow fadeIn" key={key} data-wow-delay={'.'+(key+1)+'3s'}>
                                {!this.props.hideCategoryName?
                                <h4>{cat.fields.Name}</h4>:null}
                                <div className="mb-2">
                                    <ByCategoryId count={3} categoryId={cat.id} />
                                </div>
                                <div className="text-right mt-auto">
                                    <Link className="btn btn-outline-primary btn-sm" to={'/cn/'+createPermalink(cat.fields.Name)}>More</Link>
                                </div>
                            </div>
                            )):<div className="col-sm-12 text-center py-5"><Loading /></div>}
                        </div>
                    </div>
                ):
                    
                    categories && categories.length > 0 ? categories.map((cat,key) => (
                    <div className={'py-3 ' + (this.props.colSize?this.props.colSize:'col-md-4')} key={key}>
                        <div className="card card-body h-100 shadow wow fadeIn" data-wow-delay={'.'+(key+1)+'3s'}>
                            {!this.props.hideCategoryName?
                            <h4>{cat.fields.Name}</h4>:null}
                            <div className="mb-2">
                                <ByCategoryId count={3} categoryId={cat.id} />
                            </div>
                            <div className="text-right mt-auto">
                                <Link className="btn btn-outline-primary btn-sm" to={'/cn/'+createPermalink(cat.fields.Name)}>More</Link>
                            </div>
                        </div>
                    </div>
                    )):<div className="col-sm-12 text-center py-5"><Loading /></div>
                    
                }
            </div>
        );
    }
}

export default CatsAndResources;
