import React from 'react';
import airtable from '../../airtable';
import { Card } from '../../views';
import { Search, Loading } from '../../components';

class List extends React.Component{
    constructor(props) {
        super(props);
        this.state = { resources: [], filtered: [], criteria:{}, page:0, prevY:0, offset:0, loading:false };
        this.fetchResources = this.fetchResources.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleObserver = this.handleObserver.bind(this);
        this.cancellable = {
            setState: this.setState.bind(this)
        };
    }
    
    async componentDidMount() {
        document.title = global.appConfig.AppTitle + " " + global.appConfig.LblResources;
        
        // first page
        await this.fetchResources(this.state.page, this.state.offset);
        
        // load more on page scroll using IntersectionObserver
        var options = {
          root: null, // Page as root
          rootMargin: "0px",
          threshold: .5
        };
        
        // create observer
        this.observer = new IntersectionObserver(
          this.handleObserver.bind(this),
          options
        );
        
        // observe the `loadingRef`
        this.observer.observe(this.loadingRef);
    }
    
    componentWillUnmount () {
        this.cancellable.setState = undefined; // drop all references.
    }
    
    handleObserver(entities, observer) {
        const y = entities[0].boundingClientRect.y;
        if ((this.state.prevY > y || (this.state.prevY===0)) && this.state.offset) {
            // append more data
            this.fetchResources(this.state.page, this.state.offset);
            this.setState({page: this.state.page+1});
        }
        this.setState({prevY:y});
    }
    
    async fetchResources(pageNo, offset) {
        var _self = this;
        //if (pageNo===0){
            this.setState({ loading: true });
        //}
        
        var resp = await fetch(airtable.getPagedListView("Resource","Visible",(this.props.perPage||12),offset)).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            //console.log("resp",resp);
            var json = await resp.json();
            const resources = json.records;
            
            // append the new items and update state
            this.setState({loading: false, offset:json.offset, resources: [...this.state.resources, ...resources]});
            if (this.state.criteria!=={}){
                this.handleFilter(this.state.criteria);
            }
            
            await Promise.all(resources.map(async (r) => {
                r.fields.Categories = await this.fetchCategories(r);
            })).then(function(){
                //console.log("done promise");
                _self.setState({ state: _self.state });
                _self.handleFilter(_self.state.criteria);
            });
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
    
    handleSelect(id) {
        //console.log("selected",id);
        if (id) {
            this.setState({filtered: this.state.resources.filter((resource,key) => (resource.fields.Category)?resource.fields.Category.includes(id):0)  });
        }
        else {
            this.setState({filtered: this.state.resources});
        }
    }
    
    handleFilter(criteria) {
        this.setState({criteria: criteria});
        //console.log("criteria:",criteria);
        if (criteria && criteria.id) {
            // filter by Category
            this.setState({filtered: this.state.resources.filter((resource,key) => (resource.fields.Category)?resource.fields.Category.includes(criteria.id):0)  });
        }
        else if (criteria && criteria.keywords && criteria.keywords.length>2) {
            // filter by keyword search
            this.setState({filtered: this.state.resources.filter((resource,key) => resource.fields.Name.toLowerCase().indexOf(criteria.keywords)>-1)});
        }
        else {
            // no filter
            this.setState({filtered: this.state.resources});
        }
    }
  
    render(){
        const loadingTextCSS = { display: this.state.loading ? "block" : "none" };
        var {filtered} = this.state;
        //console.log(filtered);
        return (
            <div className="row">
                <div className="col-12 py-3">
                    <Search onChangeFilter={this.handleFilter} scrollThreshold={8} />
                </div>
                {filtered && filtered.length > 0 ? filtered
                .map((resource,key) =>
                (
                <div className={'py-3 animated fadeIn ' + (this.props.colSize?this.props.colSize:'col-md-4')} key={key}>
                    <Card hideImg={true} hideLink={true} resource={resource} />
                </div>
                )):<div />}
                <div className="col-12 mt-5 py-5 text-center" ref={loadingRef => (this.loadingRef = loadingRef)}>
                  <span style={loadingTextCSS}>
                    <Loading />
                  </span>
                </div>
            </div>
        );
    }

}

export default List;