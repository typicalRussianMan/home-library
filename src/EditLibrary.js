import React from "react";

import { EditAuthors } from "./EditAuthors.js";
import { EditPublishings } from "./EditPublishings.js";
import { EditBooks } from "./EditBooks.js";
import { ButtonTabs } from "./ButtonTabs.js";

export class EditLibrary extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			openedTab: "authors"
		}
		
		this.client = props.client;

		this.openTab = this.openTab.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	openTab(newTab) {
		if (this.state.openedTab === newTab) return;
		this.setState({
			openedTab: newTab
		})
	}

	parseArrToObj(arr) {
		let obj = {};

		for (const el of arr) {
			obj[el.id] = el;
		}

		return obj;
	}

	async handleSave(data, table) {
		this.setState({
			openedTab: 0
		})

		const tableData = await this.client.get(table);
		for (const el of tableData) {
			await this.client.delete(table+"/"+el.id);
		}

		for (const reqBody of data) {
			await this.client.put(table, reqBody)
		}

		this.setState({
			openedTab: table
		})
	}

	render() {
		return (
			<div className="edit-books">
				<ButtonTabs tabs={ ['authors', 'publishings', 'books'] } onChangeTab={ this.openTab }/>
				{
					this.state.openedTab === 'authors' ?
					<EditAuthors client={ this.client } handleSave={ this.handleSave }/> :
					this.state.openedTab === 'publishings' ?
					<EditPublishings client={ this.client } handleSave={ this.handleSave }/> : 
					this.state.openedTab === "books" ?
					<EditBooks client={ this.client } handleSave={ this.handleSave }/> : null
				}
			</div>
		)
	}

}