import React from 'react';
import { Link } from 'react-router-dom';
import airtable from '../../airtable';
import { auth } from '../../firebaseAuth';

class Detail extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { User:{fields:{}} };
        this.fetchUser = this.fetchUser.bind(this);
    }
    
    async componentDidMount() {
        if (this.props && this.props.match.params.username) {
            // get user profile from airtable
            await this.fetchUser(this.props.match.params.username);
        }
    
        window.scrollTo(0, 0);
    }
    
    async fetchUser(username) {
        //console.log(id);
        var resp = await fetch(airtable.findRecords("Users","Username",username,"Visible")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var Matches = await resp.json();
            if (Matches && Matches.records && Matches.records.length>0) {
                var User = Matches.records[0];
                
                //resource.fields.Related = await this.fetchRelated(User);
                console.log("User profile",User);
                this.setState({ User });
            }
            else {
                this.props.history.push('/404');
            }
        }
    }
    
    /*
    async fetchVotes(User) {
        var resp = await fetch(airtable.getChildRecords("Users",User.fields.Related,"Visible")).catch(err => {console.log(err)})
        //console.log("Related",resp);
        if(resp.status && resp.status >= 200 && resp.status < 300) {
            var related = await resp.json();
            //console.log("related",related);
            return related.records;
        }
        else {
            return [];
        }
    }*/

    render(){
        var { User } = this.state;
        //console.log(resource);
        return (
            <div className="row">
                <div className="col-12">
                    <div className="card card-body pt-3 pb-5">
                        <div className="row py-1">
                            <div className="col-md-7">
                                <h2 data-resource-id={User.id} className="mb-0">
                                    {User.fields.DisplayName||User.fields.Username} 
                                </h2>
                                {(auth && auth.currentUser && (User.fields.Email===auth.currentUser.email))?<h5>That's Me!</h5>:''}
                                <p className="lead">
                                {User.fields.Short}
                                </p>
                            </div>
                            <div className="col-md-5 text-right">
                                <img src={User.fields.ProfileImgUrl} className="float-right img-fluid" alt={User.fields.Username} title={User.fields.Username} style={{height:"50px"}} />
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-md-9">
                                <h4>Votes</h4>
                                {User.fields.Votes && User.fields.Votes.length>0?(
                                <div className="row py-1">
                                    <div className="col-12 pt-2">
                                        <Link to="/" />
                                    </div>
                                </div>
                                ):(<p className="lead">(No Votes Yet) <span role="img" aria-labelledby="Hmmm...">🤔</span></p>)}  
                            </div>
                            <div className="col-md-3 text-right">
                                <table className="table table-striped table-hover bg-light">
                                    <tbody>
                                    <tr>
                                        <td>Last Seen:</td>
                                        <td>{User.fields.LastSignOn ? new Date(User.fields.LastSignOn).toLocaleDateString():''}</td>
                                    </tr>
                                    <tr>
                                        <td>Joined:</td>
                                        <td>{User.fields.Created ? new Date(User.fields.Created).toLocaleDateString():''}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;

