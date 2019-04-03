import React from 'react';

class NotFound extends React.Component{
    render(){
        return (
            <div>
                <h1>404 - Not Found</h1>
                <p className="lead">
                Oh, no! That URL couldn't be found <span aria-label="ghosty in the machine" role="img">👻</span>. Try starting over at <a href="./">home</a>.
                </p>
            </div>
        );
    }
}

export default NotFound;
