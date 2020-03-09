/**
 * BLOCK: dhis2-analytics
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';
import axios from 'axios';
import { BorderAll, Help, Public, BarChart } from '@material-ui/icons';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Subject from '@material-ui/icons/Subject';
import Link from '@material-ui/icons/Link';
// import logo from '../assets/img/dhis2_short.png';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { Component } = wp.element;
const { PanelBody, SelectControl, TextControl, ToggleControl } = wp.components;

// const logo = require('../assets/img/dhis2_short.png');

// eslint-disable-next-line no-undef
const dhis_settings = osxGlobal.dhis2setting;
const dhis2_uri = dhis_settings.dhis2_uri;
const dhis2_username = dhis_settings.dhis2_username;
const dhis2_password = dhis_settings.dhis2_password;
const dashboard_url = dhis2_uri + '/api/dashboards.json?paging=false&fields=id,name,dashboardItems[id,name,text,type,reportTable[id,displayName],chart[id,displayName],map[id,displayName],resources[id,displayName]]';
const version_url = dhis2_uri+'/api/system/info';

const getDhis2Version = async()=>{
	const system = await axios.get(version_url, {
		params: {},
		withCredentials: true,
		auth: {
			username: dhis2_username,
			password: dhis2_password,
		},
	});
	return system.data;
}
const getDashboards = async () => {
	const res = await axios.get(dashboard_url, {
		params: {},
		withCredentials: true,
		auth: {
			username: dhis2_username,
			password: dhis2_password,
		},
	});
	return res.data;
};
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('osx/dhis2-analytics', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('DHIS2 Analytics'), // Block title.
	icon: 'chart-bar', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__('DHIS2'),
		__('DHIS2 Dashboards'),
		__('DHIS2 Web Portal'),
	],

	attributes: {
		dashboard_description: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		dashboard_items: {
			type: 'array',
			default: [],
		},

		dhis_info: {
			type: 'array',
			default: [],
		},

		checkboxField: {
			type: 'boolean',
			default: true,
		},
		radioField: {
			type: 'string',
			default: 'yes',
		},
		textField: {
			type: 'string',
		},
		displayItem: {
			type: 'string',
			default: 'single',
		},
		displayMode: {
			type: 'string',
			default: 'slideshow',
		},
		displaySize: {
			type: 'string',
			default: 'fullwidth',
		},
		displayWidth: {
			type: 'string',
		},
		displayHeight: {
			type: 'string',
		},
		enableCaption: {
			type: 'boolean',
			default: false,
		},
		shuffleItems: {
			type: 'boolean',
			default: false,
		},
		itemsPerRow: {
			type: 'string',
			default: '2',
		},
		slideshowSettings: {
			type: 'object',
			default: {},
		},
	},
	edit: class extends Component {
		constructor() {
			super(...arguments);
			this.state = { dhisdata: [], expanded: null , system_info: []};
		}

		onChangeContent = (newContent) => {
			this.props.setAttributes({ content: newContent });
		}

		onChangeCheckboxField = (newValue) => {
			this.props.setAttributes({ checkboxField: newValue });
		}

		onChangeDisplayItem = (newValue) => {
			this.props.setAttributes({ displayItem: newValue });
			this.props.setAttributes({ dashboard_items: [] });
		};

		onChangeDisplayMode = (newValue) => {
			this.props.setAttributes({ displayMode: newValue });
		};

		onChangeDisplaySize = (newValue) => {
			this.props.setAttributes({ displaySize: newValue });
		};

		onChangeDisplayWidth = (newValue) => {
			this.props.setAttributes({ displayWidth: newValue });
		};

		onChangeItemsPerRow = (newValue) => {
			this.props.setAttributes({ itemsPerRow: newValue });
		};

		onChangeDisplayHeight = (newValue) => {
			this.props.setAttributes({ displayHeight: newValue });
		};

		onChangeEnableCaption = (newValue) => {
			this.props.setAttributes({ enableCaption: newValue });
		};

		onChangeShuffleItems = (newValue) => {
			this.props.setAttributes({ shuffleItems: newValue });
		};

		onChangeSlideShowSettings = (key) => (value) => {
			let currentSettings = this.props.attributes.slideshowSettings;
			currentSettings = { ...currentSettings, [key]: value };
			this.props.setAttributes({ slideshowSettings: currentSettings });
		};

		handleChange = panel => (event, isExpanded) => {
			this.setState({
				expanded: isExpanded ? panel : false,
			});
		};


		componentDidMount() {
			getDhis2Version().then(system =>{
				// console.log(system);
				let instance_info = {
					"version" : system.version, 
					"system_name": system.systemName, 
					"id": system.systemId, 
					"revision": system.revision
				};
				// console.log(instance_info);
				this.setState(
					{ system_info: instance_info }
				);

				this.props.setAttributes({dhis_info: this.state.system_info});
			});

			getDashboards().then(data => {
				const filtered = data.dashboards.map(dashboard => {
					let dashboardItems = dashboard.dashboardItems.map(item => {
						return { ...item, data: item.reportTable || item.map || item.chart };
					}).filter(di => {
						return di.data;
					});

					dashboard.dashboardItems.filter(item => {
						return item.type === 'RESOURCES';
					}).forEach(i => {
						const foundItems = i.resources.map(r => {
							return { ...i, resources: r, data: r };
						});

						dashboardItems = [...dashboardItems, ...foundItems];
					});

					const textItems = dashboard.dashboardItems.filter(item => {
						return item.type === 'TEXT';
					}).map(i => {
						return { ...i, text: { displayName: 'Text Description', id: i.id, text: i.text }, data: { displayName: 'Text Description', id: i.id, text: i.text } };
					});

					dashboardItems = [...dashboardItems, ...textItems];

					return { ...dashboard, dashboardItems };
				});
				this.setState(
					{ dhisdata: { dashboards: filtered } }
				);
			});
		}
		updateSelectedItems = (item) => (e) => {
			const checked = e.target.checked;
			let { attributes: { dashboard_items, displayItem } } = this.props;
			if (checked) {
				if (displayItem === 'single') {
					if (dashboard_items.indexOf(item) === -1) {
						dashboard_items = [item];
					}
				} else if (displayItem === 'multiple') {
					if (dashboard_items.indexOf(item) === -1) {
						dashboard_items = [...dashboard_items, item];
					}
				}
			} else {
				dashboard_items = dashboard_items.filter(i => {
					return i.data.id !== item.data.id;
				});
			}
			this.props.setAttributes({ dashboard_items });
		};

		render() {
			console.log(this.state.system_info);
			const { dashboards } = this.state.dhisdata;

			const { displayItem, displayMode, displaySize, displayWidth, displayHeight, enableCaption, slideshowSettings, itemsPerRow, shuffleItems } = this.props.attributes;
			let listDashboards = null;
			if (dashboards) {
				listDashboards = dashboards.filter(d => d.dashboardItems.length > 0).map((dashboard) =>
					<ExpansionPanel key={dashboard.id} expanded={this.state.expanded === dashboard.id} onChange={this.handleChange(dashboard.id)}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography className="dashboard-name" style={{ marginTop: 0, marginBottom: 0 }}>{dashboard.name}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>

							<ul className="dashboard-items" style={{ margin: 0, padding: 0 }}>
								{
									dashboard.dashboardItems.map((dashboardItem) => {
										const type = dashboardItem.type;
										let icon = <Help className="item-type-icon" />;
										if (type === 'CHART') {
											icon = <BarChart className="item-type-icon" />;
										} else if (type === 'REPORT_TABLE') {
											icon = <BorderAll className="item-type-icon" />;
										} else if (type === 'MAP') {
											icon = <Public className="item-type-icon" />;
										}else if (type === 'TEXT') {
											icon = <Subject className="item-type-icon" />;
										}else if (type === 'RESOURCES') {
											icon = <Link className="item-type-icon" />;
										}
										return <li key={dashboardItem.data.id} className="dashboard-item">
											<label htmlFor={dashboardItem.data.id} className="dashboard-item-label">
												{icon}
												<span className="dashboard-item-name">{dashboardItem.data.displayName}</span>
												<input type="checkbox"
													checked={this.props.attributes.dashboard_items.map(i => i.data.id).indexOf(dashboardItem.data.id) !== -1}
													value={dashboardItem.data.id}
													id={dashboardItem.data.id}
													onChange={this.updateSelectedItems(dashboardItem)}
													className="select-items"
													style={{ marginLeft: 'auto' }}
												/>
											</label>
										</li>;
									})
								}
							</ul>
						</ExpansionPanelDetails>
					</ExpansionPanel>

				);
			} else {
				listDashboards = 'No Dashboard Found';
			}
			return (
				<div>
					<h4 className="dhis2-header" style={{ marginTop: '2.33em', marginBottom: '1.33em', lineHeight: '1.5' }}> <div class="block-logo" ></div>DHIS2 Analytics Block</h4>
					<ul className="analytics-dashboards" style={{ margin: 0, padding: 0 }}>
						{
							(dashboards) ? listDashboards : <CircularProgress />
						}
					</ul>
					<InspectorControls>
						<PanelBody
							title={__('Display settings')}
							initialOpen={true}
						>
							<SelectControl
								label="Display Items"
								value={displayItem}
								options={[
									{ value: 'single', label: 'Single Item' },
									{ value: 'multiple', label: 'Multiple Items' },
								]}
								onChange={this.onChangeDisplayItem} />
							{displayItem === 'multiple' ? <SelectControl
								label="Display Mode"
								value={displayMode}
								options={[
									{ value: 'slideshow', label: 'Slideshow Display' },
									{ value: 'grid', label: 'Grid Display' },
								]}
								onChange={this.onChangeDisplayMode} /> : null}

							<SelectControl
								label="Display Size"
								value={displaySize}
								options={[
									{ value: 'fullwidth', label: 'Full Size' },
									{ value: 'custom', label: 'Custom size' },
								]}
								onChange={this.onChangeDisplaySize} />

							{displaySize === 'custom' ? <div>
								{displayItem === 'single' || displayMode === 'grid' ? <TextControl label="Width" value={displayWidth} onChange={this.onChangeDisplayWidth} /> : null}
								<TextControl label="Height" value={displayHeight} onChange={this.onChangeDisplayHeight} />
							</div> : null}
							{displayItem === 'multiple' && displayMode === 'grid' ? <TextControl label="Items Per Row" value={itemsPerRow} onChange={this.onChangeItemsPerRow} /> : null}
							{displayItem === 'multiple' ? <ToggleControl label="Shuffle Items" checked={shuffleItems} onChange={this.onChangeShuffleItems} /> : null }
							<ToggleControl label="Enable Captions" checked={enableCaption} onChange={this.onChangeEnableCaption} />
						</PanelBody>
						{displayItem === 'multiple' && displayMode === 'slideshow' ? <PanelBody title={__('Slideshow Settings')} initialOpen={false}>
							<TextControl label="Slide Duration" value={slideshowSettings.pause} onChange={this.onChangeSlideShowSettings('pause')} />
						</PanelBody> : null}
					</InspectorControls>
				</div>
			);
		}
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: () => {
		return (
			null
		);
	},
});
