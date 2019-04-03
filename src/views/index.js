
import CatsAndResources from './CatsAndResources';

import Categories from './category/List';
import Category from './category/Detail';

import Resources from './resource/List';
import Resource from './resource/Detail';
import ByCategoryId from './resource/ByCategoryId';
import Card from './resource/Card';
import Featured from './resource/Featured';

import Tag from './Tag';
import Submit from './Submit';
import NotFound from './NotFound';

// optional
import User from './user/Detail';

let Dashboards = {};
Dashboards['Home'] = require('./dashboards/Home').default;
Dashboards['Home1'] = require('./dashboards/Home1').default;
Dashboards['Home2'] = require('./dashboards/Home2').default;
Dashboards['Home3'] = require('./dashboards/Home3').default;
Dashboards['Home4'] = require('./dashboards/Home4').default;
Dashboards['Home5'] = require('./dashboards/Home5').default;

export {
    Dashboards,
    CatsAndResources,
    Categories,
    Category,
    Resources,
    Resource,
    ByCategoryId,
    Card,
    Featured,
    Tag,
    Submit,
    User,
    NotFound
};