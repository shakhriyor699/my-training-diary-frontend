type UsersPageHeaderProps = {
  title: string;
  description: string;
};

export function UsersPageHeader({
  title,
  description,
}: UsersPageHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="text-lg text-white/46">{description}</p>
    </header>
  );
}
