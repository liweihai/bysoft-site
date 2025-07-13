import Link from 'next/link'

interface Props {
  text: string
}

const Category = ({ text }: Props) => {
  return (
    <Link
      href={`/category/${text}`}
      className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 mr-3 text-sm font-medium uppercase"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Category