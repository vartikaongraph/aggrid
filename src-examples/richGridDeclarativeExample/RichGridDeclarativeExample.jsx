import React, {Component} from "react";
import {AgGridColumn, AgGridReact} from "@ag-grid-community/react";
import RowDataFactory from "./RowDataFactory";
import SkillsCellRenderer from './SkillsCellRenderer.jsx';
import NameCellEditor from './NameCellEditor.jsx';
import RefData from './RefData';
import SkillsFilter from './SkillsFilter.jsx';
import HeaderGroupComponent from './HeaderGroupComponent.jsx';
import SortableHeaderComponent from './SortableHeaderComponent.jsx';

import "./RichGridDeclarativeExample.css";

// for community features
// import {AllCommunityModules} from "@ag-grid-community/all-modules";

// for enterprise features
import {AllModules} from "@ag-grid-enterprise/all-modules";

export default class RichGridDeclarativeExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: new RowDataFactory().createRowData(),
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-times"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
                groupExpanded: '<i class="far fa-minus-square"/>',
                groupContracted: '<i class="far fa-plus-square"/>'
            }
        };
    }

    /* Grid Events we're listening to */
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;

        this.calculateRowCount();
    };

    onCellClicked = (event) => {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    };

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data.name);
    };

    /* Demo related methods */
    onToggleSidebar = (event) => {
        this.setState({sideBar: event.target.checked});
    };

    invokeSkillsFilterMethod = () => {
        let skillsFilter = this.api.getFilterInstance('skills');
        let componentInstance = skillsFilter.getFrameworkComponentInstance();
        componentInstance.helloFromSkillsFilter();
    };


    static countryCellRenderer(params) {
        if (params.value) {
            return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='http://flags.fmcdn.net/data/flags/mini/${RefData.COUNTRY_CODES[params.value]}.png'> ${params.value}`;
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{width: '900px'}}>
                <h1>Ag Grid</h1>
                <div style={{marginTop: 10}}>
                      
                    <div style={{height: 400, width: 900}} className="ag-theme-balham">
                        <AgGridReact
                            // listening for events
                            onGridReady={this.onGridReady}
                            onRowSelected={this.onRowSelected}
                            onCellClicked={this.onCellClicked}
                            onModelUpdated={this.calculateRowCount}

                            // binding to an object property
                            icons={this.state.icons}

                            // binding to array properties
                            rowData={this.state.rowData}

                            // register all modules (row model, csv/excel, row grouping etc)
                            modules={AllModules}

                            // no binding, just providing hard coded strings for the properties
                            // boolean properties will default to true if provided (ie suppressRowClickSelection => suppressRowClickSelection="true")
                            suppressRowClickSelection
                            rowSelection="multiple"
                            groupHeaders

                            // setting default column properties
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: true,
                                headerComponentFramework: SortableHeaderComponent,
                                headerComponentParams: {
                                    menuIcon: 'fa-bars'
                                }
                            }}>
                            <AgGridColumn headerName="#" width={30}
                                          checkboxSelection sortable={false} suppressMenu filter={false} pinned>
                            </AgGridColumn>
                            <AgGridColumn headerName="Employee" headerGroupComponentFramework={HeaderGroupComponent}>
                                <AgGridColumn field="name" width={150}
                                              cellEditorFramework={NameCellEditor}
                                              enableRowGroup enablePivot pinned editable/>
                                <AgGridColumn field="country" width={150}
                                              cellRenderer={RichGridDeclarativeExample.countryCellRenderer}
                                              filterParams={{
                                                  cellRenderer: RichGridDeclarativeExample.countryCellRenderer,
                                                  cellHeight: 20
                                              }}
                                              enableRowGroup enablePivot pinned editable/>
                            </AgGridColumn>
                            <AgGridColumn headerName="IT Skills">
                                <AgGridColumn field="skills" width={120} enableRowGroup enablePivot sortable={false}
                                              cellRendererFramework={SkillsCellRenderer}
                                              filterFramework={SkillsFilter}/>
                            </AgGridColumn>
                            <AgGridColumn headerName="Contact">
                                <AgGridColumn field="mobile" width={150} filter="text"/>
                                <AgGridColumn field="landline" width={150} filter="text"/>
                                <AgGridColumn field="address" width={500} filter="text"/>
                            </AgGridColumn>
                        </AgGridReact>
                    </div>
                </div>
            </div>
        );
    }
}
