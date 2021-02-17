import React from 'react';

export default class Tab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let token = this.props.token !== '' ? <h1 className="form-title">Your token: {this.props.token}</h1> : '';
		let downloadButton = this.props.fileList.length === 0 ?
			<button className="form-btn" onClick={this.props.getFilenames}>Check Available</button>
			: <div className="available">
					<h1 className="form-title">Available:</h1>
					<ul id="file-list">
						{this.props.fileList.map(el => 
							<li>
								<a download={el} onClick = {this.props.download}>{el}</a>
							</li>
						)}
					</ul>
					<button className="form-btn" onClick={this.props.download}>Download All</button>
				</div>;
	
		let uploadTab = <div className="upload tab">
											<input id="files" type="file" value = { this.props.value } onChange = { this.props.change } multiple></input>
											{ token }
											<h1 className="form-title">Chosen:</h1>
											<ul id="file-list">
												{ this.props.chosen.map((el, index) => <li key={index}>{ el }</li>) }
											</ul>
											<div className="buttons">
												<label className="input-btn form-btn" htmlFor="files">Choose files</label>
												<button className="form-btn" onClick = { this.props.upload }>Upload</button>
											</div>
										</div>;
	
		let downloadTab = <div className="download tab">
												<h1 className="form-title">Enter Token</h1>
												<input id="token" type="text" value = { this.props.input } onChange = {this.props.tokenInputChange}/>
												{downloadButton}
											</div>;
	
		return  <div className="tabulator">
							{this.props.tab === 'upload' ? uploadTab : downloadTab}
						</div>
	}
}