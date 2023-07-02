type TitleProps = {
   title: string
   shouldShowTooltip: boolean
   additionalClasses: string
}

export const Title = ({ title, shouldShowTooltip, additionalClasses }: TitleProps) => (
   <h1
      className={`text-2xl lg:text-3xl font-lalezar line-clamp-2 ${additionalClasses}`}
      title={shouldShowTooltip ? title : ''}
   >
      {title}
   </h1>
)
