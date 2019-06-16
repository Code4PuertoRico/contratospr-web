import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { searchEntities } from '../../lib/api';

class EntitySelect extends React.PureComponent {
  loadEntityOptions = async (inputValue: string) => {
    let query = { query: inputValue, page: 1, pageSize: 20 };

    if (this.props.contractors.length > 0) {
      query.contractor = this.props.contractors.map((options) => options.value);
    }

    if (this.props.services.length > 0) {
      query.service = this.props.services.map((options) => options.value);
    }

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
        loadOptions={this.loadEntityOptions}
        defaultValue={this.props.entities}
        instanceId="entities-select"
        onChange={this.props.onChange}
      />
    );
  }
}

export default EntitySelect;
