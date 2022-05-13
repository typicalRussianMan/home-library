import './App.css';
import React from "react";
import { JSONClient } from './JSONClient.js';

import { DisplayBooks } from './components/DisplayBooks.js';
import { EditLibrary } from "./components/EditLibrary.js";


/**
 * Application initialization
 */
class App extends React.Component {

	constructor() {
		super();

		/**
		 * is_edit_showing - switch between editor and display block
		 */
		this.state = {
			is_edit_showing: false
		}

		this.client = new JSONClient("http://localhost:8888");
		
	}

	/**
	 * function for switching between EditLibrary and DisplayBooks
	 */
	toggleEdit() {
		const is_edit_showing = this.state.is_edit_showing
		this.setState({
			is_edit_showing: !is_edit_showing
		})
	}

	render() {
		return (
			<div>
				{
					this.state.is_edit_showing ? 
					<EditLibrary client={ this.client }/> : 
					<DisplayBooks client={ this.client }/>				
				}
				<button className='toggle-edit-button' onClick={() => this.toggleEdit()}>
					{this.state.is_edit_showing ? "Close editor" : "Open editor"}
				</button>
			</div>
			
		)
	}

}

export default App; 