import React from "react";

function capitalize(string) {
    return string[0].toUpperCase() + string.substr(1);
}

export class ButtonTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            tabs: props.tabs
        }

        this.onChange = props.onChangeTab;

    }

    render() {
        return (
            <div className="tabs-block">
                {this.state.tabs.map((el, i) => <button onClick={ () => this.onChange(el) } key={ i }>{capitalize(el)}</button>)}
            </div>
        )
    }
}