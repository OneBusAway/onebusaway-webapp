/**
 * Create a keybinding for an HTML element.
 * @example
 *  <button use:keybinding={{code: 'Escape'}} on:click={yourEventHere}>
 *    Triggers a click on the button when the Escape key is pressed.
 *  </button>
 * @param {HTMLElement} node The HTML element to bind to.
 * @param {Object} params The keybinding parameters. See the example above.
 * @returns {Object} An object with the update and destroy methods.
 */
export const keybinding = (node, params) => {
	let handler;
	const removeHandler = () => window.removeEventListener('keydown', handler);
	const setHandler = () => {
		removeHandler();
		if (!params) {
			return;
		}

		handler = (e) => {
			if (
				!!params.alt != e.altKey ||
				!!params.shift != e.shiftKey ||
				!!params.control != (e.ctrlKey || e.metaKey) ||
				params.code != e.code
			)
				return;
			e.preventDefault();
			params.callback ? params.callback() : node.click();
		};
		window.addEventListener('keydown', handler);
	};

	setHandler();

	return {
		update: setHandler,
		destroy: removeHandler
	};
};
