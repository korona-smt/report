import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import Select, { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import { Theme } from '@mui/material/styles';

type SelectItem = Pick<MenuItemProps, 'value'> & {
  label: string;
  selected: boolean;
};
type MultipleSelectProps<P> = SelectProps<P> & {
  items: SelectItem[];
  theme: Theme;
};
export type MultipleSelectChangeEvent<E> = SelectChangeEvent<E>;

export default function MultipleSelect<P = unknown>(props: MultipleSelectProps<P>) {
  const {items, theme, ...selectProps} = props;
  return (
    <Select
      multiple
      {...selectProps}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          value={item.value}
          style={getStyles(item.selected, theme)}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
}

function getStyles(selected: boolean, theme: Theme) {
  return {
    fontWeight:
      selected
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
