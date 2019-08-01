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
        defaultOptions={true}
        loadOptions={this.loadServiceOptions}
        defaultValue={this.props.services}
        instanceId="services-select"
        onChange={this.props.onChange}
        placeholder="Selecciona tipos de servicios"
      />
    );
  }
}

export default ServiceSelect;
