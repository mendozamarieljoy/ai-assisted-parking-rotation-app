const Button = ({
  children,
  onClick,
  className,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md transition-all border border-slate-600 text-xs ${className}`}
    >
      {children}
    </button>
  );
};

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default Button;
