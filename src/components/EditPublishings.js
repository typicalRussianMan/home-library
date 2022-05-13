import React from "react";

import { generateId } from "./generateId.js";
import { haveRelations } from "./haveRelations.js";

export class EditPublishings extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			publishings: null,
			books: null
		}

		this.onSave = props.handleSave;
		this.client = props.client;
	}

	componentDidMount() {
		this.getEditorData();
	}

	async getEditorData() {
		const publsData = await this.client.get('publishings');
		const booksData = await this.client.get('books');

		this.setState({
			publishings: publsData,
			books: booksData
		})
	}

	handleChange(name, id ,i) {
		let publishings = [ ...this.state.publishings ];
		publishings[i] = {name: name, id: id};
		this.setState({
			publishings: publishings
		});
	}

	delete(id) {
		if (haveRelations(this.state.books,"publishings?id="+this.state.publishings[id].id, 'publishing')) {
			alert("Удаляемое значение используется в книгах")
			return false
		}
		const publishings = [ ...this.state.publishings ].filter((_, i) => i !== id);
		
		this.setState({
			publishings: publishings
		})
	}

	add() {
		const publishings = [ ...this.state.publishings ]
		const newPublishing = {
			id: generateId(),
			name: "New pub..."
		}
		publishings.push(newPublishing)
		this.setState({
			publishings: publishings
		})
	}

	render() {
		return (
			<div className='edit'>
				<h3>Publishings list</h3>
				{
					this.state.publishings !== null ? 
					this.state.publishings.map((el, i) => (
						<div key={ i } className="edit-component">
							<div className="edit-item">
								<input type='text' value={el.name} onChange={e =>  this.handleChange(e.target.value, el.id, i) }/>
							</div>
							<button className="delete-button" onClick={ () => this.delete(i) }>X</button>
						</div>
					)): null
				}
				{
					this.state.publishings ? 
					<div className="edit-control">
						<button onClick={ () => this.add() } className="add">Add puslishing</button>
						<button onClick={ () => this.onSave(this.state.publishings, 'publishings') }className="save">Save</button>
					</div> : null
				}
			</div>
		)
	}

}