import { Dashboards, Categories, Category, Resources, Resource, Tag, Submit, User, NotFound } from '../views';
import airtable from '../airtable';

// the showInNav:true routes are used to build the navbar links
var routes = [
    { path: "/", name: "Home", component: Dashboards['Home'], showInNav: false },
    { path: "/c", name: "Categories", component: Categories, renderProps:{colSize:'col-md-4 col-sm-6'}, showInNav: true },
    { path: "/c/:id", name: "Category", component: Category },
    { path: "/cn/:name", name: "Category", component: Category },
    { path: "/r", name: "Resources", component: Resources, showInNav: true, renderProps:{perPage:6} },
    { path: "/r/:id", name: "Resource", component: Resource },
    { path: "/rn/:name", name: "Resource", component: Resource },
    { path: "/t/:tag", name: "Tag", component: Tag },
    { path: "/submit", name: "Suggest", component: Submit, showInNav: true },
    
    // optional routes
    { path: "/u/:username", name: "User", component: User, showInNav: false },
    
    // just for demo of different dashboard homepages
    { path: "/home", name: "Home", component: Dashboards['Home'], showInNav: false },
    { path: "/home1", name: "Home", component: Dashboards['Home1'], showInNav: false },
    { path: "/home2", name: "Home", component: Dashboards['Home2'], showInNav: false },
    { path: "/home3", name: "Home", component: Dashboards['Home3'], showInNav: false },
    { path: "/home4", name: "Home", component: Dashboards['Home4'], showInNav: false },
    { path: "/home5", name: "Home", component: Dashboards['Home5'], showInNav: false },
    
    { path: "/*", name: "NotFound", component: NotFound}
];

async function fetchAppConfig() {
    // get active App config
    var resp = await fetch(airtable.findRecordsByBoolean("App","Active",1)).catch(err => {console.log(err)})
    if(resp.status >= 200 && resp.status < 300) {
        var json = await resp.json();
        const appConf = json.records[0].fields;
        //console.log(appConf);
        
        // update route properties with available App config data for corresponding link text 
        routes.filter((prop,key) => {return prop.name==="Home"})[0].component = Dashboards[appConf.HomeLayout];
        routes.filter((prop,key) => {return prop.name==="Categories"})[0].name = appConf.LblCategories;
        routes.filter((prop,key) => {return prop.name==="Category"})[0].name = appConf.LblCategory;
        routes.filter((prop,key) => {return prop.name==="Resources"})[0].name = appConf.LblResources;
        routes.filter((prop,key) => {return prop.name==="Resource"})[0].name =  appConf.LblResource;
        routes.filter((prop,key) => {return prop.name==="Suggest"})[0].name = appConf.LblSuggest;
    }
}

fetchAppConfig();

export {
    routes
};
