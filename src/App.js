import './App.css';
import React from "react";
import { JSONClient } from './JSONClient.js';

function generateId() {
	const symbols = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789".split("");
	let id = symbols.sort((a, b) => Math.random() - 0.5);
	id.length = 18;
	return id.join("");
}

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			is_edit_showing: false
		}

		this.client = new JSONClient("http://localhost:8888");
		
	}

	

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
					<EditLibrary/> : 
					<DisplayBooks client={ this.client }/>				
				}
				<button onClick={() => this.toggleEdit()}>
					{this.state.is_edit_showing ? "Закрыть редактор" : "Открыть редактор"}
				</button>
			</div>
			
		)
	}

}

class DisplayBooks extends React.Component {

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
			this.state.lib_data ?
			this.state.lib_data.map((el, i) => <Book
				key={i} 
				bookData={el}
				client={this.client}
				/>) : null
		)
	}

}

class Book extends React.Component {

	constructor(props) {
		super(props);

		this.client = props.client;

		this.state = {
			name: props.bookData.name,
			author: props.bookData.author,
			publishing: props.bookData.publishing,
			year: props.bookData.year,
			illustration: props.bookData.illustration,
			is_get_author: false,
			is_get_publishing: false
		}

	}

	componentDidMount() {
		this.client.get(this.state.author).then(author => {
			this.setState({
				author: author[0].name,
				is_get_author: true
			})
		})

		this.client.get(this.state.publishing).then(publishing => {
			this.setState({
				publishing: publishing[0].name,
				is_get_publishing: true
			})
		})
	}

	render() {
		return (
			<div className='book'>
				<div className="book-illustration">
					<img src={require(`./illustrations/${this.state.illustration}`)} alt="Book Illustration" width="150"/>
				</div>
				<div className="book-info">
					<div>{ "Name: "+this.state.name }</div>
					<div>{ "Author: "+(this.state.is_get_author ? this.state.author : "" )}</div>
					<div>{ "Publishing: "+ (this.state.is_get_publishing ? this.state.publishing : "") }</div>
					<div>{ "Year: "+this.state.year }</div>
				</div>
				
			</div>
		)
	}

}

class EditLibrary extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="edit-books">
				<EditAuthors/>
				<EditPublishings/>
				<EditBooks/>
			</div>
		)
	}

}

class EditAuthors extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className='edit-authors'></div>
	}

}

class EditPublishings extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className='edit-publishings'></div>
	}

}

class EditBooks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className='edit-books'></div>
	}

}

export default App;
