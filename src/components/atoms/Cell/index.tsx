type Props = {
  className?: string;
  onClick?: () => void;
}

export const Cell = ({ className, onClick }: Props) => {
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
}