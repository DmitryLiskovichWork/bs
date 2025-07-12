import { observer } from "mobx-react-lite";

type Props = {
  className?: string;
  onClick?: () => void;
}

export const Cell = observer(({ className, onClick }: Props) => {
  const classes = [
    'cell',
    ...(className ? [className] : []),
  ]

  return  (
    <div 
      className={classes.join(' ')}
      onClick={onClick}
    />
  )
})