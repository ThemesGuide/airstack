import React from 'react';
import jquery from 'jquery';
import airtable from '../../airtable';

class Search extends React.Component{
    
    constructor(props) {
      super(props);
      this.state = { categories: [], query:{keywords:null} };
      this.fetchAirtable = this.fetchAirtable.bind(this);
      this.doFilter = this.doFilter.bind(this);
      this.clearFilter = this.clearFilter.bind(this);
    }
    
    async componentDidMount() {
      await this.fetchAirtable();
    }
    
    clickToggle(e) {
      e.preventDefault();
      jquery('.nav').toggleClass("justify-content-end");
      jquery('.toggle').toggleClass("text-light");
      return false;
    }
    
    selectCat(cat) {
      if (this.state.selectedCategoryId===cat.id) {
        this.setState({selectedCategoryId:null});
        this.props.onChangeFilter({});
      }
      else {
        this.setState({selectedCategoryId:cat.id});
        this.props.onChangeFilter(cat);
      }
    }
    
    doFilter(event){
      if (event.target.value && event.target.value.length>2) {
        this.setState({query:{keywords:event.target.value}});
        this.props.onChangeFilter({keywords:event.target.value.toLowerCase()});
      }
      else {
        this.clearFilter();
      }
    }
    
    clearFilter() {
      this.setState({query:{keywords:null}});
      this.props.onChangeFilter({});
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
        <div>
          <div className="d-flex align-items-center">
            <div className={'flex-shrink-0 ' + (categories.length<(this.props.scrollThreshold||9)?'d-none':'')}>
                <button onClick={this.clickToggle} className="btn btn-link p-2 toggle text-light">
                  <i className="fa fa-arrow-alt-circle-left fa-2x ion-ios-arrow-dropleft"></i>
                </button>
            </div>
            <div className="flex-grow-1 w-100 o-hidden" style={{overflow:"hidden"}}>
              <ul className="nav text-uppercase position-relative flex-nowrap small" data-toggle="buttons">
                  {categories && categories.length > 0 ? categories.map((cat,key) =>
                    (
                    <li className="nav-item px-1" key={key}>
                      <button title="Click to toggle selection" className={'btn btn-sm small ' + (this.state.selectedCategoryId===cat.id ? 'btn-primary' : 'btn-outline-primary')} data-toggle="button" onClick={() => this.selectCat(cat)}>
                        <span className={(this.state.selectedCategoryId===cat.id ? 'font-weight-bold' : '')}>{cat.fields.Name}</span>
                      </button>
                    </li>
                    )
                  ) :
                    <span>...</span>
                  }
                  <li className="ml-auto nav-item" ng-show="notify.search">
                      
                  </li>
              </ul>
            </div>
            <div className={'flex-shrink-0 ' + (categories.length<(this.props.scrollThreshold||9)?'d-none':'')}>
              <button onClick={this.clickToggle} className="btn btn-link toggle p-2">
                <span className="fa fa-arrow-alt-circle-right fa-2x ion-ios-arrow-dropright"></span>
              </button>
            </div>
          </div>
          
          <form className="my-2 ng-pristine ng-valid" id="formSearch">
            <div className="row no-gutters">
                <div className="col">
                    <input type="text"
                    className="form-control form-control-lg bg-transparent rounded-0 border-top-0 border-left-0 border-right-0" 
                    onChange={this.doFilter} placeholder="Search" name="query" />
                </div>
                {((this.state.query && this.state.query.keywords))?
                <div className="col-auto border-bottom">
                    <button className="btn btn-lg btn-outline-dark border-0 rounded-0 rounded-right" type="button"
                    onClick={this.clearFilter} >
                        <i className="fa fa-times-circle"></i>
                    </button>
                </div>
                :null}
            </div>
          </form>
        </div>
      );
    }
}

export default Search;
