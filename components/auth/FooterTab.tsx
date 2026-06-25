interface FooterTabProps {
  paragraph: string;
  link: string;
}

export default function FooterTab({ paragraph, link }: FooterTabProps) {
  return (
    <p className="text-center text-xs text-slate-500 dark:text-slate-500 lg:text-left">
      {paragraph}
      <a
        href="#"
        className=" ml-2 font-semibold underline hover:text-slate-700 dark:hover:text-slate-300"
      >
        {link}
      </a>
      .
    </p>
  );
}
