import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { searchServices } from '../../lib/api';

type Props = { services: Array<any>; onChange: any };

class ServiceSelect extends React.PureComponent<Props> {
  static propTypes = {
    services: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  loadServiceOptions = async (inputValue: string) => {
    let data = await searchServices({
      query: inputValue,
      page: 1,
      pageSize: 20,
    });

    return data.results.map((service: { id: string; name: string }) => {
      return {
        value: service.id,
        label: service.name,
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
