import React from "react";

export class Book extends React.Component {

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
					<img className="book-ill-img" src={require(`../illustrations/${this.state.illustration}`)} alt="Book Illustration" width="200"/>
				</div>
				<div className="book-info">
					<div>{ "Name: "+this.state.name }</div>
					<div>{ "Author: "+(this.state.is_get_author ? this.state.author : "" )}</div>
					<div>{ "Publishing: "+ (this.state.is_get_publishing ? this.state.publishing : "") }</div>
					<div>{ "Publication year: "+this.state.year }</div>
				</div>
				
			</div>
		)
	}

}