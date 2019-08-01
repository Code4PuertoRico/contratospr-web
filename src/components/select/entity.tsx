import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { searchEntities } from '../../lib/api';

class EntitySelect extends React.PureComponent {
  loadEntityOptions = async (inputValue: string) => {
    let query = { query: inputValue, page: 1, pageSize: 20 };

    let data = await searchEntities(query);

    return data.results.map((entity: { id: string; name: string }) => {
      return {
        value: entity.id,
        label: entity.name
      };
    });
  };

  render() {
    return (
      <AsyncSelect
        isMulti={true}
        defaultOptions={true}
        loadOptions={this.loadEntityOptions}
        defaultValue={this.props.entities}
        instanceId="entities-select"
        onChange={this.props.onChange}
        placeholder="Selecciona entidades gubernamentales"
      />
    );
  }
}

export default EntitySelect;
