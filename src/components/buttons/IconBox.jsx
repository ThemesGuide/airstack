import React from 'react';
import jquery from 'jquery';

class IconBox extends React.Component{
    
    boxStyle = (global.appConfig.StyleIconBox)?JSON.parse(global.appConfig.StyleIconBox):{
        fontSize: "3em",
        margin: "0 auto",
        transform: "rotate(-45deg)",
        position: "relative",
        width: "2em",
        height: "2em",
        color: "#ffffff",
        borderRadius: "12%"
    }

    layerStyle = (global.appConfig.StyleIconBoxLayer)?JSON.parse(global.appConfig.StyleIconBoxLayer):{
        transform: "rotate(45deg)"
    }

    render(){
        var colorPrimary = jquery('<div class="bg-primary"></div>').appendTo('body').css("backgroundColor");
        var colorTrans = colorPrimary.replace("rgb","rgba").replace(")",",0.75)");
        var bg = {backgroundColor:colorPrimary};
        
        if (global.appConfig.EnableGradients) {
            bg = {background:"linear-gradient(to bottom, "+colorTrans+", "+colorPrimary+")"};
        }
        
        return (
            <div className="d-flex align-items-center justify-content-center shadow" style={{...this.boxStyle,...bg}}>
              <div style={this.layerStyle}>
                  {this.props.symbol}
              </div>
          </div>
        );
    }
}

export default IconBox;