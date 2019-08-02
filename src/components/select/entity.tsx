import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/lib/Async';
import { searchEntities } from '../../lib/api';

type Props = { entities: Array<any>; onChange: any };

class EntitySelect extends React.PureComponent<Props> {
  static propTypes = {
    entities: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

  loadEntityOptions = async (inputValue: string) => {
    let data = await searchEntities({
      query: inputValue,
      page: 1,
      pageSize: 20
    });

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
