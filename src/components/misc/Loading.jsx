import React from 'react';

class Loading extends React.Component{

    render(){
        return (
            global.appConfig.HtmlLoading?(
            <div dangerouslySetInnerHTML={{__html: global.appConfig.HtmlLoading}} />):(
            <p className="lead text-center">...<span role="img" aria-label="loading">🚀</span>...</p>
            )
        );
    }
}

export default Loading;