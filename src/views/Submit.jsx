import React from 'react';
import airtable from '../airtable';
import jquery from 'jquery';
import { ModalThanks } from '../components';

class Submit extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { categories: [], form: {}, email: localStorage.getItem('email')||null };
        this.fetchCategories = this.fetchCategories.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.modalThanks = React.createRef();
    }
    
    onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        var form = event.target;
        
        if (form[0].checkValidity() === false) {
            jquery(form).addClass('was-validated');
        }
        else {
            const formData = new FormData(event.target);
            
            // convert formData to json obj
            var object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            
            // convert selected category to array
            object["Category"] = [object["Category"]];
            
            this.createResource({fields:object});
        }
    }
    
    async componentDidMount() {
        await this.fetchCategories();
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
    
    async createResource(obj) {
        var resp = await fetch(airtable.createRecord("Resource",obj)).catch(err => {console.log(err)})
        //console.log(resp);
        if(resp.status >= 200 && resp.status < 300) {
            //console.log("createResource",resp);
            this.showModal();
        }
    }
    
    showModal(){
        //console.log(ModalThanks);
        this.modalThanks.current.show();
    }
    
    render(){
        var {categories} = this.state;
        return (
            <div>
                <h2 className="text-center">{global.appConfig.LblSuggestHeading}</h2>
                <p className="lead w-75 mx-auto text-center">
                    {global.appConfig.LblSuggestSubHeading}
                </p>
                <form className="row py-2" noValidate="" onSubmit={this.onSubmit} name="formSubmit">
                    <div className="col-xl-8 col-lg-10 col-12 mx-auto">
                        <div className="form-group">
                            <label htmlFor="input2">Email</label>
                            <input type="email" className="form-control form-control-lg" id="input2" 
                                name="SubmittedBy" placeholder="Email" required="required" defaultValue={this.state.email||''} />
                            <div className="invalid-feedback">Oops, you missed this one.</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Link</label>
                            <input type="url" className="form-control form-control-lg" id="input3" name="URL" placeholder="http://"
                                required="required" />
                            <div className="invalid-feedback">Oops, you missed this one.</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input4">Title</label>
                            <input type="text" className="form-control form-control-lg" id="input4" name="Name" placeholder="Title"
                                required="required" maxLength="50"
                                value={this.state.form.Title}
                            />
                            <div className="invalid-feedback">Oops, you missed this one.</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input5">Tagline (up to 8 words)</label>
                            <input type="text" className="form-control form-control-lg" id="input5" name="Short" placeholder="Describe this in a few words" 
                                required="required" maxLength="100"
                                value={this.state.form.Short}
                            />
                            <div className="invalid-feedback">Oops, you missed this one.</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input6">Full Description</label>
                            <textarea className="form-control form-control-lg" name="Full" id="input6" value={this.state.form.Full}></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input7">Category</label>
                            <select className="form-control form-control-lg" name="Category" id="input7" required value={this.state.form.Category}>
                                {categories && categories.length > 0 ? categories.map((cat,key) =>
                                (
                                <option value={cat.id} key={key}>{cat.fields.Name}</option>
                                )):''}
                            </select>
                            <div className="invalid-feedback">Oops, you missed this one.</div>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-success btn-lg float-right">Submit</button>
                        </div>
                    </div>
                </form>
                <ModalThanks ref={this.modalThanks} />
            </div>
        );
    }
}

export default Submit;
