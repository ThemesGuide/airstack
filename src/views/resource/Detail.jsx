import React from 'react';
import { Link } from 'react-router-dom';
import airtable from '../../airtable';
import { StarRating, Loading }  from '../../components';
import { createPermalink } from '../../helpers';

class Detail extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { resource:{fields:{}} };
        this.fetchRecord = this.fetchRecord.bind(this);
        this.fetchRecordByName = this.fetchRecordByName.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchTags = this.fetchTags.bind(this);
        this.fetchRelated = this.fetchRelated.bind(this);
    }
    
    async componentDidMount() {
        if (this.props && this.props.match.params.id) {
            await this.fetchRecord(this.props.match.params.id);
        }
        else if (this.props && this.props.match.params.name) {
            await this.fetchRecordByName(this.props.match.params.name);
        }
        
        document.title = global.appConfig.AppTitle + " " + this.state.resource.fields.Name;
        window.scrollTo(0, 0);
    }

    async fetchRecord(id) {
        //console.log(id);
        var resp = await fetch(airtable.getRecord("Resource",id)).catch(err => {console.log(err)})
        //console.log(resp);
        if(resp.status >= 200 && resp.status < 300) {
            var resource = await resp.json();
            resource.fields.Categories = await this.fetchCategories(resource);
            resource.fields.Tags = await this.fetchTags(resource);
            resource.fields.Related = await this.fetchRelated(resource);
            this.setState({ resource });
        }
    }
    
    async fetchRecordByName(name) {
        //console.log(name);
        var resp = await fetch(airtable.findRecords("Resource","Name",name,"Visible")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var Matches = await resp.json();
            if (Matches && Matches.records && Matches.records.length>0) {
                var resource = Matches.records[0];
                resource.fields.Categories = await this.fetchCategories(resource);
                resource.fields.Tags = await this.fetchTags(resource);
                resource.fields.Related = await this.fetchRelated(resource);
                //console.log("Resource",resource);
                this.setState({ resource });
                
                // incr views count
                //await getIp().then(ip => fetch(airtable.incrCounter("Resource",resource.id,"Views",resource.fields.Views,resource.fields.LastIp,ip)).catch(err => {console.log(err)})).catch(e => console.error(e))
                
            }
            else {
                this.props.history.push('/404');
            }
        }
    }
    
    async fetchCategories(Resource) {
        //console.log(id);
        var resp = await fetch(airtable.getChildRecords("Category",Resource.fields.Category,"Visible")).catch(err => {console.log(err)})
        //console.log("Category",resp);
        if(resp.status && resp.status >= 200 && resp.status < 300) {
            var categories = await resp.json();
            //console.log("categories",categories);
            return categories.records;
        }
        else {
            return [];
        }
    }
    
    async fetchTags(Resource) {
        var resp = await fetch(airtable.getChildRecords("Tags",Resource.fields.Tags,null)).catch(err => {console.log(err)})
        //console.log("Tags",resp);
        if(resp.status && resp.status >= 200 && resp.status < 300) {
            var tags = await resp.json();
            //console.log("tags",tags);
            return tags.records;
        }
        else {
            return [];
        }
    }

    async fetchRelated(Resource) {
        var resp = await fetch(airtable.getChildRecords("Resource",Resource.fields.Related,"Visible")).catch(err => {console.log(err)})
        //console.log("Related",resp);
        if(resp.status && resp.status >= 200 && resp.status < 300) {
            var related = await resp.json();
            //console.log("related",related);
            return related.records;
        }
        else {
            return [];
        }
    }

    render(){
        var { resource } = this.state;
        return (
            <div className="row">
                <div className="col-12">
                    {(resource && resource.fields && resource.fields.Name)?
                    <div className="card card-body pt-3 pb-5 animated fadeIn">
                        <div className="row py-1">
                            <div className="col-md-7">
                                <h2 data-resource-id={resource.id}>{resource.fields.Name}</h2>
                            </div>
                            <div className="col-md-5 text-right">
                                {resource.fields.Categories?(resource.fields.Categories.map((cat,idx) =>
                                (<Link key={idx} className="badge badge-pill badge-dark mr-2" to={'/c/'+cat.id}>{cat.fields.Name}</Link>))):(<span />)}
                            </div>
                            <div className="col-md-7">
                                <p className="lead">
                                {resource.fields.Short}
                                </p>
                                <p>
                                {resource.fields.Full}
                                </p>
                                <p>
                                {resource.fields.Tags?(resource.fields.Tags.map((tag,idx) =>
                                (<Link key={idx} className="badge badge-pill badge-secondary mr-2" to={'/t/' + tag.fields.Name}>{tag.fields.Name}</Link>))):(<span />)}
                                </p>
                                <p className="text-truncate">
                                <a href={resource.fields.URL}>{resource.fields.DisplayUrl}</a>
                                </p>
                                <a className="btn btn-outline-primary" href={resource.fields.URL} 
                                    target="_new" rel="nofollow">{global.appConfig.LblView}</a>
                            </div>
                            <div className="col-md-5 text-right">
                                {(global.appConfig.EnableStarRating && resource.fields.Rating)?<StarRating max={5} rating={resource.fields.Rating} />:''}
                                <a href={resource.fields.URL}>
                                {(resource.fields.ImgLarge)?(<img src={resource.fields.ImgLarge[0].url} className="img-fluid rounded shadow" alt="detail" />):(<span />)}
                                {(resource.fields.ImgThumb && !resource.fields.ImgLarge)?(<img src={resource.fields.ImgThumb[0].url} className="img-fluid rounded shadow" alt="thumb" />)
                                :(<span />)}
                                </a>
                            </div>
                        </div>
                        {resource.fields.Related && resource.fields.Related.length>0?(
                        <div className="row py-1">
                            <div className="col-12 pt-2">
                                <hr />
                                <h6>Related {global.appConfig.LblResources}</h6>
                            </div>
                            {(resource.fields.Related.map((item,idx) => (
                            <div className="col-md-2" key={idx}>
                                <a className="mr-2" href={'/rn/'+createPermalink(item.fields.Name)}>
                                    {(item.fields.ImgLarge)?(<img src={item.fields.ImgLarge[0].url} className="img-fluid rounded shadow" alt="detail" />):(<span />)}
                                    {(item.fields.ImgThumb && !item.fields.ImgLarge)?(<img src={item.fields.ImgThumb[0].url} className="img-fluid rounded shadow" alt="thumb" />)
                                    :(<span>{item.fields.Name}</span>)}
                                </a>
                            </div>)))}
                        </div>):null}
                    </div>:<div className="py-5"><Loading /></div>}
                </div>
            </div>
        );
    }
}

export default Detail;

