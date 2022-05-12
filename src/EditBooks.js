import React from "react";

import { generateId } from "./generateId.js";

export class EditBooks extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			books: null,
			authors: null,
			publishings: null
		}

		this.onSave = props.handleSave;
		this.client = props.client;
	}

	componentDidMount() {
		this.getEditorData();
	}

	async getEditorData() {
		const booksData = await this.client.get('books');
		const authsData = await this.client.get('authors');
		const publsData = await this.client.get('publishings');

		this.setState({
			books: booksData,
			authors: authsData,
			publishings: publsData
		})
	}

	delete(id) {
		const books = [ ...this.state.books ].filter((_, i) => i !== id);
		this.setState({
			books: books
		})
	}

	add() {
		const books = [ ...this.state.books ];
		const newBook = {
			name: "New book...",
			author: "authors?id="+this.state.authors[0].id,
			id: generateId(),
			publishing: "publishings?id="+this.state.publishings[0].id,
			year: 2000,
			illustration: "no-photo.png"
		}
		books.push(newBook);
		this.setState({
			books: books
		})
	}

	handleChange(field, name, id) {
		let books = [ ...this.state.books ];
		books[id][field] = name;
		this.setState({
			books: books
		})
		console.log(books)
	}

	render() {
		return (
			<div className='edit-books'>
				{
					this.state.books !== null ?
					this.state.books.map((el, i) => (
						<div key={ i }>
							<input type='text' value={el.name} onChange={ e => this.handleChange('name', e.target.value, i) }/>
							<select onChange={e => {
								const selectedId = e.target.selectedIndex;
								this.handleChange("author", "authors?id="+this.state.authors[selectedId].id, i)
							}}>
								{
									this.state.authors.map((auth, id) => (
										<option 
											value={ "authors?id="+auth.id } 
											selected={el.author === "authors?id="+auth.id ? 1: 0} 
											key={ id }>{auth.name}</option>
									)) 
								}
							</select>
							<select onChange={ e => {
								const selectedId = e.target.selectedIndex;
								this.handleChange("publishing", "publishings?id="+this.state.publishings[selectedId].id, i)
							}}>
							{
									this.state.publishings.map((pub, id) => (
										<option 
											value={ "publishings?id="+pub.id } 
											selected={el.publishing === "publishings?id="+pub.id ? 1: 0} 
											key={ id }>{pub.name}</option>
									)) 
								}
							</select>
							<input type='number' value={el.year} onChange={ e => this.handleChange('year', e.target.value, i) }/>
							<span>Photo input</span>
							<button onClick={ () => this.delete(i) }>Delete</button>
						</div>
					)) : null
				}
				{
					this.state.books ? 
					<div>
						<button onClick={ () => this.add() }>Add new</button>
						<button onClick={ () => this.onSave(this.state.books, 'books') }>Save</button>
					</div> : null
				}
				<div>Важно: выбираемая иллюстрация к книге должна находиться в папке illustrations</div>
			</div>
		)
	}

}