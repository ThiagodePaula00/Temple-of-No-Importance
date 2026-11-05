type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className='min-h-screen bg-(--page-background) font-[Times_New_Roman,Times,serif] text-(--text-color) transition-colors duration-200'>
      <div className='max-w-5xl mx-auto'>{children}</div>
    </div>
  );
}