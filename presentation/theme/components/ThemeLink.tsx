import { Link, LinkProps } from 'expo-router'

import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends LinkProps {}

export const ThemeLink = ({style,...rest}: Props) => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <Link
      style={[
        {
          color: primaryColor,
        },
        style,
      ]}
      {...rest}
    ></Link>
  );
};
