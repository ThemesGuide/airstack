import React from 'react';
import { Link } from 'react-router-dom';
import { BtnView, IconBox } from '../../components';
import { createPermalink } from '../../helpers';

class Card extends React.Component{
  
    render(){
        var resource = this.props.resource;
        var img = resource.fields.ImgThumb?resource.fields.ImgThumb:(resource.fields.ImgLarge?resource.fields.ImgLarge:null);
        return (
          <div className="card h-100 shadow">
            {!this.props.hideImg?(
            <div className="card-img-top card-img-175 d-flex align-items-center justify-content-center bg-light border-bottom border-light">
              {(resource.fields.ImgThumb)?(
                <Link to={'/r/'+resource.id}><img src={resource.fields.ImgThumb[0].url} className="img-fluid rounded" alt="thumb" /></Link>
              ):(
                <Link to={'/r/'+resource.id} className="d-flex align-items-center alt justify-content-center">
                  <IconBox symbol={(resource.fields.Type==='Snippet')?<i className="icon display-3 fa fa-code ion-ios-code-working-outline"></i>:<span>{resource.fields.Letter}</span>} />
                </Link>
              )}
            </div>
            ):(<div/>)}
            <div className="card-body py-2 d-flex flex-column">
              <div className="row">
                {this.props.showThumb?
                <div className="col-lg-2 col-md-5 d-flex align-items-center justify-content-center">
                  {img?
                  <img src={img[0].url} className="img-fluid rounded" alt="thumb" />:
                  <div className="py-3"><IconBox symbol={<span>{resource.fields.Letter}</span>} /></div>}
                </div>:null}
                <div className="col-md">
                  <h4 className="text-truncate"><Link to={'/rn/'+createPermalink(resource.fields.Name)}>{resource.fields.Name}</Link></h4>
                  <p className="text-truncate">{resource.fields.Short}</p>
                  <p>
                    {resource.fields.Categories && resource.fields.Categories.length > 0 ? resource.fields.Categories.map((cat,idx) =>
                    (<Link key={idx} className="badge badge-pill badge-dark mr-2" to={'c/'+cat.id}>{cat.fields.Name}</Link>)):<span/>}
                  </p>
                  <div className="row no-gutters align-items-center mt-auto">
                    <div className="col-lg-9 py-2">
                      {!this.props.hideLink?
                      <a className="d-block text-truncate" href={resource.fields.URL}>{resource.fields.DisplayUrl||'?'}</a>:null}
                    </div>
                    <div className="col-lg-3 py-2 text-lg-right text-center">
                      <BtnView className="btn-outline-primary" resource={resource} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Card;