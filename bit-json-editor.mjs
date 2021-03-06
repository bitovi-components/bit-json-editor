import {
	Reflect as canReflect,
	StacheElement,
	type
} from "//unpkg.com/can@pre/core.mjs";

var style = document.createElement("style");
style.innerHTML = `
	bit-json-editor {
		display: block;
		background-color: #efefef;
		position: relative;
		border: solid 1px;
		background-color: white;
		padding: 0px;
	}
	bit-json-editor textarea {
		width: 100%;
		height: 100%;
		background-color: unset;
		position: relative;
		border: none;
		resize: none;
	}
	bit-json-editor .error {
		color: white;
		position: absolute;
		font-family: monospace;
	}
	bit-json-editor .error,
	bit-json-editor textarea {
		font-family: monospace;
		font-size: 18px;
		padding: 2px;
		margin: 0px;
	}
	bit-json-editor .error span {
		color: red;
	}
`;

document.body.appendChild(style);

var numberRegexp = /\d+/;

var getPosition = function(err) {
	var matches = err.message.match(numberRegexp);
	if (matches) {
		return +matches[0];
	}
};

export default class BitJsonEditor extends StacheElement {
	static view = `
		<pre class="error">{{{ this.jsonBackground }}}</pre>
		<textarea 
			value:from="this.json"
			on:change="this.updateData(scope.element.value)"
			on:input="this.checkJSON(scope.element.value)"
		></textarea>
	`;

	static props = {
		data: type.Any,
		jsonBackground: String,

		get json() {
			if (this.data) {
				var serialized = canReflect.serialize(this.data);

				return JSON.stringify(serialized, null, " ");
			} else {
				return "";
			}
		}
	};

	checkJSON(json) {
		try {
			JSON.parse(json);
			this.jsonBackground = "";
		} catch (e) {
			var pos = getPosition(e);
			if (pos !== undefined) {
				this.jsonBackground =
					json.slice(0, pos) + "<span>_</span>" + json.slice(pos + 1);
			} else {
				this.jsonBackground = json.slice(0, json.length - 1) + "<span>_</span>";
			}
		}
	}

	updateData(json) {
		if (json) {
			canReflect.update(this.data, JSON.parse(json));
		}
	}
}

customElements.define("bit-json-editor", BitJsonEditor);
