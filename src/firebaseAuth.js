import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import airtable from './airtable';
import { fixDisplayName } from './helpers';
const env = require("./env");

const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAiN,
    databaseURL: env.FIREBASE_DATABASE_URL,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: env.FIREBASE_MESSAGINGSENDERID
};

firebase.initializeApp(firebaseConfig);

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
export const auth = firebase.auth();

export default class firebaseAuth extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {user:null,profile:null};
        this.loginGoogle = this.loginGoogle.bind(this);
        this.loginTwitter = this.loginTwitter.bind(this);
        this.logout = this.logout.bind(this);
    }
    
    componentDidMount() {
        var _self = this;
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user mounted",user);
                _self.setState({user});
                
                var email = user.email||user.providerData[0].email;
                if (user.email) {
                    _self.fetchUserProfile(email,function(profile){
                        _self.setSession(user,profile);
                        
                        var storedUser = {
                            fields: {
                                ProfileImgUrl: user.photoURL || user.providerData[0].photoURL,
                            }
                        };
                        _self.updateUser(profile.id,storedUser); 
                        
                        console.log(user.photoURL);
                        
                    });
                }
                else {
                    console.log("Error: User email not found!");
                }
            }
        });
    }
    
    logout() {
      auth.signOut()
        .then(() => {
          this.setState({user:null});
          localStorage.clear();
        });
    }
    
    loginGoogle() {
      auth.signInWithPopup(googleAuthProvider) 
        .then((result) => {
            const user = result.user;
            console.log("login",user);
            this.setState({user});
            
            // createOrUpdate User in Airtable
            var storedUser = {
                fields: {
                    Username: (fixDisplayName(user.displayName) || (user.email || user.providerData[0].email)),
                    DisplayName: (user.displayName || "A User"),
                    Email: (user.email || user.providerData[0].email),
                    ProfileImgUrl:  (user.photoUrl || user.providerData[0].photoUrl),
                    SignOnMethods: ["Google"],
                    LastSignOn: new Date()
                }
            };
            
            this.createUser(storedUser); 
        });
    }
    
    loginTwitter() {
      auth.signInWithPopup(twitterAuthProvider) 
        .then((result) => {
            const user = result.user;
            console.log("login",user);
            this.setState({user});
            
            /*
            if (result.credential) {
                // For accessing the Twitter API.
                //var token = result.credential.accessToken;
                //var secret = result.credential.secret;
                console.log(result.credential);
            }*/
          
            // createOrUpdate User in Airtable
            var storedUser = {
                fields: {
                    Username: (fixDisplayName(user.displayName) || (user.email || user.providerData[0].email)),
                    DisplayName: (user.displayName || "A User"),
                    Email: (user.email || user.providerData[0].email),
                    ProfileImgUrl:  (user.photoUrl || user.providerData[0].photoUrl),
                    SignOnMethods: ["Twitter"],
                    LastSignOn: new Date()
                }
            };
            this.createUser(storedUser); 
        });
    }
    
    async createUser(obj) {
        await fetch(await airtable.createOrUpdateRecord("Users",obj)).catch(err => {console.log(err)})
    }
    
    async updateUser(id,obj) {
        await fetch(await airtable.updateRecord("Users",id,obj)).catch(err => {console.log(err)})
    }
    
    async fetchUserProfile(email,cb) {
        //console.log(id);
        var resp = await fetch(airtable.findRecords("Users","Email",email,"Visible")).catch(err => {console.log(err)})
        if(resp.status >= 200 && resp.status < 300) {
            var Matches = await resp.json();
            if (Matches && Matches.records && Matches.records.length>0) {
                var profile = Matches.records[0];
                this.setState({ profile });
                cb(profile);
            }
            else {
                console.log("Error: User profile not found!");
            }
        }
    }
    
    setSession(user,profile) {
        localStorage.setItem('displayName',user.displayName||'Mysterious');
        localStorage.setItem('email', user.email||user.providerData[0].email);
        localStorage.setItem('profile', JSON.stringify(profile));
    }
    
    render(){
        return (
            this.state.user && this.state.profile ? 
                <div className={'btn-group ' + this.props.className}>
                    <button type="button" className="btn btn-light dropdown-toggle" data-toggle="dropdown">{this.state.user.displayName}</button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" to={'/u/' + this.state.profile.fields.Username}>Profile</Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/" onClick={this.logout}>Logout</Link>
                    </div>
                </div>:
                <div className={'btn-group ' + this.props.className}>
                    <button className="btn btn-outline-light border-right-0" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Login
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <a className="dropdown-item" onClick={this.loginTwitter}>Twitter</a>
                        <a className="dropdown-item" onClick={this.loginTwitter}>Google</a>
                    </div>
                    <button title="Login with Twitter" className="btn btn-outline-light" onClick={this.loginTwitter}><span className="fab fa-twitter fa-lg align-middle"></span></button>
                    <button title="Login with Google" className="btn btn-outline-light" onClick={this.loginGoogle}><span className="fab fa-google fa-lg align-middle"></span></button>
                </div>
        );
    }

}



