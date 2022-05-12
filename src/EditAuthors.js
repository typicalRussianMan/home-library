import React from "react";

import { generateId } from "./generateId.js";
import { haveRelations } from "./haveRelations.js";

export class EditAuthors extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			authors: null,
			books: null
		}

		this.onSave = props.handleSave;
		this.client = props.client;
	}

	componentDidMount() {
		this.getEditorData();
	}

	async getEditorData() {
		const authsData = await this.client.get('authors');
		const booksData = await this.client.get('books');

		this.setState({
			authors: authsData,
			books: booksData
		})
	}

	handleChange(name, id, i) {
		let authors = [ ...this.state.authors ];
		authors[i] = {name: name, id: id};
		this.setState({
			authors: authors
		});
	}

	delete(id) {
		if (haveRelations(this.state.books,"authors?id="+this.state.authors[id].id, 'author')) {
			alert("Удаляемое значение используется в книгах")
			return false
		}
		const authors = [ ...this.state.authors ].filter((_, i) => i !== id);

		this.setState({
			authors: authors
		})
	}

	add() {
		const authors = [ ...this.state.authors ]
		const newAuthor = {
			id: generateId(),
			name: "New author..."
		}
		authors.push(newAuthor)
		this.setState({
			authors: authors
		})
	}

	render() {
		return (
			<div className='edit-authors'>
				{
					this.state.authors !== null ? 
					this.state.authors.map((el, i) => (
						<div key={ i }>
							<input type='text' value={el.name} onChange={e =>  this.handleChange(e.target.value, el.id, i) }/>
							<button onClick={ () => this.delete(i) }>Delete</button>
						</div>
					)): null
				}
				{
					this.state.authors ? 
					<div>
						<button onClick={ () => this.add() }>Add new</button>
						<button onClick={ () => this.onSave(this.state.authors, 'authors') }>Save</button>
					</div> : null
				}
			</div>
		)
	}

}