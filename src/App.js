import './App.css';
import React from "react";
import { JSONClient } from './JSONClient.js';
import { tab } from '@testing-library/user-event/dist/tab';

Object.prototype.deleteItem = function(key) {
	let newObject = {...this}
	delete newObject[key];
	return newObject;
}

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
					<EditLibrary client={ this.client }/> : 
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

		this.client = props.client;

		this.state = {
			showing: "authors",
			authors: null,
			publishings: null,
			books: null
		}

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.getAuthors();
		this.getPublishings();
		this.getBooks();
	}

	async getAuthors() {
		this.client.get('authors').then(data => {
			this.setState({
				authors: data
			})
		})
	}

	async getPublishings() {
		this.client.get('publishings').then(data => {
			this.setState({
				publishings: data
			})
		})
	}

	async getBooks() {
		this.client.get('books').then(data => {
			this.setState({
				books: data
			})
		})
	}

	async deleteAll(data, table) {
		for (const el of data) {
			const req = table+"/"+el.id;
			await this.client.delete(req);
		}
	} 

	async pushData(data, table) {
		for (const el of data) {
			const req = table+"?id="+el.id;
			this.client.put(req, el);
		}
	}

	handleSubmit(data, table) {
		this.deleteAll(this.state[table], table)
			.then(() => this.pushData(data, table))
			.then(() => window.location = window.location)
	}

	setShowing(show) {
		this.setState({
			showing: show
		});
		console.log("uppdated")
	}

	render() {
		return (
			this.state.authors && this.state.publishings && this.state.books ?
			<div className="edit-books">
				<div id='edit-lib--buttons'>
					<button onClick={() => this.state.showing !== 'authors' ? this.setShowing("authors"): false}>Auhtors</button>
					<button onClick={() => this.state.showing !== 'publishings' ? this.setShowing("publishings"): false}>Publishings</button>
					<button onClick={() => this.state.showing !== 'books' ? this.setShowing("books"): false}>Books</button>
				</div>
				{this.state.showing === 'authors' ? <EditAuthors data={ this.state.authors } submit={ this.handleSubmit }/>:
				this.state.showing === 'publishings' ? <EditPublishings data={ this.state.publishings } submit={ this.handleSubmit }/>:
				<EditBooks data={ this.state.books } submit={ this.handleSubmit }/>}
			</div> : null
		)
	}

}

class EditAuthors extends React.Component {

	constructor(props) {
		super(props);

		this.handleSubmit = props.submit;

		this.state = {
			authors: {
				...props.data
			}
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(key, newAuthor, id) {
		let newState = {...this.state.authors};
		newState[key] = {
			name: newAuthor,
			id: id
		};
		this.setState({
			authors: newState,
		})
		console.log(this.state)
	}

	parseData() {
		let data = [];

		for (let key in this.state.authors) {
			let author = this.state.authors[key];
			data.push(author);
		}
		data.pop()

		return data;
	}

	delete(key) {
		let newState = {...this.state.authors};
		delete newState[key];
		this.setState({
			authors: newState
		})
	}

	add() {
		const name = "New Author...";
		const id = generateId();
		const state = {...this.state.authors};
		const keys = Object.keys(state).map(el => +el)
		const last = Math.max(...keys)
		state[last+1] = {
			name: name,
			id: id
		}
		this.setState({
			authors: state
		})
	}

	render() {
		return (
			<div>
				{Object.keys(this.state.authors).map((key, i) => (
					<div key={ i }>
						<input
							type='text'
							value={ this.state.authors[key].name || "Error..." }
							name={ this.state.authors[key].id }
							onChange={ (e) => this.handleChange(key, e.target.value, this.state.authors[key].id)}/>
							<button onClick={ (e) => this.delete(key) }>Delete</button>
					</div>
				))}
				<button onClick={ () => this.add() }>Add</button>
				<button onClick={ (e) => { e.preventDefault(); this.handleSubmit(this.parseData(), 'authors') } }>Save</button>
			</div>
		)
	}

}

class EditPublishings extends React.Component {

	constructor(props) {
		super(props);

		this.handleSubmit = props.submit;

		this.state = {
			publishings: {
				...props.data
			}
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(key, newPublishing, id) {
		let newState = {...this.state.publishings};
		newState[key] = {
			name: newPublishing,
			id: id
		};
		this.setState({
			publishings: newState,
		})
		console.log(this.state)
	}

	parseData() {
		let data = [];

		for (let key in this.state.publishings) {
			let publishing = this.state.publishings[key];
			data.push(publishing);
		}

		data.pop()

		return data;
	}

	delete(key) {
		let newState = {...this.state.publishings};
		delete newState[key];
		this.setState({
			publishings: newState
		})
	}

	add() {
		const name = "New Publishing...";
		const id = generateId();
		const state = {...this.state.publishings};
		const keys = Object.keys(state).map(el => +el)
		const last = Math.max(...keys)
		state[last+1] = {
			name: name,
			id: id
		}
		this.setState({
			publishings: state
		})
	}

	render() {
		return (
			<div>
				{Object.keys(this.state.publishings).map((key, i) => (
					<div key={ i }>
						<input
							type='text'
							value={ this.state.publishings[key].name || "Publishing" }
							
							name={ this.state.publishings[key].id }
							onChange={ (e) => this.handleChange(key, e.target.value, this.state.publishings[key].id)}/>
							<button onClick={ (e) => this.delete(key) }>Delete</button>
					</div>
				))}
				<button onClick={ () => this.add() }>Add</button>
				<button onClick={ (e) => { e.preventDefault(); this.handleSubmit(this.parseData(), 'publishings') } }>Save</button>
			</div>
		)
	}

}

class EditBooks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className='edit-books'>Books</div>
	}

}

export default App;
