import { Book } from "./Book.js";
import React from "react";

export class DisplayBooks extends React.Component {

	constructor(props) {
		super(props);
		this.client = props.client;

		this.state = {
			lib_data: null,
		}
	}

	componentDidMount() {
		this.getLibrary()
	}

	async getLibrary() {
		this.client.get("books").then(data => {
			this.setState({
				lib_data: data
			})
		})
	}

	render() {
		return (
			<div className='books-block'>
				{
					this.state.lib_data ?
					this.state.lib_data.map((el, i) => <Book
						key={i} 
						bookData={el}
						client={this.client}
						/>) : null
				}
			</div>
			
		)
	}

} 