export type ButtonProps = {
  ref?: React.Ref<HTMLButtonElement>;
  id?: string;
  children?: React.ReactNode;
  label?: string;
  onPress: () => void;
  className?: string;
  'aria-label'?: string;
};
