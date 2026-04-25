export type ViewStateResult = any;
export type WorkspaceLeaf = any;

export interface App {
	workspace: { requestSaveLayout: () => void };
}

export class ItemView {
	leaf: WorkspaceLeaf;
	containerEl: HTMLElement = document.createElement('div');
	app: App = { workspace: { requestSaveLayout: () => {} } };

	constructor(leaf: WorkspaceLeaf) {
		this.leaf = leaf;
	}

	async setState(_state: any, _result: any) {
		return;
	}
}

export class Plugin {}

export interface CreateElOpts {
	text?: string;
	cls?: string;
	attr?: Record<string, string | number | boolean>;
}

export class PluginSettingTab {
	app: App;
	plugin?: Plugin;
	containerEl: HTMLElement & { empty?: () => void; createEl?: (tag: string, opts?: CreateElOpts) => HTMLElement };

	constructor(app: App, plugin?: Plugin) {
		this.app = app;
		this.plugin = plugin;
		const el: any = document.createElement('div');
		el.empty = function () {
			while (this.firstChild) this.removeChild(this.firstChild);
		};
		el.createEl = function (tag: string, opts?: CreateElOpts) {
			const child = document.createElement(tag);
			if (opts) {
				if (opts.text !== undefined) child.textContent = opts.text;
				if (opts.cls) child.className = opts.cls;
				if (opts.attr && typeof opts.attr === 'object') {
					Object.entries(opts.attr).forEach(([k, v]) => child.setAttribute(k, String(v)));
				}
			}
			this.appendChild(child);
			return child;
		};
		this.containerEl = el;
	}
}

export interface ToggleComponent {
	setValue(v: boolean): { onChange(fn: (v: boolean) => void): void };
}

export interface TextComponent {
	setValue(v: string): {
		setPlaceholder(p: string): { onChange(fn: (v: string) => void): void };
		onChange(fn: (v: string) => void): void;
	};
	setPlaceholder(p: string): { onChange(fn: (v: string) => void): void };
}

export interface ColorComponent {
	setValue(v: string): { onChange(fn: (v: string) => void): void };
}

export interface ButtonComponent {
	setButtonText(t: string): void;
	onClick(fn: (e?: any) => void): void;
}

export class Setting {
	containerEl: HTMLElement;
	element: HTMLElement;
	descEl: HTMLElement;

	private _toggleOnChange?: (v: boolean) => void;
	private _textOnChange?: (v: string) => void;
	private _colorOnChange?: (v: string) => void;
	private _buttonOnClick?: (e?: any) => void;

	constructor(containerEl: HTMLElement) {
		this.containerEl = containerEl;
		this.element = document.createElement('div');
		this.element.className = 'setting';
		this.descEl = document.createElement('div');
		this.descEl.className = 'setting-desc';
		this.element.appendChild(this.descEl);
		(this.element as any)._setting = this;
		this.containerEl.appendChild(this.element);
	}

	setName(name: string) {
		const nameEl = document.createElement('div');
		nameEl.className = 'setting-name';
		nameEl.textContent = name;
		this.element.insertBefore(nameEl, this.descEl);
		return this;
	}

	setDesc(desc: string) {
		this.descEl.innerHTML = desc;
		return this;
	}

	addToggle(cb: (c: ToggleComponent) => void) {
		const comp: ToggleComponent = {
			setValue: (_v: boolean) => ({
				onChange: (fn: (val: boolean) => void) => {
					this._toggleOnChange = fn;
				},
			}),
		};
		cb(comp);
		return this;
	}

	triggerToggle(value: boolean) {
		this._toggleOnChange && this._toggleOnChange(value);
	}

	addText(cb: (c: TextComponent) => void) {
		const comp: TextComponent = {
			setValue: (_v: string) => ({
				setPlaceholder: (_p: string) => ({
					onChange: (fn: (val: string) => void) => {
						this._textOnChange = fn;
					},
				}),
				onChange: (fn: (val: string) => void) => {
					this._textOnChange = fn;
				},
			}),
			setPlaceholder: (_p: string) => ({ onChange: (_fn: any) => {} }),
		} as unknown as TextComponent;
		cb(comp);
		return this;
	}

	triggerText(value: string) {
		this._textOnChange && this._textOnChange(value);
	}

	addColorPicker(cb: (c: ColorComponent) => void) {
		const comp: ColorComponent & { _set?: (v: string) => void } = {
			setValue: (_v: string) => ({ onChange: (fn: (val: string) => void) => (this._colorOnChange = fn) }),
		} as any;
		comp._set = (v: string) => {
			this._colorOnChange && this._colorOnChange(v);
		};
		cb(comp);
		return this;
	}

	triggerColor(value: string) {
		this._colorOnChange && this._colorOnChange(value);
	}

	addButton(cb: (c: ButtonComponent) => void) {
		const comp: ButtonComponent = {
			setButtonText: (_t: string) => {},
			onClick: (fn: (e?: any) => void) => (this._buttonOnClick = fn),
		};
		cb(comp);
		return this;
	}

	clickButton(e?: any) {
		this._buttonOnClick && this._buttonOnClick(e);
	}
}
