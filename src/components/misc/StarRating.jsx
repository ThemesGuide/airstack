import React from 'react';

class StarRating extends React.Component{

    render(){
        return (
            <p className="mx-2" title="Editor's Rating">
            {this.props.rating} {[...Array((this.props.max||5))].map((e,i) => 
                (<span key={i} className={'mr-1 ' + (i<=this.props.rating-1?'fa fa-star text-warning':'fa fa-star-outline')}></span>))}
            </p>
        );
    }
}

export default StarRating;