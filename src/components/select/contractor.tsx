import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { searchContractors } from '../../lib/api';

class ContractorSelect extends React.PureComponent {
  loadContractorOptions = async (inputValue) => {
    let query = {
      query: inputValue,
      page: 1,
      pageSize: 20
    };

    if (this.props.entities.length > 0) {
      query.entity = this.props.entities.map((options) => options.value);
    }

    if (this.props.services.length > 0) {
      query.service = this.props.services.map((options) => options.value);
    }

    let data = await searchContractors(query);

    return data.results.map((contractor) => {
      return {
        value: contractor.id,
        label: contractor.name
      };
    });
  };

  render() {
    return (
      <AsyncSelect
        isMulti={true}
        loadOptions={this.loadContractorOptions}
        defaultValue={this.props.contractors}
        instanceId="contractors-select"
        onChange={this.props.onChange}
      />
    );
  }
}

export default ContractorSelect;
