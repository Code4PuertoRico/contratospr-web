import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { searchServices } from '../../lib/api';

class ServiceSelect extends React.PureComponent {
  loadServiceOptions = async (inputValue) => {
    let query = {
      query: inputValue,
      page: 1,
      pageSize: 20
    };

    if (this.props.contractors.length > 0) {
      query.contractor = this.props.contractors.map((options) => options.value);
    }

    if (this.props.entities.length > 0) {
      query.entity = this.props.entities.map((options) => options.value);
    }

    let data = await searchServices(query);

    return data.results.map((service) => {
      return {
        value: service.id,
        label: service.name
      };
    });
  };

  render() {
    return (
      <AsyncSelect
        isMulti={true}
        loadOptions={this.loadServiceOptions}
        defaultValue={this.props.services}
        instanceId="services-select"
        onChange={this.props.onChange}
      />
    );
  }
}

export default ServiceSelect;
